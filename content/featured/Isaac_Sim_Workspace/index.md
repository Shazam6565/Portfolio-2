---
date: '4'
title: 'Isaac Sim Workspace'
github: 'https://github.com/Shazam6565/isaac-sim-workspace'
external: ''
tech:
  - Isaac Sim
  - OpenUSD
  - Docker
  - Brev
---

A remote-controlled development workspace for running NVIDIA Isaac Sim on cloud GPU instances while driving it from a local Claude Code agent, treating the cloud instance as fully disposable.

Scene work is version-controlled in Git as the source of truth (USD `.usda` files are text-based and diffable, with assets referenced rather than embedded), while slash commands manage the full instance lifecycle (spin up, save, resume, screenshot) over an SSH tunnel and WebRTC viewer.
