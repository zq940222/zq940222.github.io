"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { categories, type Project } from "@/lib/site";

export default function ProjectCard({
  project,
  index = 0,
  animate = false,
  reveal = false,
  showBadge = true,
}: {
  project: Project;
  index?: number;
  /** 立即播放入场级联（筛选换挡后重放） */
  animate?: boolean;
  /** 滚动到视口内才入场（首页折叠线以下用这个） */
  reveal?: boolean;
  showBadge?: boolean;
}) {
  const cat = categories[project.category];
  const frame = useRef(0);

  // 把光标位置写进 --mx/--my，聚光的绘制交给 CSS（见 .spot）
  const trackPointer = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || frame.current) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    });
  };

  return (
    <a
      href={project.repo}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={trackPointer}
      data-reveal={reveal ? "" : undefined}
      style={
        animate || reveal ? ({ "--i": index } as CSSProperties) : undefined
      }
      className={`spot group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-xl border border-hairline bg-paper-raised p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_18px_44px_-16px_rgba(122,162,247,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
        animate ? "card-in" : ""
      }`}
    >
      {/* 悬停时从左滑入的顶部强调线 */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <p className="flex items-center justify-between font-mono text-[0.62rem] tracking-[0.14em] text-ink-faint">
        <span className="transition-colors group-hover:text-accent">
          {cat.en}
        </span>
        {showBadge && project.featured && (
          <span
            className="rounded-sm bg-accent-wash px-1.5 py-0.5 tracking-normal text-accent-ink"
            title="精选项目"
          >
            精选
          </span>
        )}
      </p>
      <h3 className="mt-3 font-mono text-[0.95rem] font-semibold text-ink transition-colors group-hover:text-accent-ink">
        {project.name}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
        {project.zh}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
        {project.en}
      </p>
      <p className="mt-auto flex items-center gap-2 pt-4 font-mono text-[0.65rem] text-ink-faint">
        {project.tech.map((t, i) => (
          <span key={t} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-hairline">·</span>}
            {t}
          </span>
        ))}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
        </svg>
      </p>
    </a>
  );
}
