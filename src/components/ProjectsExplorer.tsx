"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import {
  categories,
  projects,
  type ProjectCategory,
} from "@/lib/site";

type Filter = "all" | ProjectCategory;

const filters: { key: Filter; zh: string }[] = [
  { key: "all", zh: "全部" },
  ...(Object.keys(categories) as ProjectCategory[]).map((key) => ({
    key,
    zh: categories[key].zh,
  })),
];

function count(filter: Filter): number {
  return filter === "all"
    ? projects.length
    : projects.filter((p) => p.category === filter).length;
}

export default function ProjectsExplorer() {
  const [active, setActive] = useState<Filter>("all");
  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      <div
        role="group"
        aria-label="按分类筛选项目"
        className="flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(f.key)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline bg-paper-raised text-ink-soft hover:border-accent/60 hover:text-accent-ink"
              }`}
            >
              {f.zh}
              <span
                className={`ml-1.5 font-mono text-[0.65rem] ${
                  isActive ? "text-paper/70" : "text-ink-faint"
                }`}
              >
                {count(f.key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* key 换挡时整组重挂载，重放入场级联 */}
      <div
        key={active}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} animate />
        ))}
      </div>
    </div>
  );
}
