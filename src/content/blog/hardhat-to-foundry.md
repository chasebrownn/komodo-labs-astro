---
title: "Why I Switched from Hardhat to Foundry (And Haven't Looked Back)"
date: 2026-02-10
description: "After years of Hardhat, I made the switch to Foundry. Here's what changed, what got better, and the one thing I still miss."
tags: ["Solidity", "Foundry", "Tooling", "Smart Contracts"]
---

If you've been writing Solidity for more than a year, you've probably spent a significant chunk of your life inside Hardhat. I certainly did. It was the default — everyone used it, the docs assumed it, and the plugin ecosystem was solid enough to get you wherever you needed to go.

Then Foundry came along, and I resisted it longer than I should have.

## What Finally Made Me Switch

Honestly? Test speed.

I was working on a complex DeFi protocol with hundreds of test cases. A full Hardhat test run was taking upwards of 4–5 minutes. That's not a dealbreaker in isolation, but when you're iterating on tricky invariants and running tests constantly, it adds up fast.

A colleague pushed me to try Foundry on the same suite. It ran in under 30 seconds.

That was the end of the conversation.

## What Actually Changed

**Tests in Solidity, not JavaScript**

This one took some adjustment. Writing tests in Solidity feels weird at first — you're used to the flexibility of JS, the familiar `expect` syntax, the ability to pull in any npm package you want.

But once it clicked, I found the tests more expressive for smart contract work. You're writing in the same language as the contracts, which means no translation layer, no ABI gymnastics, and no fighting with ethers.js types.

```solidity
function testPegStability() public {
    vm.prank(alice);
    vault.deposit(1000e18);
    assertEq(vault.balanceOf(alice), 1000e18);
}
```

**Fuzzing out of the box**

This is the one that genuinely changed how I think about testing. Foundry's fuzz testing is built in — you just replace a concrete value with a parameter and Foundry generates thousands of random inputs automatically.

```solidity
function testFuzz_deposit(uint256 amount) public {
    vm.assume(amount > 0 && amount <= 1_000_000e18);
    vault.deposit(amount);
    assertEq(vault.totalAssets(), amount);
}
```

I've caught bugs with fuzz tests that would have sailed right through a handwritten test suite. It's become a non-negotiable part of my workflow.

**`vm` cheatcodes**

`vm.prank`, `vm.warp`, `vm.roll`, `vm.expectRevert` — these are incredibly powerful for simulating real-world conditions. Testing time-dependent logic, multi-user interactions, and revert conditions is dramatically easier.

## Honestly? I Don't Miss Hardhat At All

Truthfully, Foundry does everything better — and it just works out of the box. No wrestling with node packages, no installing plugins that may or may not be compatible with your current setup, no dependency hell when something breaks after an npm update. You clone the repo, run `forge build`, and you're working.

That's rarer than it should be in this ecosystem, and it's worth a lot.

## The Verdict

For any serious smart contract work, Foundry is the right choice. Faster tests, native fuzzing, and Solidity-native test writing make it the better tool for the job. I still keep Hardhat config around for specific deployment scripts on older projects, but new projects start in Foundry every time.

If you're still on Hardhat and haven't made the jump — do it on your next project. The learning curve is maybe a day. The upside is permanent.
