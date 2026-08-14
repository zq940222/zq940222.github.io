"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 页面级滚动揭示。挂在根布局里，扫描当前文档所有 [data-reveal]，
 * 进入视口就加 .in 触发动画——服务端组件只需写个属性，
 * 不必为了动画变成客户端组件。换路由时按 pathname 重新扫描。
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).filter((el) => !el.classList.contains("in"));
    if (targets.length === 0) return;

    const show = (el: HTMLElement) => el.classList.add("in");

    // 不支持 IO 或用户要求减少动效时，直接全部就位
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
