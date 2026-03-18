interface ClockFaceProps {
  size: number;
  showNumbers?: boolean;
}

/**
 * Static SVG clock face: rim, tick marks, hour numbers, center dot.
 * This component never re-renders when hands move.
 */
export function ClockFace({ size, showNumbers = true }: ClockFaceProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;

  // 60 tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const innerR = isMajor ? r * 0.84 : r * 0.92;
    const x1 = cx + innerR * Math.sin(angle);
    const y1 = cy - innerR * Math.cos(angle);
    const x2 = cx + r * Math.sin(angle);
    const y2 = cy - r * Math.cos(angle);
    return { x1, y1, x2, y2, isMajor };
  });

  // Hour number positions (r * 0.70 from center)
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    const angle = (hour * 30 * Math.PI) / 180;
    const numR = r * 0.70;
    const x = cx + numR * Math.sin(angle);
    const y = cy - numR * Math.cos(angle);
    return { hour, x, y };
  });

  // Slightly larger font at small sizes so numbers stay readable (e.g. 120px match clocks)
  const fontSize = size < 150 ? size * 0.105 : size * 0.088;

  return (
    <g>
      {/* Outer ring shadow */}
      <circle cx={cx} cy={cy} r={r + 3} fill="rgba(0,0,0,0.08)" />
      {/* Clock face */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--clock-face)"
        stroke="var(--clock-border)"
        strokeWidth={size * 0.018}
      />
      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.isMajor ? "var(--tick-major)" : "var(--tick-minor)"}
          strokeWidth={t.isMajor ? size * 0.012 : size * 0.005}
          strokeLinecap="round"
        />
      ))}
      {/* Hour numbers */}
      {showNumbers &&
        numbers.map(({ hour, x, y }) => (
          <text
            key={hour}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fontSize}
            fontWeight="800"
            fill="var(--clock-border)"
            fontFamily="var(--font-nunito, Nunito, sans-serif)"
          >
            {hour}
          </text>
        ))}
      {/* Center dot (drawn last so it's on top of hands) */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.028}
        fill="var(--clock-border)"
        style={{ zIndex: 10 }}
      />
    </g>
  );
}
