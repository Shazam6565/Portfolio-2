---
date: '1'
title: 'Policy Training - Force-Aware Peg Insertion with RL'
github: 'https://github.com/Shazam6565/Policy-RL-Peg_insertion'
external: ''
tech:
  - Isaac Lab
  - PPO
  - RL-Games
  - Python
---

Trained a Franka robot policy to insert a peg into a socket while minimizing contact force, testing whether giving a policy force-sensing actually improves safety and robustness over a geometry-only baseline.

Forked from Isaac Lab's `Isaac-Forge-PegInsert-Direct-v0` environment and trained four PPO policy variants (3 seeds each) via RL-Games. The result: force _observation_ is what let the policy learn the task at all. Giving it force feedback roughly doubled success rate (7.3% → 14.2%), while penalizing force without sensing it actually hurt performance.
