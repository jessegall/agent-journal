---
name: ProcessesArchitecture
description: Load it before writing code in the processes module of version 5 or in the Go runner, so every shell line runs through the one runner, the folder format has one owner and a rule only answers.
summary: Only RunnerRewriteRule rewrites a shell line, only OutputFolder knows the files of a run's folder, the runner reports through the journal client and never to the database, a processes rule runs and writes nothing itself, and the hook holds each program's rewritten input in the program table.
tier: mandatory
languages: [python, go]
---

# The processes architecture

A shell line of a main agent or a worker runs through `journal-run`, which keeps the run's files; the module keeps the rows.

## When it fires

- **`slot-written-outside-the-queue`** - a call to `OutputFolder.write_slot` outside `RunSlots` bypasses
  admission. Only `RunSlots` grants a slot after the parts and their reader requests are saved.

- **`shell-input-rewritten-outside-the-runner-rule`** - a rule other than `RunnerRewriteRule` calls `RuleAnswer.rewritten`.
  Only that rule gives a shell line a new input; the others answer with lines or a refusal.
  `ForeignHooksRule` may forward a managed hook's native `updatedInput` in `RuleAnswer`; it does not build a
  shell command. The rewrite-conflict check refuses a managed rewrite competing with the runner.
- **`process-folder-layout-outside-output-folder`** - Python names `heartbeat`, `run.sh`, `<n>.out` or `<n>.status`
  outside `support/output_folder.py`. Read and write a run's files through `OutputFolder`.
- **`runner-reaches-the-database`** - a file of `tools/journal-run` imports `database/sql` or a SQLite driver. The
  runner reports through the journal client: `process part-end`, `process end`, `process background`, `process lose`.
- **`process-rule-runs-or-writes`** - a rule in `processes/rules/` runs a shell, a command or a write itself. A rule
  answers; the commands it wants go in its answer with `running()`.
- **`go-updated-input-shape-outside-programs`** - Go outside `journal-hook/programs` writes `run_in_background`. What a
  program's rewritten input carries is in its row of the program table.
- **`reading-judged-outside-the-decider`** - a rule, a listener or a handler judges whether a command has a good
  reader (`ReaderJudge.misses`, `fields_missing`, `ReaderDemands`, `ReaderSelection.choose`, `ReaderLayers.ordered`).
  Ask the engine: `ReadingDecider` decides from the facts `ReadingFacts` gathers; a rule only reads the stored decision.
- **`pressure-outside-the-enforcer`** - code other than `ReadingEnforcer` blocks or refuses an agent over a reader: a
  `BlockUntil` in the processes module, or a refusal with a reading declaration (`READER_BLOCK`, `READING_PREVENTED`,
  `SILENT_START_REFUSED`, `REDIRECTED_RUN`...). The enforcer is the only code that presses and states the exits; the
  silent-run hold keeps its own rule and the alias rules keep their own refusals.
- **`program-started-outside-the-door`** - a file under src starts a program itself (subprocess, os.system,
  os.exec or spawn, pty.spawn, asyncio.create_subprocess) instead of `ProcessExecutor.execute(ExecutionRequest(...))`.
  A file that must is named in `OUTSIDE_STARTS` with its reason and in the `outside_starts` list.
- **`reading-nudge-outside-the-notices`** - a rule, a listener or a tick says a reading or cadence notice itself (a
  declaration of the `reading_declarations` list). `ReadingNotices` and `WarnCadenceHandler` are the only senders.
- **`main-only-rule-without-reason`** - a rule of the processes or aliases module is limited to the main agent with
  `roles = [AgentRole.MAIN]` and says no reason. Add `main_only_because` with one line, or let the rule answer every role.
- **`reader-chosen-outside-reader-layers`** - readers are put in order by id or by default flag outside `ReaderLayers`.
  Order them with `ReaderLayers.ordered`: project, plugin, stock; default first, then the newest.
- **`unreadable-mark-outside-unreadable-marks`** - an unreadable mark is made or removed outside `UnreadableMarks` and the
  mark and lift commands. Make and lift marks through `UnreadableMarks`, so the reason and the actor are recorded.
- **`run-shown-by-category-outside-run-visibility`** - code outside `RunVisibility` and `PartVisibility` decides by
  `is_watched` or `is_visible` which runs show a card, a mark or a dock item. Ask `visible_part`.
- **`nudge-carries-row-data`** - a nudge declaration of the processes or aliases module puts a command, a title, a line
  or a text of a stored row into the line an agent receives. A nudge names the row and its number; the agent reads the
  rest by command (rule 8). A count of lines (`{lines} lines`) is a number, not data.
- **`stock-reader-outside-the-stock-file`** - a `StockReader` is built away from `support/stock_reader.py`. Add a
  shipped reader to `STOCK_READERS` there, with a recorded sample in the stock sample store; nowhere else.
- **`output-measured-outside-output-facts`** - code outside `OutputFacts` and the cadence funnel measures an output
  through `OutputFolder`: its size, its silence or its text. Measure it in `OutputFacts` (what it is) or
  `RunCadence`/`RunSilences` (how it prints); everything else asks them.

- **`reader-saved-outside-add-reader`** - a reader definition is persisted outside `AddReaderHandler`.
  Save definitions through `AddReader` so writer checks and output proof always run. Unsaved readers used
  to judge draft patterns are ordinary values and do not bypass a save.
- **`reader-demand-from-whole-line`** - reader demand or drafting reads `runner_text` or `display_text`.
  Judge the command and sample of each part separately, including every part of a chain.
