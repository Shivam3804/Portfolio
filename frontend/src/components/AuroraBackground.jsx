export default function AuroraBackground() {
  const stars = Array.from({ length: 80 });

  return (
    <div className="aurora-background">

      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb--cyan" />
      <div className="aurora-orb aurora-orb--magenta" />
      <div className="aurora-orb aurora-orb--ice" />
      <div className="aurora-orb aurora-orb--cyan-2" />

      {/* Stars */}
      {stars.map((_, index) => {
        const size = Math.random() * 2.5 + 0.5;
        return (
          <div
            key={index}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        );
      })}
    </div>
  );
}