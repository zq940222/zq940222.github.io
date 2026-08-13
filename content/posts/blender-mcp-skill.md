---
title: 给 Agent 一双能用 Blender 的手
titleEn: Giving an AI Agent Hands That Can Use Blender
date: "2026-08-10"
tags: [Blender, MCP, Claude Skill, 3D]
summary: 把官方 blender.org MCP 服务器接进 Claude Code，并为它适配一个专业 3D 设计技能包的过程——包括中文界面下节点名被翻译这种只有实操才会撞上的坑。
summaryEn: Wiring the official blender.org MCP server into Claude Code and adapting a professional 3D design skill for it — including pitfalls you only hit in practice.
---

让 LLM 写代码已经不新鲜了，但让它**直接操作一个正在运行的 Blender**，在 3D 视口里建模、打灯、调材质——这件事的工程细节比想象中多得多。

这篇记录我做 [blender-mcp-skill](https://github.com/zq940222/blender-mcp-skill) 的过程：一个让 Claude Code 通过 MCP 协议做专业 3D 设计的 Agent 技能包。

## 官方服务器 ≠ 社区服务器

先说一个容易混淆的点：Blender 的 MCP 服务器有两个流行实现——社区的 `blender-mcp` 和 **blender.org 官方的 MCP 服务器**。两者的工具名、能力边界完全不同：

- 官方服务器提供了更细的只读检查工具（对象摘要、数据块摘要、截图、渲染缩略图），并且随包携带完整的 **Python API 文档和用户手册**（RST 纯文本，可以直接 grep）；
- 执行任意 `bpy` 代码在官方服务器里被定位为"最后手段"，有专用工具能做到的事优先用专用工具。

我的技能包从 jithinolickal 的 Apache-2.0 项目改造而来，核心工作就是把所有工具调用适配到官方服务器的接口上。

## 那些只有实操才会撞上的坑

### 中文界面会翻译节点名

我本机的 Blender 是中文界面。写材质节点代码时，`nodes["Principled BSDF"]` 直接 KeyError——因为节点名被翻译成了"原理化 BSDF"。

正确做法是**按类型找节点，而不是按名字**：

```python
bsdf = next(n for n in mat.node_tree.nodes
            if n.type == 'BSDF_PRINCIPLED')
```

这类问题的通用教训是：任何依赖 UI 显示文本的代码，在本地化环境下都是定时炸弹。Agent 生成的代码尤其容易踩这个坑，因为训练语料里几乎全是英文界面的例子。

### 模式与选择状态是隐式前置条件

Blender 的大量操作符依赖当前模式（物体/编辑/雕刻）和活动对象、选中集。模式不对时，操作要么报错、要么**静默什么都不做**——后者对 Agent 来说更致命，因为它会以为自己成功了。

所以技能包里的约定是：每次操作符调用前显式设置模式和选择状态，从不假设当前状态；连续操作不同对象之间要重新设置，因为操作符会以副作用改变选择。

### 读回计算属性前先刷新依赖图

改完变换或修改器之后直接读世界矩阵，拿到的是旧值。必须先 `bpy.context.view_layer.update()` 或者通过 depsgraph 拿 evaluated 对象。

## 技能包的形态

最终交付是一个 Claude Code skill：一组 Markdown 指令 + 参考文档，告诉 Agent 什么时候用哪个 MCP 工具、`bpy` 代码要遵守哪些约定、常见几何/材质/灯光任务的标准做法。

装上之后的体验：对 Claude 说"给我建一把参数化的北欧风格椅子"，它会检查场景、规划结构、分步建模、打灯渲染缩略图自查——整个过程不需要碰一下 Blender 的界面。

代码在 [GitHub](https://github.com/zq940222/blender-mcp-skill)，Apache-2.0，欢迎试用和反馈。
