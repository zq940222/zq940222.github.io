import type { CSSProperties } from "react";

const stages = [
  { name: "script", zh: "剧本定稿", state: "done" },
  { name: "storyboard", zh: "47 个镜头已拆解", state: "done" },
  { name: "shoot", zh: "生成中", state: "running" },
  { name: "edit", zh: "等待上游", state: "waiting" },
  { name: "publish", zh: "等待上游", state: "waiting" },
] as const;

export default function Terminal() {
  let i = 0;
  const line = () => ({ "--i": i++ } as CSSProperties);
  return (
    <div
      aria-label="一个 AI Agent 流水线的会话演示"
      className="overflow-hidden rounded-xl border border-terminal-edge bg-terminal font-mono text-[0.8rem] leading-7 text-terminal-text shadow-[0_24px_70px_-24px_rgba(122,162,247,0.35)]"
    >
      <div className="flex items-center gap-1.5 border-b border-terminal-edge px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-terminal-edge" />
        <span className="h-2.5 w-2.5 rounded-full bg-terminal-edge" />
        <span className="h-2.5 w-2.5 rounded-full bg-terminal-edge" />
        <span className="ml-3 text-[0.7rem] text-terminal-dim">
          zenas@opsmate — agent session
        </span>
      </div>
      <div className="px-5 py-4">
        <p className="term-line" style={line()}>
          <span className="text-terminal-dim">$</span>{" "}
          <span className="text-purple">claude</span>{" "}
          <span className="text-signal">&quot;把一个想法，变成能交付的东西&quot;</span>
        </p>
        <p className="term-line text-terminal-dim" style={line()}>
          ● 规划完成 —— 拆解为 5 个阶段，11 个 agent 就位
        </p>
        {stages.map((s) => (
          <p key={s.name} className="term-line" style={line()}>
            <span
              className={
                s.state === "done"
                  ? "text-signal"
                  : s.state === "running"
                    ? "text-amber"
                    : "text-terminal-dim"
              }
            >
              {s.state === "done" ? "✓" : s.state === "running" ? "▸" : "·"}
            </span>{" "}
            <span className="inline-block w-28 text-terminal-text">
              {s.name}
            </span>
            <span
              className={
                s.state === "waiting" ? "text-terminal-dim" : "text-terminal-text"
              }
            >
              {s.zh}
            </span>
            {s.state === "running" && (
              <span className="ml-3 inline-flex h-2 w-24 translate-y-px items-center overflow-hidden rounded-full bg-terminal-edge align-middle">
                <span className="term-bar h-full rounded-full bg-amber" />
              </span>
            )}
          </p>
        ))}
        <p className="term-line text-terminal-dim" style={line()}>
          ✱ 下一道门禁：人工确认 —— 该你了
          <span className="term-cursor ml-1.5 inline-block h-4 w-2 translate-y-0.5 bg-signal align-middle" />
        </p>
      </div>
    </div>
  );
}
