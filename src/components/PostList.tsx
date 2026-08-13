import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/posts";

export default function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-y divide-hairline">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/posts/${post.slug}/`}
            className="group grid gap-1.5 py-6 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <time className="pt-1 font-mono text-xs text-ink-faint">
              {formatDate(post.date)}
            </time>
            <div>
              <h3 className="font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent-ink">
                {post.title}
              </h3>
              {post.titleEn && (
                <p className="mt-0.5 font-mono text-xs text-ink-faint">
                  {post.titleEn}
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {post.summary}
              </p>
              <p className="mt-2.5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-accent-wash px-1.5 py-0.5 font-mono text-[0.65rem] text-accent-ink"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
