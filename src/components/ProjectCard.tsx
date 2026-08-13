import type { Project } from "@/lib/site";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.repo}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-lg border border-hairline bg-paper-raised p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_10px_30px_-14px_rgba(39,67,227,0.35)]"
    >
      <h3 className="font-mono text-sm font-medium text-ink transition-colors group-hover:text-accent-ink">
        {project.name}
        <span className="ml-1 text-ink-faint transition-colors group-hover:text-accent">
          ↗
        </span>
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
        {project.zh}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
        {project.en}
      </p>
      <p className="mt-auto flex flex-wrap gap-2 pt-4">
        {project.tech.map((t) => (
          <span key={t} className="font-mono text-[0.65rem] text-ink-faint">
            {t}
          </span>
        ))}
      </p>
    </a>
  );
}
