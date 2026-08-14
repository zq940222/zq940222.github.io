import type { Metadata, Viewport } from "next";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#121320",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      // Next 16 起不再自动接管 scroll-behavior：不加这个属性，
      // 全局的 smooth 会让换路由变成缓慢滚动到顶部
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        {/* 没有 JS 就没有揭示动画，把待揭示元素恢复为可见。
            用 noscript 而不是给 <html> 加类：后者会在 hydration 时
            和服务端渲染的 className 冲突 */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>[data-reveal]{opacity:1 !important}</style>`,
          }}
        />
        <div className="aurora" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <Nav />
        {children}
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
