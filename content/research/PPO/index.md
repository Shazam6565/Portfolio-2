---
slug: '/research/ppo'
title: 'Proximal Policy Optimization Algorithms'
paper: 'PPO'
citation: 'Schulman, Wolski, Dhariwal, Radford & Klimov (2017)'
paperLink: 'https://arxiv.org/abs/1707.06347'
date: '2026-08-19'
status: 'reviewed'
input: |
  Robot proprioceptive observations (joint positions/velocities, end-effector
  pose) and, in the force-aware variant, force/torque readings, plus a
  scalar reward signal from the environment. No labeled data of any kind;
  PPO only needs a simulator it can act in and a reward function.
supervisionRequired: |
  On-policy reinforcement learning, not supervised learning; there are no
  labels, only reward. The real supervision burden shifts to reward design:
  in my peg-insertion project, a poorly shaped reward (a force penalty with
  no force observation) actively hurt performance, which says a lot about
  how much of PPO's real "supervision" is actually the reward function.
representationLearned: |
  A stochastic policy (actor) and a value function (critic), both function
  approximators mapping observations to actions/value estimates, trained
  with PPO's clipped surrogate objective so each update stays close to the
  previous policy, trading some sample efficiency for training stability
  versus vanilla policy gradients.
robotActionConnection: |
  Direct. PPO is literally how the robot actions were learned in my
  peg-insertion project. Trained a Franka arm policy in NVIDIA Isaac Lab via
  RL-Games' PPO implementation across four observation/reward variants (3
  seeds each) on a peg-in-socket insertion task.
realHardwareTest: |
  Sim-only in my implementation: trained entirely in Isaac Lab, no physical
  Franka deployment yet.
limitations: |
  On-policy sample inefficiency (needs a lot of simulated interaction) and
  high sensitivity to reward shaping. Concretely: force *observation* alone
  roughly doubled task success (7.3% to 14.2%), but adding a force *penalty*
  without observation made it worse (3.4%): PPO optimized exactly what the
  reward told it to, including the parts I got wrong. Even the best variant
  only reached ~14% success, well short of anything deployment-ready.
proposedExperiment: |
  Attempt sim-to-real transfer of the best (force-aware) policy variant onto
  a physical Franka arm, and compare PPO against an off-policy algorithm
  (e.g. SAC) on the same task to see how much of the sample inefficiency is
  PPO-specific versus inherent to contact-rich manipulation.
githubRepo: 'https://github.com/Shazam6565/Policy-RL-Peg_insertion'
youtubeVideo: ''
---
