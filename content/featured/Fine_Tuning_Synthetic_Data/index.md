---
date: '2'
title: 'Fine-Tuning Object Detection Model with Generated Synthetic Data'
github: 'https://github.com/adityasugandhi/Fine-tuning-with-synthetic-data'
external: ''
tech:
  - Omniverse Replicator
  - PyTorch
  - Faster R-CNN
  - NVIDIA DGX Spark
---

By [Aditya Sugandhi](https://github.com/adityasugandhi), my co-author on the from-scratch Transformer implementation. An end-to-end workflow for training an object-detection model entirely on synthetic data: generating labeled images with NVIDIA Omniverse Replicator, converting them to KITTI format, and fine-tuning a Faster R-CNN (ResNet-18 + FPN) on NVIDIA DGX Spark hardware.

Keeps the best checkpoint by validation mAP separate from the last, since detection models overfit synthetic data readily, a small but important guard against the sim-to-real generalization gap.
