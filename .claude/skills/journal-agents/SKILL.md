---
name: journal-agents
description: "Dispatching subagents under the journal: always name the model (haiku, sonnet, opus), lend an environment so a subagent may write (`grant`, `--env`, `--as`), what stays refused for a subagent, and assigning it rows. Use it before every Agent dispatch, when a subagent must write to the journal, and when a hook refuses a subagent's journal command."
---

# Journal subagents and grants

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Dispatching a subagent

**Name the model, every time.** It is the one rule this package ships to every project
(`journal rules`, B1): `haiku` for mechanical work with a known answer, `sonnet` for care
without invention, `opus` only where the task turns on judgement. Unset hands out the
orchestrator's own, which is the most expensive model in the room. The user naming a model
is not an exception to this — it is the rule being followed; what it forbids is dispatching
without deciding.

**A dispatched agent works YOUR environment, and a worktree does not change that.** A
worktree is orthogonal to the journal: it is not an environment, does not hold one, and
never decides one. Whoever enters one keeps the environment they were on. What a subagent
gets from a worktree is its FILES; what it gets from the grant is its LEDGER. Those two are
easy to conflate and they are unrelated.

**Most subagents need no grant at all.** They report what they found and this conversation
files it — that is the normal case, and the section below is for the exception.

## A subagent that must write: lend it an environment

    journal grant "<environment>"        lend it to this session's subagents
    journal grant                        what this session has lent
    journal grant --off "<environment>"  take it back

**A subagent cannot be detected, only granted.** Its shell carries the dispatching
session's id — measured — so `journal pins add` run inside one is, to the machine, the same
act as you running it. Nothing the CLI can look at tells them apart.

So the grant is declared **twice**: by you, here, saying which environment you are lending;
and by the subagent, putting `--env="<name>"` on every journal command it runs. The hook
holds the two against each other, and refuses anything that fails either half. `journal
grant` prints the sentence to paste into the dispatch prompt — paste it verbatim, because
it carries the flag the whole mechanism turns on.

**Granting does not move you.** You stay where you are; the subagent writes somewhere else;
you read what it wrote with `journal environments "<name>"` when it reports.

**Some verbs stay refused however you grant**, for four different reasons, and a subagent
that needs any of them reports and lets you do it:

| refused | why |
|---|---|
| `switch` `claim` `prepare` `grant` `grants` `environments` (and `environment`, `env`, `envs`, `track`, `tracks`) | they move a SESSION, and the session a subagent would move is *yours* — it runs under your id |
| `rules` `rule` `promote` | a rule binds every environment, and it was lent one |
| `docs` `tools` | they belong to the project, not to the environment it was lent |
| `pins` `pin` `strike` `reminders` `reminder` `remind` | inherited, never written: re-read by every session that binds here, so a claim whose reasoning nobody saw would stand in the record's highest-authority position forever |

Reads are never refused — `--env="<name>" pins` shows it what it inherits.

**A subagent gets its own ledger, and is told its own name.** It cannot know it — nothing
in its process carries an agent id — so on its first tool call the hook creates
`environments/<lent>/agents/<id>/` and tells that agent the two flags to use:
`--env="<name>" --as="<id>"`. Its work is its own file, so two subagents can never open or
close each other's work.

**It reads the environment's pins and cannot write one.** Findings go up in its report and
you decide what becomes a claim. That is what keeps this one-directional: the child cannot
write what it inherits, so there is only ever one answer to which pin applies.

    journal assign <n> --to="<agent>"    hand it one row; nobody else may take it
    journal assign <n> --off             put it back on the list

**A held row lapses on a heartbeat, not on a promise.** Nothing can tell us a subagent
died, so `active` is observed — every write it makes stamps it — and a dispatch that
crashes releases its row on its own.

**It may REPORT a row finished; only you close it.** `journal todos report <n> "<how>"`
marks it done-pending and tells you; `journal todos done <n>` is yours. A runner marking
its own homework is a failure this project has already watched happen.

**Without a grant, a subagent writes nothing and that is the normal case.** Most subagents
should report what they found and let this conversation file it; the grant is for the ones
doing real work over a long stretch, where losing the record at the end is the loss.
