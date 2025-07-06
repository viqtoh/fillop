const CircleProgress = ({ progress }) => {
  const radius = 67.5;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100); // progress in percentage

  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r={radius} stroke="#444" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx="75"
        cy="75"
        r={radius}
        stroke="#4ccf50"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 75 75)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="75" y="80" textAnchor="middle" fontSize="16" fill="#fff">
        {progress}%
      </text>
    </svg>
  );
};
export default CircleProgress;
