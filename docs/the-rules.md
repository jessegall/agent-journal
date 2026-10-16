# The rules: who carries each one

Every rule the journal applies to an agent, and whether the chart carries it, a state or a listener keeps it, or
it could move to the chart later. "Chart" means the shipped chart draws it and the user can edit it; "state"
means it is part of the machine and stays as code; "chart-able" means a listener keeps it today and the chart's
catalogue could carry it once a check or an action it needs exists.

## Carried by the chart

- At a stop, at rest: parked tasks hold the stop and are named, in any mode.
- At a stop, at rest, auto mode on and tasks open outside a plan: the next task holds the stop.

## Chart-able, kept by a listener today

- The unread inbox named every third tool use, and the write held after five reminders (messages/hold_unread): the
  counter checks exist; the chart needs the inbox line's wording with its numbers.
- A message read and unanswered holds the next tool call that is not a journal command or a look at its files; a face answers only a few words (messages/hold_unanswered).
- The work in hand: a log asked after twenty-five edits, named every twenty-five, the write held at fifty (tasks/log_cadence).
- An idle agent with a parked task asked, now and then, whether it can go on (tasks/ask_after_parked).
- In auto mode, an agent idle for half an hour asked whether anything is left (tasks/check_in): needs a "quiet for" check.
- Unread messages named at a prompt, a start and a stop (messages/inbox_at_prompt, inbox_at_start, inbox_at_stop).
- A face the user puts on a message typed to the agent (messages/tell_reaction): needs a row trigger on reactions and a filler.
- Words the user watches for (triggers/watch_prompt, watch_tool): a trigger with words is a check the catalogue could add.
- The same shell command run three times in a row named (tasks/spot_polling).
- A fact, rule or reminder whispered when its keyword comes up (memory/whisper).
- A subagent dispatch without a model or a job refused (laws/judge_dispatch): a check on the tool's input.
- A result of many lines named (laws/measure_result).

## Kept by a state or a listener, by design

- The task in hand at a stop: carry on, a log when stale (the Working state).
- A session's start: the briefing, the hold until the journal skill and `journal environment here` (briefing, skills).
- Skills owed on entering a state and after a compaction (skills).
- The context mark: decide what survives, held there (memory/hold_at_mark); a new rule questioned once (memory/review_new_rule).
- Awaiting workers and their reports (workers/release_awaiting); a plan's advance and its approval (plans); a sequence's
  steps and its start on a row event (sequences); a question asked only through the journal (questions).
- The shell runner's parts, limits and the mixed-journal refusal; a long file not read whole (shell).
- Delivery of typed lines and their retyping (delivery); the thought in the working bubble (thinking).
- The voice at a start and when changed (voices); the commit line that closes tasks (git); checks run on their
  interval (checks); an agent owed a restart after a server change (mcp); silent sessions ended (briefing).

The walk itself: agent events walk the chart as a blocking listener right after the machine, so a hold or a
blocked stop reaches the agent and a said line rides on the hook's answer; row events walk on the worker thread
and only type. A path is at most fifty nodes long; a chart with a loop, a dangling line or an unknown entry is
refused before it is saved, so the walk never meets one.
