---
title: "AI Agents in 2026: What Actually Works"
date: 2026-03-15
description: "Everyone is building agents. Most of them don't work well. Here's what separates the ones that do — and what I've learned building them."
tags: ["AI", "Agents", "LLMs", "Automation"]
---

The word "agent" has been stretched to cover everything from a ChatGPT wrapper with a system prompt to fully autonomous systems that operate independently across multiple environments. Most things labeled "agents" are closer to the former. That's not a criticism — but it matters when you're trying to figure out what's actually viable to build right now.

I've been building and shipping AI agents for the past year. Here's an honest accounting of what works, what doesn't, and where I think the space is actually going.

## The Spectrum of Agents

It helps to think about agents on a spectrum of autonomy:

**Level 1 — Prompted assistants.** LLM with a system prompt, maybe some tools. You're in the loop for every decision. Works great. This is most "AI features" in products today.

**Level 2 — Workflow automation.** The model takes a task, executes a defined sequence of steps, and returns a result. Some branching logic, some tool use. You review the output. This is where most serious agent work lives right now.

**Level 3 — Autonomous agents.** The model operates continuously, makes decisions independently, and acts in the world without step-by-step human oversight. This is where things get genuinely hard.

The hype is mostly about Level 3. The value is mostly being delivered at Level 2.

## What Makes Level 2 Work

The agents I've shipped that actually work in production share a few characteristics.

**Narrow scope.** The best agents do one thing well. An agent that monitors a specific data source and fires alerts when conditions are met. An agent that takes a structured input, processes it through a defined pipeline, and produces a structured output. The moment you try to make an agent that "does everything," reliability collapses.

**Deterministic scaffolding.** The non-deterministic part (the LLM) should be a small component inside a deterministic outer shell. Your orchestration logic, your tool definitions, your output validation — these should be code you control, not things you're hoping the model figures out.

**Explicit failure modes.** What does the agent do when it gets an unexpected input? When a tool call fails? When the model produces output that doesn't match the expected schema? Agents without explicit error handling produce unpredictable behavior in production. This sounds obvious but it's almost always underdone.

**Evals, not vibes.** You need a way to measure whether your agent is working. Not "I ran it a few times and it seemed fine" — actual evaluation against a test set. This is the hardest operational discipline to maintain, but it's what separates agents that drift over time from ones that stay reliable.

## Frey: What I Built and What I Learned

Frey is an AI agent I built on the Eliza framework — designed to operate across social and on-chain environments autonomously. It was a genuinely interesting project because it pushed into Level 3 territory.

The framework itself is well-designed for the multi-environment use case. Eliza handles the runtime, the memory layer, and the integrations — you focus on the agent's personality, capabilities, and decision logic.

What I found:

**Memory is the hard problem.** Agents that operate over extended periods accumulate context. Managing what the agent remembers, what it forgets, and how it prioritizes is a non-trivial engineering problem. The naive approach (keep everything) degrades performance. The smart approach requires thinking carefully about what information actually matters for future decisions.

**Social environments are adversarial.** An agent operating on social platforms will encounter users who are actively trying to confuse it, manipulate it, or get it to do things it shouldn't. Prompt injection, persona attacks, social engineering — these aren't theoretical. Your agent's instruction set needs to be robust against adversarial inputs.

**On-chain actions are irreversible.** When an agent is authorized to execute transactions, the stakes change completely. A bad call in a social context is embarrassing. A bad call that moves funds is a real loss. The authorization model and human-in-the-loop checkpoints for on-chain actions need to be treated with the same rigor as financial system design.

## Where I Think This Goes

The tooling is improving faster than most people realize. Context windows are getting larger, tool use is getting more reliable, and the frameworks for building agents are maturing. In 12 months, Level 2 agents will be significantly more capable and Level 3 will be more viable for specific constrained use cases.

But the fundamentals won't change: narrow scope, deterministic scaffolding, explicit failure modes, and actual evaluation. The teams that get good at those things now will be well-positioned when the underlying models take another leap forward.

The ceiling is rising. The floor — good engineering discipline — stays where it's always been.
