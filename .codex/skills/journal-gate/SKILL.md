---
name: journal-gate
description: A write is refused while no work is open; the flag the hook reads is set here
---

# The write gate

A write is refused while no work is open; the flag the hook reads is set here.

Declare work before the first write; reads are never refused.

It listens to: agent.created, work. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.gate` in the environment's settings tunes it.
