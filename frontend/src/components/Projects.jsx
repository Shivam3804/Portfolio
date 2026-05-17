import { useState } from "react";

export default function Projects({ information }) {

  const projects =
    information?.projects || [];

  const featuredProjects =
    projects.filter(
      (p) => p.featured
    );

  const otherProjects =
    projects.filter(
      (p) => !p.featured
    );

  return (
    <section className="projects-section">

      <div className="section-heading">

        <span className="section-tag">
          // 04. projects
        </span>

        <h2 className="section-title">
          Projects
        </h2>

      </div>

      {/* Featured */}

      <div className="featured-projects-grid">

        {featuredProjects.map((project, i) => (

          <ProjectCard
            key={project.id || i}
            project={project}
            compact={false}
          />

        ))}

      </div>

      {/* Others */}

      {otherProjects.length > 0 && (

        <div className="other-projects-wrap">

          <div className="other-projects-scroll">

            {otherProjects.map((project, i) => (

              <ProjectCard
                key={project.id || i}
                project={project}
                compact={true}
              />

            ))}

          </div>

        </div>

      )}

    </section>
  );
}

function ProjectCard({
  project,
  compact,
}) {

  const [open, setOpen] =
    useState(false);

  return (

    <div
      className={
        compact
          ? "project-card compact"
          : "project-card"
      }
    >

      <span className="project-category">
        {project.category}
      </span>

      <h3 className="project-title">
        {project.name}
      </h3>

      <p className="project-description">
        {project.description}
      </p>

      {/* Metrics */}

      {!compact &&
        project.metrics && (

        <div className="project-metrics">

          {project.metrics.map((m, i) => (

            <div
              key={i}
              className="project-metric"
            >

              <span className="metric-value">
                {m.value}
              </span>

              <span className="metric-name">
                {m.name}
              </span>

            </div>

          ))}

        </div>

      )}

      {/* Skills */}

      <div className="project-skills">

        {project.skills_stack
          ?.slice(0, compact ? 4 : 8)
          .map((skill, i) => (

          <span
            key={i}
            className="project-skill"
          >
            {skill}
          </span>

        ))}

      </div>

      {/* Toggle */}

      <button
        className="project-toggle"
        onClick={() => setOpen(!open)}
      >

        {open
          ? "Hide Details"
          : "Show Details"}

      </button>

      {/* Expanded */}

      {open && (

        <div className="project-expanded">

          {project.features && (

            <div className="project-block">

              <span className="project-block-title">
                FEATURES
              </span>

              <div className="project-tags">

                {project.features.map((f, i) => (

                  <span
                    key={i}
                    className="project-tag"
                  >
                    {f}
                  </span>

                ))}

              </div>

            </div>

          )}

          {project.details && (

            <div className="project-block">

              <span className="project-block-title">
                IMPLEMENTATION
              </span>

              <ul className="project-details">

                {project.details.map((d, i) => (

                  <li key={i}>
                    {d}
                  </li>

                ))}

              </ul>

            </div>

          )}

        </div>

      )}

    </div>

  );
}