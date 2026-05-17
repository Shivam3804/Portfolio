import { useEffect, useRef } from "react";

export default function About({ information }) {

  const {
    about_me,
    education,
    address,
    currently_learning,
    contact
  } = information;
  const timelineRef = useRef(null);

  // Dynamic education list from JSON
  const eduList = Object.entries(education).map(([key, value]) => ({
    level:
      key === "ssc"
        ? "Secondary Education"
        : key === "hsc"
        ? "Higher Secondary Education"
        : value["branch/stream"]
        ? value["branch/stream"]
        : key,

    name: value.name,

    location: value.location,

    board: value.board,

    score:
      value["score-type"] === "CGPA"
        ? `CGPA ${value.score}`
        : `${value.score}%`,
  }));

  useEffect(() => {

  const timeline = timelineRef.current;

  if (!timeline) return;

  const maxScroll =
    timeline.scrollHeight - timeline.clientHeight;

  // Only run if scroll exists
  if (maxScroll <= 0) return;

  const runPreview = async () => {

    // small delay after load
    await new Promise(r => setTimeout(r, 1200));

    // scroll to bottom
    timeline.scrollTo({
      top: maxScroll,
      behavior: "smooth",
    });

  };

  runPreview();

  }, []);

  return (
    <section className="about-section">

      <div className="section-heading">
        <span className="section-tag">// 01. about</span>
        <h2 className="section-title">Who I Am</h2>
      </div>

      <div className="about-body">

        {/* LEFT */}
        <div className="about-left">

          <div className="about-texts">

           {about_me
            .filter((_, i) => i !== 1)
            .map((text, i) => (
              <p key={i} className="about-intro">
                {text}
              </p>
          ))}
          </div>

          <div className="about-meta">

            <div className="about-meta-item">
              <span className="about-meta-key">
                LOCATION
              </span>

              <span className="about-meta-val">
                {address.current}
              </span>
            </div>

            <div className="about-meta-item">
              <span className="about-meta-key">
                EMAIL
              </span>

              <span className="about-meta-val">
                {contact.email}
              </span>
            </div>

            <div className="about-meta-item">
              <span className="about-meta-key">
                MOBILE
              </span>

              <span className="about-meta-val">
                +91 {contact.mobile}
              </span>
            </div>

            <div className="about-meta-item">
              <span className="about-meta-key">
                CURRENTLY LEARNING
              </span>

              <div className="learning-tags">
                {currently_learning.map((item, i) => (
                  <span key={i} className="learning-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="about-right">

          <p className="about-edu-label">
            EDUCATION
          </p>

          <div className="edu-timeline" ref={timelineRef}>

            <div className="edu-spine" />

            {eduList.map((edu, i) => (
              <div
                key={i}
                className="edu-entry"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              >

                <div className="edu-dot-wrap">
                  <div className="edu-dot" />
                </div>

                <div className="edu-right">

                  <span className="edu-level">
                    {edu.level}
                  </span>

                  <span className="edu-name">
                    {edu.name}
                  </span>

                  <span className="edu-board">
                    {edu.board}
                  </span>

                  <span className="edu-location">
                    {edu.location}
                  </span>

                  <span className="edu-score">
                    {edu.score}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}