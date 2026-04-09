---
title: "I Built a Claude Skill That Debugs EVM Transactions So I Don't Have To"
date: 2026-04-09
description: "Debugging a single failed transaction used to eat 30-60 minutes of my day. Here's the skill I built to handle the mechanical work — and what it taught me about where AI actually belongs in a smart contract workflow."
tags: ["AI", "Solidity", "Claude", "Ethereum", "Tooling"]
---

I used to spend 30 to 60 minutes debugging a single failed transaction.

Run `cast run`. Scroll through thousands of trace lines trying to find the revert. Jump to the block explorer to figure out what contract is at some address. Check if the source is verified. Look up the function selector. Figure out what moved, what didn't, and why. Write it up. Move to the next one.

Ten failed transaction hashes from the team? There goes my day.

The debugging itself was never actually hard. The problem was that 90% of the process was mechanical — reading output, looking things up, stitching context together. Stuff a machine should be doing. I was just the machine.

So I automated the mechanical part.

## What I Built

It's a Claude Code skill called `debug-txs`. You hand it a list of transaction hashes and an RPC URL, and it runs the full investigation for each one.

For every transaction, it:

- Replays the transaction with `cast run` and reads the full trace
- Pulls verified source code for key contracts from Etherscan
- Resolves function selectors so the trace is actually readable
- Identifies what happened, what moved, what reverted
- Writes a plain-language summary into a clean markdown report

No raw trace dumps. No copy-pasting between a terminal and a block explorer. Just a report that tells you what happened and, for failed transactions, where it broke and what to look at next.

The report structure is consistent across every run: a full index table at the top, a section per transaction, an errors section for anything that couldn't be processed. You can share it directly with your team without cleaning it up first.

## The Distinction That Matters

The skill investigates and reports. It doesn't touch any code.

That might sound like a limitation, but it's intentional. When a transaction fails, understanding what happened and deciding what to fix are two different problems. The first is mostly mechanical — trace analysis, contract lookup, selector resolution. The second requires engineering judgment: understanding the protocol, knowing what the intended behavior was, deciding whether the fix is a simple guard or a deeper architectural change.

The skill handles the first problem completely. I still own the second.

This is the right division of labor. The parts of debugging that eat time without requiring thought are exactly the parts that should be automated. The parts that actually require domain knowledge — those stay with the engineer.

## How It Works in Practice

You invoke it with:

```
/debug-txs https://mainnet.infura.io/v3/...
```

It asks for your transaction hashes (paste them inline or point to a `.txt` file), an output directory, and an Etherscan API key if it's not already in your environment. It processes hashes in parallel batches of three and assembles everything into a single report when it's done.

A few things worth knowing if you use it:

**Traces get large.** Complex DeFi interactions can produce thousands of lines of cast output. The skill is designed to digest traces rather than reproduce them — you won't see a raw trace dump in the report — but context accumulates. Don't feed it 50 hashes in one session. Break large batches into smaller runs.

**It needs `cast` and an RPC URL.** Foundry has to be installed on your machine, and you need an endpoint for the chain the transactions occurred on. Any standard provider works.

**It won't run without source.** Contract lookups depend on Etherscan verification. If a key contract isn't verified, the skill still analyzes the trace but won't be able to pull source snippets for it.

## Part of Something Bigger

`debug-txs` is one piece of a Solidity skill ecosystem I've been building with Claude Code.

Writing contracts. Gas analysis. Now debugging. Each as a focused, reusable slash command that handles a specific category of mechanical work. The goal isn't to replace the engineering — it's to eliminate the friction that exists around it.

What I've found is that each skill sharpens the others. Once I had a debugging skill, I started writing contracts with better error messages because I could see exactly how those messages surfaced in the report. Once I had a gas analysis skill, I stopped going down rabbit holes during active development — I'd defer gas questions to the skill and stay focused on the logic. The skills don't just save time individually. They change how you move through the workflow.

## Where to Get It

The skill is open on GitHub at [chasebrownn/claude-skills](https://github.com/chasebrownn/claude-skills/tree/main/skills/debug-txs). The README covers installation, usage, requirements, and what each section of the report contains.

If you're doing smart contract work and you haven't looked into Claude Code skills yet, this is a good entry point. The workflow is simple, the output is immediately useful, and it's easy to modify the skill to fit your specific setup or reporting preferences.

The mechanical parts of debugging have always been the least interesting parts. It's good to stop doing them manually.
