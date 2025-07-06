const SmallCircleProgress = ({ progress }) => {
  const radius = 17.5;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r={radius} stroke="#ddd" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx="20"
        cy="20"
        r={radius}
        stroke="#4ccf50"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 20 20)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="20" y="22.5" textAnchor="middle" fontSize="8" fill="#fff">
        {progress}%
      </text>
    </svg>
  );
};

export default SmallCircleProgress;
