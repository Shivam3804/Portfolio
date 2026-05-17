import { useState } from "react";

export default function Certificates({ information }) {

  const certificates =
    information?.certificates || [];

  const [selected, setSelected] =
    useState(certificates[0]);

    const getEmbedLink = (url) => {

  if (!url) return null;

  /* Google Drive */

  if (url.includes("drive.google.com")) {

    const match =
      url.match(/\/d\/(.*?)\//);

    if (match?.[1]) {

      return `https://drive.google.com/file/d/${match[1]}/preview`;

    }
  }

  /* IBM / CognitiveClass */

  if (
    url.includes(
      "courses.cognitiveclass.ai"
    )
  ) {
    return url;
  }

  return url;
};

  return (
    <section className="cert-section">

      <div className="section-heading">

        <span className="section-tag">
          // 05. certificates
        </span>

        <h2 className="section-title">
          Certifications
        </h2>

      </div>

      <div className="cert-layout">

        {/* LEFT */}

        <div className="cert-left">

          {certificates.map((cert, i) => (

            <button
              key={i}
              className={
                selected?.title === cert.title
                  ? "cert-card active"
                  : "cert-card"
              }
              onClick={() => setSelected(cert)}
            >

              <div className="cert-card-top">

                <span className="cert-year">
                  {cert.year}
                </span>

                {cert.score && (

                  <span className="cert-score">

                    {cert.score}
                    {cert["score-type"] === "Percentage"
                      ? "%"
                      : ""}

                  </span>

                )}

              </div>

              <h3 className="cert-title">
                {cert.title}
              </h3>

              <p className="cert-issuer">
                {cert.issuer}
              </p>

            </button>

          ))}

        </div>

        {/* RIGHT */}

        <div className="cert-right">

          <div className="cert-preview">

            {/* Image */}

            <div className="cert-image-wrap">

            {selected?.link ? (

                <iframe
                    src={getEmbedLink(selected.link)}
                    title={selected.title}
                    className="cert-frame"
                />

            ) : (

                <div className="cert-image">

                <span>
                    CERTIFICATE
                </span>

                </div>

            )}

            </div>

            {/* Details */}

            <div className="cert-details">

              <span className="cert-detail-label">
                ISSUED BY
              </span>

              <h3 className="cert-detail-title">
                {selected?.issuer}
              </h3>

              <p className="cert-detail-desc">
                {selected?.title}
              </p>

              <div className="cert-info-grid">

                <div className="cert-info-item">

                  <span className="info-label">
                    YEAR
                  </span>

                  <span className="info-value">
                    {selected?.year}
                  </span>

                </div>

                {selected?.score && (

                  <div className="cert-info-item">

                    <span className="info-label">
                      SCORE
                    </span>

                    <span className="info-value">
                      {selected.score}

                      {selected["score-type"] === "Percentage"
                        ? "%"
                        : ""}
                    </span>

                  </div>

                )}

              </div>

              {selected?.link && (

                <a
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer"
                  className="cert-link"
                >
                  View Certificate
                </a>

              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}