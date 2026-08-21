---
slug: '/research/aiayn'
title: 'Attention Is All You Need'
paper: 'AIAYN'
citation: 'Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser & Polosukhin, NeurIPS 2017'
paperLink: 'https://arxiv.org/abs/1706.03762'
date: '2026-08-17'
status: 'reviewed'
input: |
  Raw natural-language text, tokenized with tiktoken's cl100k_base BPE
  encoding (the same subword tokenizer behind GPT-3.5/4, ~100k vocabulary)
  and fed in as fixed 128-token context windows for autoregressive
  next-token prediction. The corpus was a single public-domain text, "The
  Stock Exchange" by Charles Duguid.
supervisionRequired: |
  Fully self-supervised. The only "label" is the next token in the sequence,
  which comes for free from the raw text itself, with no manual annotation
  at all. A causal (triangular) mask ensures each position only attends to
  earlier tokens, so the entire training signal is cross-entropy against the
  actual next token.
representationLearned: |
  Contextual token representations built entirely from scaled dot-product
  multi-head self-attention, with no recurrence or convolution. My
  implementation is a small decoder-only GPT-style stack: 3 transformer
  blocks, 3 attention heads, 384-dim embeddings, 128-token context, 0.2
  dropout. Token + position embeddings feed stacked causal-attention blocks
  with residual connections and layer normalization, ending in a final
  linear projection to vocabulary logits.
robotActionConnection: |
  None directly. This implementation is pure text completion, not robot
  actions. The connection is architectural rather than task-level: attention
  is now the backbone of nearly every modern robot-policy model (VLAs,
  video-prediction transformers like ViPRA), which is why re-deriving it from
  scratch mattered before extending into Physical AI / Isaac Lab work.
realHardwareTest: |
  Sim/software-only. No hardware or embodied evaluation of any kind; trained
  and evaluated purely on GPU compute (4x NVIDIA A100) against a text corpus.
limitations: |
  Very low learning rates (1e-6, 1e-5) never converged within a reasonable
  epoch budget: validation loss stayed around 5-6.8 even after 50,000
  epochs. Higher learning rates approaching 3e-4 risked divergence/
  oscillation near minima. The model itself is tiny by modern standards
  (3 layers / 3 heads / 384-dim, well below even GPT-2 small), trained and
  evaluated on a single stylistically narrow 19th-century text, so the
  near-1.0 perplexity it reaches (best: LR 3e-4, 80/20 split, val loss
  0.083, perplexity 1.086) is closer to memorizing that one corpus than
  evidence of broad language modeling capability; generalization beyond it
  was never tested.
proposedExperiment: |
  Repurpose the same from-scratch attention stack as the backbone of a small
  transformer-based behavior-cloning policy in Isaac Lab (state or vision
  tokens in, action tokens out), to directly compare implementing attention
  for language versus attention for robot actions using the same base code.
githubRepo: 'https://github.com/Shazam6565/Text-completion-model'
youtubeVideo: ''
---
