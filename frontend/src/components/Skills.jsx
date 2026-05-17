export default function Skills({ information }) {

  const { skills } = information;

  const technicalSkills = Object.entries(
    skills.technical
  );

  return (
    <section className="skills-section">

      <div className="section-heading">
        <span className="section-tag">
          // 02. skills
        </span>

        <h2 className="section-title">
          Technical Expertise
        </h2>
      </div>

      {/* Featured Skills */}
      <div className="skills-featured">

        {skills.featured.map((skill, i) => (
          <div
            key={i}
            className="featured-skill"
            style={{
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {skill}
          </div>
        ))}

      </div>

      {/* Skill Categories */}
      <div className="skills-grid">

        {technicalSkills.map(([category, items], i) => (

          <div
            key={i}
            className="skill-card"
            style={{
              animationDelay: `${i * 0.12}s`,
            }}
          >

            <div className="skill-card-top">

              <span className="skill-card-label">
                {category
                  .replaceAll("_", " ")
                  .toUpperCase()}
              </span>

              <span className="skill-card-count">
                {items.length}
              </span>

            </div>

            <div className="skill-tags">

              {items.map((item, idx) => (
                <span
                  key={idx}
                  className="skill-tag"
                >
                  {item}
                </span>
              ))}

            </div>

          </div>

        ))}

      </div>

      {/* Soft Skills + Languages */}
      <div className="skills-bottom">

        <div className="mini-skill-block">

          <span className="mini-title">
            SOFT SKILLS
          </span>

          <div className="mini-tags">

            {skills.soft_skills.map((item, i) => (
              <span
                key={i}
                className="mini-tag"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        <div className="mini-skill-block">

          <span className="mini-title">
            LANGUAGES
          </span>

          <div className="mini-tags">

            {skills.languages_spoken.map((item, i) => (
              <span
                key={i}
                className="mini-tag"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}