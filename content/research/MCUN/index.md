---
slug: '/research/mcun'
title: 'Improved Algorithms for Maximal Clique Search in Uncertain Networks'
paper: 'MCUN'
citation: 'Li, Dai, Wang, Ming, Qin & Yu, IEEE ICDE 2019'
paperLink: 'https://ronghuali.github.io/PaperFiles/Improved%20Algorithms%20for%20Maximal%20Clique%20Search%20in%20Uncertain%20Networks.pdf'
date: '2026-08-19'
status: 'reviewed'
input: |
  An uncertain graph G = (V, E, p), where every edge has a probability of
  actually existing (e.g. inferred confidence in a PPI network, or
  co-authorship strength in DBLP), plus two parameters: a minimum clique
  size k and a minimum clique probability threshold tau.
supervisionRequired: |
  None. This is a deterministic combinatorial-algorithms paper, not a
  learned model. The edge probabilities are given input data, not learned
  from anything; there's no training or supervision involved at all.
representationLearned: |
  Nothing learned. The paper's actual contribution is algorithmic: a new
  (Top_k, tau)-core pruning technique plus a cut-based optimization that
  shrink the search space before an improved backtracking enumeration,
  reducing worst-case time complexity from 2^n to 2^n' where n' is the size
  of a much smaller pruned subgraph.
robotActionConnection: |
  None. This is a graph-algorithms / database-systems project (FSU COP
  5725), unrelated to robot actions or Physical AI. Included here as real
  algorithmic work I implemented, not because it fits the Physical AI
  thread. The point of this template was never to pretend every paper
  connects to robotics.
realHardwareTest: |
  Not applicable. Evaluated on six real-world graph datasets (including
  DBLP co-authorship and PPI protein-interaction networks) as a software
  benchmark, with a case study on detecting protein complexes. No hardware
  or embodied evaluation of any kind.
limitations: |
  Still worst-case exponential (2^n') even after pruning. The speedup is
  entirely dependent on how much the (Top_k, tau)-core pruning shrinks the
  graph, which in turn depends on the graph's degeneracy. Real-world graphs
  with high degeneracy would see much less benefit from this technique.
proposedExperiment: |
  Apply the same core-pruning idea to an uncertain graph outside the
  social/PPI-network setting the paper evaluates (e.g. a sensor-network or
  multi-robot connectivity graph with uncertain links) to see whether the
  pruning assumptions (low degeneracy) still hold in that domain.
githubRepo: 'https://github.com/adityasugandhi/Improved-Algorithms-in-finding-maximal-and-maximum-clique-in-uncertain-networks'
youtubeVideo: ''
---
