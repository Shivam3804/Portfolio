export default function Achievements({ information }) {

  const achievements =
    information?.achievements || [];

  const featured =
    achievements.filter(a => a.featured);

  const others =
    achievements.filter(a => !a.featured);

  const getIcon = (type) => {

    switch (type) {

      case "exam":
        return "🏆";

      case "research":
        return "📄";

      case "competition":
        return "🎯";

      default:
        return "✨";
    }
  };

  return (

    <section className="achievement-section">

      <div className="section-heading">

        <span className="section-tag">
          // 06. achievements
        </span>

        <h2 className="section-title">
          Achievements
        </h2>

      </div>

      {/* FEATURED */}

      <div className="achievement-featured">

        {featured.map((item, i) => (

          <div
            key={i}
            className="achievement-feature-card"
          >

            <div className="achievement-top">

              <span className="achievement-icon">
                {getIcon(item.type)}
              </span>

              <span className="achievement-year">
                {item.year}
              </span>

            </div>

            <h3 className="achievement-title">
              {item.title}
            </h3>

            <p className="achievement-event">
              {item.event}
            </p>

            <span className="achievement-org">
              {item.organizer}
            </span>

          </div>

        ))}

      </div>

      {/* OTHERS */}

      <div className="achievement-grid">

        {others.map((item, i) => (

          <div
            key={i}
            className="achievement-card"
          >

            <div className="achievement-small-top">

              <span>
                {getIcon(item.type)}
              </span>

              <span className="achievement-small-year">
                {item.year}
              </span>

            </div>

            <h3 className="achievement-small-title">
              {item.title}
            </h3>

            <p className="achievement-small-event">
              {item.event}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}