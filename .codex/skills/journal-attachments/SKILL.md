---
name: journal-attachments
description: Images and videos are described in a few searchable words by the agent
---

# Attachment tags

Images and videos are described in a few searchable words by the agent.

When a media file needs tags, inspect it and run `journal <type> tag <n> <name> <tags>` with a few words describing what it shows.

It listens to: agent.updated, updated. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.attachments` in the environment's settings tunes it.
