"use client";

import { useEffect } from "react";

/**
 * 把光标位置广播到 :root 上，供背景层使用：
 *   --gx / --gy  视口像素坐标 —— 网格光栅的照亮点
 *   --px / --py  归一化到 -0.5~0.5 —— 极光的视差偏移
 * 只在有精确指针的设备上监听，rAF 节流到每帧一次。
 */
export default function Pointer() {
  useEffect(() => {
    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty("--gx", `${x}px`);
        root.style.setProperty("--gy", `${y}px`);
        root.style.setProperty("--px", (x / window.innerWidth - 0.5).toFixed(3));
        root.style.setProperty(
          "--py",
          (y / window.innerHeight - 0.5).toFixed(3),
        );
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
