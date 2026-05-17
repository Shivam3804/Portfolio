import asyncio
import json
import re

import fitz
import faiss
import numpy as np
from google import genai


with open('Config/rag.config.json', 'r') as file:
    data = json.load(file)

api_key = data['google_key']
model_name = data['embedder']


class ResumeVectorStore:
    def __init__(self, model_name=model_name):
        self.client = genai.Client(api_key=api_key)
        self.model = model_name
        self.index = None
        self.metadata = None

    # ---------------------------
    # Helper
    # ---------------------------
    def run_blocking(self, fn, *args, **kwargs):
        return asyncio.to_thread(fn, *args, **kwargs)

    # ---------------------------
    # STEP 1: CHUNK PDF
    # ---------------------------
    async def chunk_file(self, path: str):
        def _chunk():
            resume = fitz.open(path)

            all_text = ''
            page_ranges = []
            cursor = 0

            for page in resume:
                text = page.get_text()
                start = cursor
                all_text += '\n' + text
                cursor = len(all_text)
                end = cursor
                page_ranges.append((start, end))

            CHUNKS = [
                'PROFILE SUMMARY', 'EDUCATION', 'SKILLS',
                'EXPERIENCE', 'PROJECTS', 'CERTIFICATIONS', 'ACHIEVEMENTS'
            ]

            pattern = r'^\s*(%s)\s*$' % '|'.join(map(re.escape, CHUNKS))
            matches = list(re.finditer(pattern, all_text, re.MULTILINE))

            section_ranges = []

            if matches:
                first = matches[0].start()
                section_ranges.append(("CONTACTS", 0, first))

            for i, match in enumerate(matches):
                start = match.end()
                end = matches[i + 1].start() if i + 1 < len(matches) else len(all_text)

                section_ranges.append((match.group().strip(), start, end))

            page_data = [dict() for _ in range(len(page_ranges))]

            for section, s_start, s_end in section_ranges:
                for i, (p_start, p_end) in enumerate(page_ranges):
                    overlap_start = max(s_start, p_start)
                    overlap_end = min(s_end, p_end)

                    if overlap_start < overlap_end:
                        content = all_text[overlap_start:overlap_end].strip()

                        if content:
                            page_data[i].setdefault(section, "")
                            page_data[i][section] += "\n" + content

            # LINKS
            all_links = []
            for page_num, page in enumerate(resume):
                for link in page.get_links():
                    if "uri" not in link:
                        continue

                    rect = link["from"]
                    words = page.get_text("words")

                    link_text = [
                        w[4]
                        for w in words
                        if rect.intersects(fitz.Rect(w[:4]))
                    ]

                    all_links.append({
                        "page": page_num + 1,
                        "text": " ".join(link_text),
                        "url": link["uri"]
                    })

            return page_data, all_links

        return await asyncio.to_thread(_chunk)

    # ---------------------------
    # STEP 2: SPLITTERS
    # ---------------------------
    def split_projects(self, text):
        pattern = r'\n(?=[A-Z][^\n]+\|Skills Stack:)'
        return [p.strip() for p in re.split(pattern, text) if p.strip()]

    def split_experience(self, text):
        pattern = r'\n(?=[A-Z][a-zA-Z ]+\n[A-Za-z]{3,9}\s\d{4})'
        return [p.strip() for p in re.split(pattern, text) if p.strip()]

    # ---------------------------
    # STEP 3: PROCESS PAGES
    # ---------------------------
    async def process_pages(self, path: str):
        pages, links = await self.chunk_file(path)

        processed_pages = []

        for page in pages:
            new_page = {}

            for section, text in page.items():
                if section == "PROJECTS":
                    new_page[section] = self.split_projects(text)
                elif section == "EXPERIENCE":
                    new_page[section] = self.split_experience(text)
                else:
                    new_page[section] = text

            processed_pages.append(new_page)

        return processed_pages, links

    # ---------------------------
    # STEP 4: FLATTEN
    # ---------------------------
    def flatten_pages(self, pages):
        data = []

        for page in pages:
            for section, content in page.items():
                if isinstance(content, list):
                    for item in content:
                        data.append({"section": section, "text": item})
                else:
                    data.append({"section": section, "text": content})

        return data

    # ---------------------------
    # STEP 5: CLEAN + MERGE
    # ---------------------------
    def clean_text(self, text):
        return text.replace('\x88', '•').strip()

    def prepare_data(self, content_data, links_data):
        unified = []

        for item in content_data:
            unified.append({
                "text": self.clean_text(item["text"]),
                "type": "content",
                "section": item["section"]
            })

        for link in links_data:
            unified.append({
                "text": self.clean_text(link["text"]),
                "type": "link",
                "url": link["url"],
                "page": link["page"]
            })

        return unified

    # ---------------------------
    # STEP 6: EMBEDDING
    # ---------------------------
    async def create_embedding(self, data):
        def _run():
            texts = [item["text"] for item in data]

            response = self.client.models.embed_content(
                model=self.model,
                contents=texts,
                config={"output_dimensionality": 3072}
            )

            embeddings = np.array(
                [e.values for e in response.embeddings],
                dtype="float32"
            )

            faiss.normalize_L2(embeddings)

            dim = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dim)
            self.index.add(embeddings)

            self.metadata = data

        await asyncio.to_thread(_run)

    # ---------------------------
    # STEP 7: SAVE / LOAD
    # ---------------------------
    async def save(self, index_path="Resources/faiss.index", meta_path="Resources/metadata.json"):
        await asyncio.to_thread(faiss.write_index, self.index, index_path)

        def _save():
            with open(meta_path, "w") as f:
                json.dump(self.metadata, f, indent=2)

        await asyncio.to_thread(_save)

    async def load(self, index_path="Resources/faiss.index", meta_path="Resources/metadata.json"):
        def _load():
            self.index = faiss.read_index(index_path)

            with open(meta_path, "r") as f:
                self.metadata = json.load(f)

        await asyncio.to_thread(_load)

    # ---------------------------
    # PIPELINE
    # ---------------------------
    async def build_from_pdf(self, path: str):
        pages, links = await self.process_pages(path)

        flat = self.flatten_pages(pages)
        combined = self.prepare_data(flat, links)

        await self.create_embedding(combined)

        return self.index, self.metadata

    # ---------------------------
    # SEARCH
    # ---------------------------
    async def search(self, query, k=5):
        def _run():
            response = self.client.models.embed_content(
                model=self.model,
                contents=[query],
                config={"output_dimensionality": 3072}
            )

            q = np.array([response.embeddings[0].values], dtype="float32")
            faiss.normalize_L2(q)

            D, I = self.index.search(q, k * 2)

            results = []
            q_lower = query.lower()

            for idx, score in zip(I[0], D[0]):
                item = self.metadata[idx].copy()

                if not any(w in q_lower for w in ['see', 'show', 'link', 'redirect', 'url']):
                    if item.get('type') == 'link':
                        score *= 0.5

                if "project" in q_lower and item.get("section") == "PROJECTS":
                    score *= 1.3

                if "experience" in q_lower and item.get("section") == "EXPERIENCE":
                    score *= 1.3

                if "skill" in q_lower and item.get("section") == "SKILLS":
                    score *= 1.2

                item["score"] = float(min(score, 1.0))
                results.append(item)
                
            return sorted(results, key=lambda x: x["score"], reverse=True)[:k]

        return await asyncio.to_thread(_run)


ResumeVectorClient = ResumeVectorStore()
