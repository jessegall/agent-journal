# The cycle: hooks, nudges, holds and stops

How the journal speaks to the agent, from A to Z, as version 4 runs it on 2026-10-15. Every arrow is one of
Claude Code's hooks or one journal command; every quoted line is typed into the agent's terminal or handed
back in a hook's answer. A 409 is a hook answered "no": the agent reads why and goes on.

## 0. The chart comes first

Since 2026-10-16 the journal's conduct is workflows, edited on the Workflows page and read afresh at every event.
A trigger has a list of workflows in the order the user drags: the locked guards first, then the Always ones that
run whatever the agent is doing, then the states' own, each bound to the state it runs in; a Stop here node ends
the event's walk for the workflows after it. An agent event is walked before its hook is answered, right after
the machine, so a hold or a blocked stop reaches the agent and a said line rides on the answer; the first hold of
an event wins and one move per event is taken; a row event is walked on the worker thread and can only say or
type. The counts the workflows keep for the agent, started, counted and read by nodes on the canvas, carry the
cadences that the engine once counted in secret. What the agent owes the journal, a skill to read, the look at what is in flight, a decision at a context mark, is a
fact on its row, set by a node and paid by a command, with the guards holding its writes meanwhile. What the
workflows do not carry the states and listeners below still do; the-rules.md lists which is which, and the-chart.md says how a workflow is read and edited.

## 1. One session, start to stop

```
                 ┌───────────────────────────────────────────────────────────────────┐
                 │  SessionStart (fresh, resumed, or back from a compaction)         │
                 └───────────────────────────────┬───────────────────────────────────┘
                                                 ▼
   start block, typed at once:  ready on <env> · quiet · laws · rules · facts · reminders
                                · "another agent worked here until HH:MM" (takeover)
                                · "waiting for you: N tasks, N messages, N questions"
                                                 ▼
                       state ─► LoadingSkill(journal), then Orienting
                       writes refused until the journal skill is read
                       writes refused until `journal environment here` is run
                                                 ▼
                     ┌──────────────────────── WORK LOOP ─────────────────────────┐
                     │                                                             │
                     │  PreToolUse ──► blocking listeners answer: 200 go, 409 no   │
                     │      • unread messages: named every 3rd use; after 5        │
                     │        reminders the next write waits                       │
                     │      • a message read and unanswered: nudged after 10 uses, │
                     │        every tool call held after 15 (both settings);        │
                     │        a journal command always passes                      │
                     │      • 50 unlogged edits ─► the next write waits for a log  │
                     │      • every 10th use names the task in hand                │
                     │      • a shell command runs through run.sh: each part        │
                     │        recorded; past 30 s (10 s with a message waiting)     │
                     │        it goes to the background and reports when it ends   │
                     │                                                             │
                     │  PostToolUse ──► deferred listeners: a skill marked read,   │
                     │      the latest thought kept for the bubble, a reply found  │
                     │      in thinking posted, a commit's `Journal: tasks done N` │
                     │      closes task N                                          │
                     │                                                             │
                     │  MessageDisplay ─► the turn's parts gathered, put in order; │
                     │      [!reply:N] answers N; a face alone is bounced back;    │
                     │      a turn that only says "noted" stays out of the chat    │
                     │                                                             │
                     │  UserPromptSubmit ─► a new prompt: unread messages named    │
                     └────────────────────────────┬────────────────────────────────┘
                                                  │ the agent stops writing
                                                  ▼
                     ┌───────────────────────── STOP HOOK ────────────────────────┐
                     │  the state stays what it is; the stop itself is answered:   │
                     │                                                             │
                     │  working on a task ──► "task N is in hand: carry on"  (409) │
                     │  idle, auto on, tasks open ──► "tasks are open: task N next:│
                     │        <title>; sure you want to stop?"              (409)  │
                     │  idle, parked tasks ──► "parked tasks, still open: …" (409, │
                     │        once; the second stop passes)                        │
                     │  paused and the journal awaits the agent (a skill, the      │
                     │        environment read, a context-mark decision) ──► "you  │
                     │        stopped while the journal awaits <what>"     (409,   │
                     │        once)                                                │
                     │  waiting on the user (question), on workers, on an awaited  │
                     │        run, or stuck with a reason ──► the stop passes     │
                     │  idle, nothing open ──► the stop passes                     │
                     └────────────────────────────┬────────────────────────────────┘
                                                  ▼
                                        the agent sits at its prompt
```

## 2. Lines typed while the agent sits or works, with no hook of its own

```
   a message arrives        ──► "new message N"  (or "new messages N, M", or
                                 "7 messages unread: journal message unread")
   a reaction of the user's ──► "👍 on your message N"
   a worker reports         ──► "worker N reported"
   a background chain ends  ──► "the command in the background ended. last lines: …"
   a question is answered   ──► "question N answered: …"  (the Waiting state goes back)
   a rule or fact's keyword ──► "fact N: …"  (whispered once per row per agent)
   the clock, every minute  ──► a parked task named after a quiet minute · an awaited run
                                 checked every 5 min · a session silent for an hour is ended
```

Each typed line is followed by Enter, so it becomes the agent's next prompt: UserPromptSubmit fires and the
loop above runs again. A line that starts with `[journal]` is an instruction to the agent, never news for
the user; the agent acts on it and says nothing about it in the chat.

## 3. Compaction and takeover

```
   PreCompact ──► the skills read are forgotten; nothing is said
   SessionStart(compact) ──► the start block again, then Orienting: writes wait for
                            `journal environment here`, which names the task in hand, open and parked
                            tasks, unread and unanswered messages, questions, workers, background runs,
                            rules, facts and reminders
   a session that ended and starts again ──► idle, then the same start
   another agent worked here lately ──► "you took it over": what the chat holds was written to that agent
```

## 4. Tasks, in one cycle

```
   file ──► start (one in hand) ──► log as it goes ──► done, with how
              │                                          ▲
              │ something else must happen now           │ resume
              ▼                                          │
            park, with why ──────────────────────────────┘
   a stop with the task in hand: "carry on"   ·   truly stuck: journal stuck "<why>", and the stop passes
```
