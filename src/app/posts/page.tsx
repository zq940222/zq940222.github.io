import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "关于 AI Agent、LLM 应用与工程实践的写作。",
};

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        文章
        <span className="ml-3 font-mono text-sm font-normal text-ink-faint">
          POSTS · {posts.length}
        </span>
      </h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        关于 AI Agent、LLM 应用与工程实践的写作。
      </p>
      <div className="mt-8 border-t border-hairline">
        <PostList posts={posts} />
      </div>
    </main>
  );
}
