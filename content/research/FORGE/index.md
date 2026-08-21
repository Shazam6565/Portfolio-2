---
slug: '/research/forge'
title: 'FORGE: Force-Guided Exploration for Robust Contact-Rich Manipulation under Uncertainty'
paper: 'FORGE'
citation: 'Noseworthy, Tang, Wen, Handa, Kessens, Roy, Fox, Ramos, Narang & Akinola, IEEE RA-L 2024'
paperLink: 'https://arxiv.org/abs/2408.04587'
date: '2026-08-19'
status: 'reviewed'
input: |
  Robot proprioception plus force/torque sensing and (uncertain) pose
  estimates, for contact-rich assembly tasks (peg-in-hole insertion, gear
  meshing, nut threading) under real-world pose uncertainty that sim-only
  training doesn't have to deal with.
supervisionRequired: |
  Reinforcement learning in simulation, with two mechanisms doing the real
  work instead of hand-labeling: a learned force-threshold that decides when
  contact force means "back off" versus "push through," and dynamics
  randomization so the sim-trained policy survives contact with the real
  world.
representationLearned: |
  A force-aware manipulation policy that fuses proprioception and
  force/torque feedback with a learned force threshold, rather than treating
  force purely as a penalty term, letting it distinguish expected contact
  during insertion from contact it should react to.
robotActionConnection: |
  Direct and this is the connection I'm building toward, not one I've fully
  closed yet. My peg-insertion project trains against Isaac Lab's
  `Isaac-Forge-PegInsert-Direct-v0` environment (FORGE's own benchmark task),
  but my ablation only tests force *observation* vs. force *penalty*. I
  haven't implemented FORGE's actual force-threshold mechanism or dynamics
  randomization scheme yet.
realHardwareTest: |
  FORGE itself validates sim-to-real transfer on a real robot arm across
  multiple assembly tasks, including a multi-stage planetary gearbox
  assembly. My own implementation has stayed sim-only in Isaac Lab so far.
limitations: |
  Force-threshold tuning and dynamics randomization both add real
  engineering surface area: get the randomization ranges wrong and sim-to-
  real transfer fails quietly. My own results underscore the underlying
  fragility even before adding FORGE's specific mechanisms: a plain force
  penalty without observation made performance *worse*, not better.
proposedExperiment: |
  Implement FORGE's actual force-threshold and dynamics-randomization scheme
  on top of my existing peg-insertion setup, then attempt real sim-to-real
  transfer on a physical arm instead of stopping at the sim-only ablation.
githubRepo: 'https://github.com/Shazam6565/Policy-RL-Peg_insertion'
youtubeVideo: ''
---
