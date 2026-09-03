---
name: journal-handoff
description: "Preparing an environment somebody else can pick up, and handing it to agents: `journal prepare`, `journal handoff` and its two prompts, `journal delegate`, and the runner's worktree. LOAD THIS BEFORE RUNNING ANY OF THOSE COMMANDS — prepare, handoff, delegate, environments \"<name>\" — and whenever the user asks to prepare an environment, set up the journal for an issue or a PR, make a hand-off, hand work to a subagent, delegate an environment, or run an environment's to-dos with agents. It says which agent gets dispatched with which model, which gets a worktree, what the hand-off agent may not do, and what happens to the branch a runner hands back. The journal skill covers everything else; this one covers only handing work over. Not for subagents: a subagent reports what it found and the main conversation files it."
---

# Handing an environment over

This is the journal's hand-over half: making an environment somebody else can pick up from
A to Z, and having agents do it. Everything else — tags, declaring work, pins, rules,
to-dos, reading the transcript back — is the `journal` skill; load that one for those.

**If you are a subagent, stop here.** You cannot run these commands: `prepare`, `handoff`,
`delegate` and `switch` are the session's, and are refused from a subagent even when it is
delegated. Report what you found; the conversation that dispatched you files it.

**Load this skill before the first `prepare`, `handoff` or `delegate` of a session.** The
commands print what to do next, but not which model to dispatch, what may not be done
between the two prompts, or what becomes of the branch — those are here.

# Preparing an environment

Only when the user asks for it — "prepare an environment for …", "set up the journal
for this issue", "make a hand-off for …". Not a default: most work is a to-do or open
work on the environment you are already on. When asked, the goal is an environment that
anyone can pick up from A to Z: you later, another session, a colleague, a subagent.

    journal prepare "<name>"          creates it, switches this session to it, prints this checklist
    journal environments "<name>"     the page whoever picks it up reads first

Name it after the issue when there is one — `WWM-1601`, `PR-412` — so the environment and
the tracker agree on what it is.

## The procedure

1. **The source, whole.** A link or an id: fetch it with the tool the session has —
   `gh issue view`, `gh pr view`, the tracker's own tool when one is connected. Raw
   text: as given. Ask when only the user has it. Read the comments too; the ruling is
   often in the third one.
2. **The brief, as a doc.** `journal docs add "<name>: <title>" --abstract "<one line>"
   --brief` with the source as the intro, so the doc IS the issue, not a paraphrase of it.
   Attach what is not prose: `journal docs attach <doc> <path> "<what it is>"` for the
   design, the screenshot, the export. Acceptance criteria as a part if the source has
   them.
3. **The plan.** Dispatch a Plan agent with the doc's text: phases, and the work in each,
   with the files it expects to touch. File the result as a part: `journal docs part
   <doc> "Plan" --brief`. You file it, because a subagent that is not delegated cannot
   write the journal — and that is the moment you judge whether it is right.
4. **The steps.** Dispatch a second agent with the brief AND the plan: concrete steps per
   phase, what the plan missed, what could go wrong, what to verify. File it as a part,
   "Steps". Two agents, because the one that wrote the plan will not find its own gaps.
5. **What must hold.** `journal pins add "<constraint>" --doc=<doc>` for each fact every later
   reader needs — the API that must not change, the ruling the user gave, the thing that
   already works and must keep working. A rule only if it binds every environment.
6. **The to-dos, one per unit of work, in order.** `journal todos add "<title>" --brief
   --doc=<doc>.<p>` with the brief on stdin: what exactly, where to start, what done looks
   like. Small enough that one is one sitting. Questions only the user can answer:
   `journal todos ask <n> "<question>"`, so auto skips it and the user sees it. The last
   to-do is always "verify and close": the definition of done, the suite, the tracker.
7. **Auto?** Ask the user when YOU will work the list. When a hand-off runner will,
   `journal handoff --run` turns auto on for the environment itself — a runner exists to
   work a list to its end, and with auto off its stop is not held for the next to-do.
8. **The page.** `journal environments "<name>"`. Read it as the one who picks this up
   would: is the first to-do startable from the page alone? If not, the brief is short.

Then offer the three ways to run it and let the user choose:

    journal todos start 1                work it now, in this session
    journal switch "<name>"             leave it for a session that starts later, or a colleague
    journal delegate "<name>"           then dispatch a subagent with the page as its brief

## By agents: `journal handoff`

`journal handoff "<name>" "<source>"` does steps 1–6 and 8 through agents; whether auto goes on stays yours to ask. It creates and
delegates the environment and prints the hand-off agent's prompt; you dispatch that ONE
subagent (opus) and do nothing else for the environment until it reports READY. The
hand-off agent fetches the source, writes the brief, dispatches its own Plan agent and
critic (a subagent may dispatch subagents), pins what must hold, writes the to-dos in
order and validates the page. Then `journal handoff "<name>" --run` prints the runner's
prompt with the page inside it: dispatch that one subagent **with its own worktree**
(`isolation: "worktree"`), read `journal environments "<name>"` when it reports, and
`journal handoff --off`. The worktree is the runner's alone, so two runs of two
environments never edit one checkout; its `.journal` is a symlink to the main checkout's,
so the record stays one. `--run` also turns AUTO ON for the environment, so the runner
takes the next to-do whenever nothing is open instead of stopping to ask; it stays on
after `--off`, and `journal todos auto off` ends it when the leftovers are the user's to
decide. The hand-off agent gets no worktree — it writes only the journal,
which is shared on purpose. The runner commits as it goes and hands back a BRANCH: tell the
user what is on it and offer the merge, or, if they have already asked for the work to be
merged, say so in the runner's prompt and it merges when it is done. If the hand-off agent reports
BLOCKED, put its question to the user and dispatch no runner; `--run` refuses an
environment with nothing ready. A session that died mid-run is freed from a terminal with
`journal handoff --off --session=<id>`. The two prompts are the two
sections of `.journal/handoff.md`; the shipped `handoff.default.md` is the template, and
the project's copy wins and is never touched by an update.

## Delegating

`journal delegate "<name>"` makes this session, and every subagent it dispatches, act on
that environment until `journal delegate --off`. A delegated subagent is journaled like
a session: its journal commands land there, the write gate holds it to declared work,
the hints reach it, its stop is held while work is open, and the rules come back as its
window fills. It may not `switch`, `delegate`, `prepare` or `handoff` — the environment is
the session's to move. Brief it with the page, and tell it to `journal todos start <n>`,
`journal work update` as it goes, `journal work end` when done, and to pin what it
learned. When it reports back, read `journal environments "<name>"` before you file
anything: what it pinned is already there.

One session works an environment at a time; a delegated one counts as this session's.
