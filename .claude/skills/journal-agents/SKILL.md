---
name: journal-agents
description: A subagent's writes keep its row alive; a row it reports is handed to the dispatcher; one silent too long gives its rows back
---

# Subagents

A subagent's writes keep its row alive; a row it reports is handed to the dispatcher; one silent too long gives its rows back.

A subagent is lent an environment (journal environment <n> grant) and names itself with --agent on every command; its rows carry that mark in the same record. agents.lapse (minutes, 20) is how long it may go silent before an assignment clears.

It listens to: agent.updated, created, todo.updated. It speaks on the events it listens to. On by default; the viewer's Settings switches it per environment, and `triggers.agents` in the environment's settings tunes it.
