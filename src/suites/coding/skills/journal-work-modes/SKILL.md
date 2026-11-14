---
name: journal-work-modes
description: Work as the main agent of the coding suite from its work controls; read it when auto mode, the presets, read-only helpers or the worker limit come up
---

# Work modes

The coding suite has one driver for the main agent, `coding.main`. What you may do comes from the work controls of your
environment, not from a mode. Your first line of a session tells you to read them: `journal work-settings show`.

## The work controls

- `coding.auto-mode` (per environment): whether you may write project files and start tasks yourself.
- `coding.workers.main-dispatches-workers`: whether you may send workers (`journal worker dispatch`). Set to false it
  refuses your dispatches.
- `coding.main-starts-read-only-helpers`: whether you may start read-only helpers. Set to false it refuses them.
- `coding.continue-while-delegatable`: whether a stop is held while open tasks can still go to workers.
- `coding.workers.merger-on`, `coding.designer-enabled` and `coding.workers.main-agent-may-merge` decide the merger, the
  designer and whether you merge workers yourself.

## Presets

- Builder: Auto on and Keep going off. You build tasks yourself, one at a time, and may also send workers.
- Orchestrator: Auto off and Keep going on. You plan, give every task to a worker and check what comes back.
- Any other mix of the controls is custom. A user applies a preset with `journal work-settings preset <name>`.

## Auto mode

- `coding.auto-mode` ("The main agent may also write code itself") is one setting for each environment. It is the only
  switch for your own code writing.
- With it on, you may write project files and start tasks yourself, or hand a task to a worker. A stop with no task in
  hand starts the next open task as yours and refuses the stop.
- With it off, every edit of a project file is refused, whether by a file tool or a shell line, and `journal task start`
  is refused. Documents, plans and journal records stay allowed, and you may still send workers, start allowed read-only helpers,
  report, test and release. Send the work to a worker instead.
- With Keep going on, a stop is refused while tasks of your environment are open, and names them. At the worker limit
  (`coding.workers.worker-run-limit`, 2 by default) you can send no more, so you may stop until a worker ends.
- Send related tasks to the worker that knows them: see journal-dispatching-workers.
- It does not pause receiving tasks. Workers you already sent keep their work and may be resumed.

## Changing the controls

- The controls, the worker limit and the settings like them are the user's. An agent's write of one is refused.
  A main agent asks with `journal setting request <key> <value> --reason "<why>"`: the user answers in the dock, and an
  approval applies the change if the setting has not changed since. Any other agent says what it needs in its report.
- The work-mode control in the top bar of the viewer applies a preset, and asks first while the agent works on a task
  or has read-only helpers out.
- Workers, read-only helpers and reviewers have drivers of their own; this choice is the main agent's only.
