---
title: 用 Claude Code 搭一条 AI 影视流水线
titleEn: Building an AI Filmmaking Pipeline on Claude Code
date: "2026-08-13"
tags: [Claude Code, AI Agent, 多智能体, 影视流水线]
summary: 把 Claude Code 从一个写代码的 CLI，改造成一个有 11 个专业 Agent 分工协作的影视工作台：剧本 → 分镜 → 拍摄 → 剪辑 → 发布，全流程跑通的过程与踩坑记录。
summaryEn: How I turned Claude Code from a coding CLI into an AI film studio — 11 specialized agents covering the full script → storyboard → shoot → edit → publish pipeline.
---

去年开始我一直在想一个问题：**Agent 的能力上限，到底是由模型决定的，还是由编排决定的？**

写代码这件事，Claude Code 已经证明了单 Agent + 好工具就能走很远。但影视创作不一样——它天然是一个多角色、多阶段、强依赖上下游交付物的流程。一个人不可能同时是好编剧、好导演、好摄影师和好剪辑师，Agent 也一样。

于是我做了 [Claude-Code-Film-Studio](https://github.com/zq940222/Claude-Code-Film-Studio)：一个把 Claude Code 变成 AI 影视工作台的插件。

## 整体架构：11 个 Agent，11 个阶段技能

整个系统模仿真实剧组的组织结构：

| 角色 | 职责 |
|------|------|
| 制片人 producer | 建项、进度跟踪、积分预算、阶段门禁 |
| 编剧 screenwriter | 大纲、人物小传、分集剧本、台词 |
| 导演 director | 剧本拆分镜：镜号、景别、运镜、时长、衔接 |
| 摄影指导 cinematographer | 分镜表翻译成视频生成提示词（shotlist.json） |
| 美术指导 art-director | 角色三视图、场景设定图、关键帧 |
| 视频生成师 video-generator | 批量提交生成任务、轮询、下载、质检 |
| 审片人 reviewer | 抽帧质检：画面瑕疵、角色一致性、分镜匹配度 |
| 剪辑师 editor | ffmpeg 统一编码、按分镜拼粗剪 |
| 精剪师 finalcut | 剪映草稿 / DaVinci 时间线自动组装 |
| 配乐师 composer | 按情绪基调生成 BGM |
| 运营 operator | 发布文案、封面、半自动发抖音 |

每个 Agent 只拿到自己需要的工具集——编剧只有读写文件的能力，剪辑师才有 Bash 去跑 ffmpeg。**工具窄化不是限制，是让 Agent 行为可预测的关键。**

## 三道门禁：钱花在哪里，人就要在哪里把关

流水线里有三个环节必须停下来等人确认：

1. **剧本定稿**——后面所有环节都建立在剧本之上，剧本错了全部白干；
2. **设定图定稿**——角色形象一旦进入视频生成阶段就很难改；
3. **积分预估确认**——视频生成是真金白银，批量提交前必须报预算。

这是我在整个项目里最重要的一条经验：**Agent 流水线的"自动化程度"不是越高越好，在不可逆和花钱的节点上，确定性的门禁比聪明的模型更重要。**

## 质检回炉：让流水线自己发现问题

AI 视频生成的成功率远没到"提交即可用"的程度。所以审片人 Agent 会对每个生成的镜头抽帧检查：画面有没有瑕疵、角色前后是否一致、和分镜描述匹不匹配。不合格的镜头进回炉清单，按失败类型决定重试策略。

配合下载环节的 ffprobe 硬校验（完整性、时长、画幅、音轨），整条流水线可以在无人值守的情况下把可用率拉到能接受的水平。

## 一些体会

- **多 Agent 的价值不在"并行"，在"分工"。** 每个角色的系统提示词都可以写得很深、很专业，这是单个全能 Agent 做不到的。
- **交付物格式是 Agent 之间的合同。** 分镜表、shotlist.json、审片报告——把中间产物定义成结构化文件，上下游就能解耦。
- **人只出现在门禁上。** 其余时间流水线自己跑，这才是"工具"而不是"玩具"。

项目开源在 [GitHub](https://github.com/zq940222/Claude-Code-Film-Studio)，配套还有一个只读的[可观测仪表盘](https://github.com/zq940222/film-studio-dashboard)，欢迎交流。
