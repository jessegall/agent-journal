---
name: journal-video
description: A video attached to a message is sampled into frames the agent can inspect
---

# Video frames

A video attached to a message is sampled into frames the agent can inspect.

Short clips yield a frame every half second, medium clips every two seconds, and long clips at most sixty frames.

It listens to: message.updated. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.video` in the environment's settings tunes it.
