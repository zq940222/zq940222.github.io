/**
 * 两张静态帧，与 src/lottie/*.json 的 viewBox、形状、配色一一对应。
 * 减少动效、没有 JS、或播放器加载失败时，用户看到的就是这张图——
 * 所以画的是动画跑完后的静止终态，而不是一个空占位。
 */

// 与 signal-lost.json 里的顶点表同一份：振幅 38 → 28 → 18 → 8 逐级衰减
const WAVE = [
  [0, 60], [24, 60], [36, 22], [48, 98], [60, 60],
  [88, 60], [100, 32], [112, 88], [124, 60],
  [152, 60], [164, 42], [176, 78], [188, 60],
  [212, 60], [220, 52], [228, 68], [236, 60], [240, 60],
]
  .map(([x, y]) => `${x},${y}`)
  .join(" ");

export function SignalLostStill() {
  return (
    <svg viewBox="0 0 480 120" className="h-full w-full">
      <line
        x1="240"
        y1="60"
        x2="470"
        y2="60"
        stroke="var(--terminal-dim)"
        strokeWidth="2"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      <polyline
        points={WAVE}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="240" cy="60" r="5.5" fill="var(--amber)" />
    </svg>
  );
}

const NODES = [60, 180, 300, 420, 540];

export function PipelineStill() {
  return (
    <svg viewBox="0 0 600 80" className="h-full w-full">
      <line
        x1="60"
        y1="40"
        x2="540"
        y2="40"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {NODES.map((x) => (
        <circle
          key={x}
          cx={x}
          cy="40"
          r="7.8"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
