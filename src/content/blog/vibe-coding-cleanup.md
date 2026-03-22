---
title: "Vibe Coding is Real — But Someone Has to Clean It Up"
date: 2026-03-05
description: "AI tools have made it easier than ever to ship code fast. That's mostly a good thing. But the gap between 'it works' and 'it's production-ready' is wider than most people think."
tags: ["AI", "Security", "Code Quality", "Engineering"]
---

Something shifted in the last 12 months. I've been getting more and more inbound from founders and teams who built something — sometimes surprisingly complex — almost entirely with AI assistance. Cursor, Claude, Copilot, v0. They move fast, the code runs, and then they want to ship it.

That's where I come in.

I've started calling this category of work "cleanup engagements," and it's become one of the more interesting parts of what I do. Not because the code is always bad — it often isn't — but because the *process* that produced it left specific, predictable gaps.

## What AI-Assisted Code Gets Right

Let me be fair here. AI coding tools are genuinely impressive. The code they produce is often:

- Syntactically correct
- Functionally close to what was intended
- Reasonably structured for simple use cases

For UI components, basic CRUD operations, and scripting tasks, AI output often needs minimal intervention. The tools have gotten good at the patterns that appear frequently in training data.

## Where It Falls Apart

The problems cluster in a few specific areas.

**Security assumptions**

AI models generate code that *looks* secure more often than it *is* secure. Access control is the biggest offender. I regularly see patterns like:

```solidity
function withdraw(uint256 amount) external {
    require(msg.sender == owner, "Not owner");
    token.transfer(msg.sender, amount);
}
```

This passes a quick read. But where's the reentrancy guard? What happens if `token.transfer` calls back into this contract? AI-generated code often handles the happy path well and leaves the adversarial paths unguarded.

**Missing edge cases**

AI generates code based on what you described, not what you meant. If you didn't describe the edge case, it probably isn't handled. Integer overflow assumptions, zero-value inputs, empty arrays — these show up as unhandled states constantly.

**No test coverage**

This is the most consistent gap. AI will write tests if you ask it to, but left to its own devices it produces working code with no test suite, or a shallow test suite that only covers the path that was demonstrated.

**Copy-paste architecture**

AI tools are pattern matchers. When a codebase grows via repeated AI prompts, you end up with subtle inconsistencies — the same concept handled three different ways in different files, because each prompt was slightly different. It works, but it doesn't *cohere*.

## What a Cleanup Engagement Actually Looks Like

When I take on one of these projects, the process is roughly:

1. **Read everything first.** Not just the obvious files — the whole codebase. I'm looking for the inconsistencies, the assumptions, the things that the AI confidently generated but nobody has questioned.

2. **Build a threat model.** What's the worst thing that could happen? Who could exploit this, and how? For financial systems, this is non-negotiable. For internal tooling, the stakes are lower but the answer still matters.

3. **Write the missing tests.** Coverage comes before fixes. You can't confidently refactor code you can't verify.

4. **Fix, not rewrite.** The instinct when reading messy code is to start over. That's almost never the right call. The existing code has context baked into it — even AI-generated context. I fix what's broken and clean up the worst offenses without throwing away what works.

5. **Document the decisions.** What changed and why. Future you (or future AI prompts) need this context.

## The Bigger Picture

Vibe coding isn't going away. The tools will get better, the output will get cleaner, and the gap between "AI generated" and "engineer wrote" will continue to narrow. That's fine. That's progress.

But right now, in 2026, there's a meaningful gap between what AI tools produce and what production systems require. Security, reliability, and long-term maintainability aren't things you can prompt your way to. They come from experience — knowing what breaks, having seen it break, and building the habits that prevent it.

If you've built something with AI and you're thinking about putting it in front of real users or real money: get it reviewed. Not because the code is definitely broken, but because you don't know whether it is.

That's the whole point of a review.
