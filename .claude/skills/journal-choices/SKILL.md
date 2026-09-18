---
name: journal-choices
description: A message that offers the user choices in prose holds the agent until it asks through a question
---

# Choices asked properly

A message that offers the user choices in prose holds the agent until it asks through a question.

Two or more listed options and a question in the same message: the agent is told to use journal question ask --set options=…; the hold lifts when a question is created.

It listens to: agent.updated, question.created. It speaks on idle. On by default; the viewer's Settings switches it per environment, and `triggers.choices` in the environment's settings tunes it.
