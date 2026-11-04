---
name: journal-shell
description: Run shell commands through the journal and read what they printed; read it before reading an output, or writing a reader or an alias
---

# Shell commands

Every shell command you run goes through the journal's runner.

## Outputs

- A command that runs past its time limit moves to the background and gives you its output number N.
- `output N ended: <result>` means it finished. `output N unread` means you have not read it yet.
- Read it with `journal output read N --summary`, which gives its reader's lines and how it ended.
- Other parts: `--tail 20`, `--lines 100-160`, `--reader <name>`, `--all`.
- `process N was lost` means its shell went away: read what it printed the same way.
- Read an output this way, never by running the command again.
- A main agent waits with a Monitor on `journal output monitor N`, rather than repeatedly asking for status.
  A worker needs no Monitor. The worker can continue other work and hear the result on its next tool call,
  or stop its session while the run continues. If the worker stops, the journal starts it when the run ends.
- Read an output by the flag that fits: `--summary` first, `--tail K` or `--lines A-B` for a part, `--all` only for a short output.
- Name a run for the user with `journal output title N "<what it does>"`: a whole phrase such as Running tests.

## Readers

Only a main agent, a person or a module saves, removes or chooses a reader. A worker asks the main agent;
`journal reader draft <request> --save` is also refused for a worker.

A reader selects useful output with `--lines <pattern>` or `--script <path>`. Every reader needs `--title`
and `--summary <pattern>` too. The other requirements depend on the command:

- A test run always needs a reader with `--count <pattern>`. It also needs either `--progress <pattern>`
  or `--step <pattern>`. A progress pattern captures a percent, or done and total as two numbers. A step
  pattern matches completed tests, whose count and the required total give the progress. For one result per
  line, use named `passed` and `failed` groups; for symbol rows, match the individual symbols.
- A build always needs a reader. It needs progress only when its output prints a percent or a done/total count.
- A check needs a reader after a run of that command moved to the background.
- Reading, searching, journal commands, help, version and listing commands need no reader. Each part of a
  command chain is judged separately.

`--count` captures the total in one number group. Without a group it counts matching lines. An optional
`--count-command <line>` lists tests before a queued worker run gets a spot, when `worker-run-most-tests` is
above zero. `{part}` is replaced with that part's command, not the whole chain; alias environment variables
are not included, so put any variables the listing needs in its command. Counts of test parts are added.
A failed listing, a listing cut off after 120 seconds, or one with no number leaves the count unknown and
the run goes on. A known count above `worker-run-most-tests` stops the run before it gets a spot.

When the main agent receives a reader request:

1. Run `journal reader draft <request>`. It tries saved readers, then stock readers, then patterns on the
   sample. Read what each field found and the complete `journal reader add` line it prints.
2. If the draft fits, run `journal reader draft <request> --save`. If a field could not be filled, edit
   that field in the printed `journal reader add` line and run it. A save always uses the normal writer
   check and output proof. `--save` refuses an incomplete draft.
3. If the command needs no reader, run `journal reader-request waive <request> --reason "<why>"`.

A saved proper reader completes matching requests and frees the worker and its waiting run. Adding a
reader whose commands do not match leaves the request open and says so. `journal reader list` shows the
saved readers. Adding under an existing name changes the fields given; `--commands` replaces the whole
command list, so keep the old patterns when adding a command.

Without a kept sample, one worker run becomes the sample while the worker waits. The worker may read
outputs and files or stop its own session during the wait. The worker cannot skip its block. The default wait is 25 minutes, set by
`reader-block-minutes`; after it the run starts without a reader. With no main agent running there is no
wait. `readers-forced` defaults to on; off removes reader requests and blocks. At session start the main
agent is told how many readers lack required fields. This notice never blocks the main agent. Full
judgement happens when a worker first needs each reader, so project readers are not changed on upgrade.

A pipe or redirect hides output from its reader. Run tests and builds without them and read output by its
number. An ended sample can be read with `journal output read <output> --reader <name>` after saving its
reader.

## Aliases

- `journal alias add <name> "<line>"` names a command line of the project; then `journal <name>` runs it.
- `journal alias list` names them.

## Running journal commands

- A journal command runs on its own, or chained only with other journal commands.
- Never cut a journal command with a pipe: use its flags.
