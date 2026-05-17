import { useEffect, useRef, useState } from "react";

function useCountUp(target, duration = 3000, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 400);
      const next = eased * target;
      setValue(isDecimal ? parseFloat(next.toFixed(2)) : Math.floor(next));

      if (current >= steps) {
        setValue(target);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, target, duration]);

  return value;
}

const statsMeta = [
  { key: "projects",     label: "Projects Built",   suffix: "+", icon: "⚙️" },
  { key: "certificates", label: "Certificates",      suffix: "+", icon: "📜" },
  { key: "internships",  label: "Internships",       suffix: "",  icon: "💼" },
  { key: "cgpa",         label: "CGPA",              suffix: "",  icon: "🎓" },
];

function StatCard({ label, value, suffix, icon, animate }) {
  const count = useCountUp(value, 1800, animate);

  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Stats({ information }) {
  const { stats } = information;
  const ref = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-grid">
        {statsMeta.map(({ key, label, suffix, icon }) => (
          <StatCard
            key={key}
            label={label}
            value={stats[key]}
            suffix={suffix}
            icon={icon}
            animate={animate}
          />
        ))}
      </div>
    </section>
  );
}