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
   <doc> "Plan" --brief`. You file it, because a subagent cannot write the journal — and
   that is the moment you judge whether it is right.
4. **The steps.** Dispatch a second agent with the brief AND the plan: concrete steps per
   phase, what the plan missed, what could go wrong, what to verify. File it as a part,
   "Steps". Two agents, because the one that wrote the plan will not find its own gaps.
5. **What must hold.** `journal pin "<constraint>" --doc=<doc>` for each fact every later
   reader needs — the API that must not change, the ruling the user gave, the thing that
   already works and must keep working. A rule only if it binds every environment.
6. **The to-dos, one per unit of work, in order.** `journal todo "<title>" --brief
   --doc=<doc>.<p>` with the brief on stdin: what exactly, where to start, what done looks
   like. Small enough that one is one sitting. Questions only the user can answer:
   `journal todo ask <n> "<question>"`, so auto skips it and the user sees it. The last
   to-do is always "verify and close": the definition of done, the suite, the tracker.
7. **Auto?** Ask the user. `journal todo auto on` means the list is worked without asking.
8. **The page.** `journal environments "<name>"`. Read it as the one who picks this up
   would: is the first to-do startable from the page alone? If not, the brief is short.

Then offer the three ways to run it and let the user choose:

    journal todo start 1                work it now, in this session
    journal switch "<name>"             leave it for a session that starts later, or a colleague
    journal delegate "<name>"           then dispatch a subagent with the page as its brief

## Delegating

`journal delegate "<name>"` makes this session, and every subagent it dispatches, act on
that environment until `journal delegate --off`. A delegated subagent is journaled like
a session: its journal commands land there, the write gate holds it to declared work,
the hints reach it, its stop is held while work is open, and the rules come back as its
window fills. It may not `switch`, `delegate` or `prepare` — the environment is the
session's to move. Brief it with the page, and tell it to `journal todo start <n>`,
`journal work update` as it goes, `journal work end` when done, and to pin what it
learned. When it reports back, read `journal environments "<name>"` before you file
anything: what it pinned is already there.

One session works an environment at a time; a delegated one counts as this session's.
