---
name: journal-work-modes
description: Work as the builder or the orchestrator, the two modes of the coding suite; read it when your mode, auto mode or the worker limit comes up
---

# Work modes

The coding suite drives the main agent in one of two modes. Your first line of a session says which one you are in.

## Builder

- You build each task yourself, one at a time, and may send subagents to read and search for you.
- You may also send workers (`journal worker dispatch`) for a job better done beside you. Two settings can end that:
  `coding.workers.builder-dispatches-workers` set to false refuses your dispatches, and
  `coding.builder-sends-subagents` set to false refuses your subagents.
- With auto mode on (`coding.auto-mode`, per environment), a stop with no task in hand starts the next open task as
  yours and refuses the stop.

## Orchestrator

- You plan, give every task to a worker and check what comes back. You start no task yourself: `journal task start` is
  refused, and the task stays open for a worker.
- A stop is refused while tasks of your environment are open, and names them. At the worker limit
  (`coding.workers.worker-limit`, 2 by default) you can send no more, so you may stop until a worker ends.
- Send related tasks to the worker that knows them: see journal-workers.

## Changing mode

- `journal driver choose coding.builder` or `journal driver choose coding.orchestrator` changes the mode of an
  environment. The work-mode control in the top bar of the viewer does the same, and asks first while the agent
  works on a task or has helpers out.
- Workers, subagents and reviewers have drivers of their own; this choice is the main agent's only.
