export default function Hero({ information }) {
  const { name, tagline, about_me, contact, resume, open_to_work } = information;

  return (
    <section className="hero-section">
      <div className="hero-inner">

        {/* Left — text content */}
        <div className="hero-text">
          <p className="hero-tagline">// welcome to my portfolio</p>

          <h1 className="hero-title">
            Shivam <br /> Patil
          </h1>

          <p className="hero-role">{tagline}</p>

          <p className="hero-description">{about_me[1]}</p>

          <div className="hero-buttons">
            <a href={contact.github} target="_blank" rel="noreferrer" className="btn-primary">
              GitHub
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
              LinkedIn
            </a>
            <a href={`/${resume.location}`} target="_blank" rel="noreferrer" className="btn-ghost">
              Resume ↗
            </a>
          </div>
            {/* Coding Profiles */}

            <div className="hero-coding-profiles">

              {Object.entries(
                information.coding_profiles || {}
              ).map(([platform, link]) => (

                <a
                  key={platform}
                  href={link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`coding-pill ${!link ? "disabled" : ""}`}
                >

                  <span className="coding-dot" />

                  {platform.replace(
                    /(^\w)/,
                    c => c.toUpperCase()
                  )}

                </a>

              ))}

            </div>
        </div>

        {/* Right — profile image */}
        <div className="hero-image-wrap">
          <div className="hero-image-ring">
            <img
              src="/placeholder.svg"
              alt={name}
              className="hero-image"
            />
          </div>
          {/* Floating badge */}
          <div className={`hero-badge ${open_to_work ? "available" : "employed"}`}>
            <span className="hero-badge-dot" />
            {open_to_work ? "Open to opportunities" : "Currently Employed"}
          </div>
        </div>

      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint">
        <div className="hero-scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  );
}