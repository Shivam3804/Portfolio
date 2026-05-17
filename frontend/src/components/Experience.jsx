import { useState } from "react";

export default function Experience({ information }) {

  const experience =
    information?.experience || [];

  return (
    <section className="experience-section">

      <div className="section-heading">

        <span className="section-tag">
          // 03. experience
        </span>

        <h2 className="section-title">
          Professional Experience
        </h2>

      </div>

      <div className="experience-grid">

        {experience.map((exp, i) => (

          <ExperienceCard
            key={i}
            exp={exp}
            isFeatured={i === 0}
          />

        ))}

      </div>

    </section>
  );
}

function ExperienceCard({
  exp,
  isFeatured,
}) {

  const [open, setOpen] =
    useState(false);

  const role = exp.roles?.[0];

  const formatDate = (dateStr) => {

    const date = new Date(dateStr);

    return date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

  };

  return (

    <div
      className={
        isFeatured
          ? "experience-card featured"
          : "experience-card"
      }
    >

      {/* Header */}

      <div className="experience-header">

        <div className="experience-header-left">

          <h3 className="experience-company">
            {exp.company}
          </h3>

          <p className="experience-role">
            {role?.title}
          </p>

          <span className="experience-duration">

            {formatDate(role?.start_date)}
            {" — "}
            {formatDate(role?.end_date)}

          </span>

        </div>

        <span className="experience-location">
          {exp.location}
        </span>

      </div>

      {/* Skills */}

      <div className="experience-skills">

        {role?.skills
          ?.slice(0, 5)
          .map((skill, i) => (

          <span
            key={i}
            className="experience-skill"
          >
            {skill}
          </span>

        ))}

      </div>

      {/* Preview */}

      <p className="experience-preview">

        {role?.details?.[0]}

      </p>

      {/* Expand Button */}

      {role?.details?.length > 1 && (

        <button
          className="experience-toggle"
          onClick={() => setOpen(!open)}
        >

          {open
            ? "Hide Details"
            : "View Details"}

        </button>

      )}

      {/* Expanded */}

      {open && (

        <ul className="experience-details">

          {role?.details
            ?.slice(1)
            .map((detail, i) => (

            <li key={i}>
              {detail}
            </li>

          ))}

        </ul>

      )}

    </div>

  );
}