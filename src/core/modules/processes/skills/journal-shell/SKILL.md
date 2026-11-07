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
- A test or build runs through a saved command, registered once with `journal alias add <name> "<bare command>"
  --category "test run"` or `--category build`. Run it as `journal <name> --tail 20`, `--head 20` or `--cut 100-160`
  with no pipe: its complete output is kept and read by number. Your own arguments stay, and after a bare `--` they
  are all the command's. While no command of that type is saved, a line runs as written once with `journal alias skip --reason "<why>" && <line>`.
- `process N was lost` means its shell went away: read what it printed the same way.
- Read an output this way, never by running the command again.
- While you keep working you hear of a run's end on your next tool call, so a run needs no Monitor. Only when you
  stop with a run of yours still going does your suite ask for `journal output monitor N`, which wakes you when it ends.
- Read an output by the flag that fits: `--summary` first, `--tail K` or `--lines A-B` for a part, `--all` only for a short output.
- Name a run for the user with `journal output title N "<what it does>"`: a whole phrase such as Running tests.

## Readers

A main agent, a person or a module manages readers. An agent with its own open reader request may draft and
save a reader matching that request, through the same checks and output proof. It cannot remove readers,
choose defaults or skip a request.

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
Your suite can use `--count-command <line>` to count tests before a queued run gets a spot. `{part}` is
replaced with that part's command, not the whole chain; alias environment variables are not included, so
put any variables the listing needs in its command.

When an agent receives a reader request:

1. Run `journal reader draft <request>`. It tries saved readers, then stock readers, then patterns on the
   sample. Read what each field found and the complete `journal reader add` line it prints.
2. If the draft fits, run `journal reader draft <request> --save`. If a field could not be filled, edit
   that field in the printed `journal reader add` line and run it. A save always uses the normal writer
   check and output proof. `--save` refuses an incomplete draft.
3. If the command needs no reader, run `journal reader-request waive <request> --reason "<why>"`.
   Only the main agent, a person or a module may skip a request.

A worker tries its own saves first. After `reader-save-tries` failed saves for that request (default 3),
further worker saves stop and the main agent is asked to help. Drafting without `--save` does not use a try.
The main agent can save the reader after the worker's tries run out. Set the limit to zero to ask the main
agent immediately.

A saved proper reader completes matching requests and frees the waiting agent and its run. Adding a
reader whose commands do not match leaves the request open and says so. `journal reader list` shows the
saved readers. Adding under an existing name changes the fields given; `--commands` replaces the whole
command list, so keep the old patterns when adding a command.

Without a kept sample, one waiting run becomes the sample. The agent may read outputs and files or stop
its own session during the wait. It cannot skip its block. The default wait is 25 minutes, set by
`reader-block-minutes`; after it the run starts without a reader. With no main agent running there is no
wait. `readers-forced` defaults to on; off removes reader requests and blocks. At session start the main
agent is told how many readers lack required fields. This notice never blocks the main agent. Full
judgement happens when an agent first needs each reader, so project readers are not changed on upgrade.

A reader of a test or build always reads its complete output: a pipe such as `| tail -5` runs over the stored
output and only shapes what you get back. A redirect to a file still hides the output, so run tests and builds
without one. An ended sample can be read with `journal output read <output> --reader <name>` after saving its
reader.

## Commands of unknown kind

A command whose program the journal does not know is refused until you say what kind it is, by its leading words:
`journal command-kind make "scripts/dev go test" "test run"`. Every later command starting with those words
is of that kind, and that kind's rules hold at once, the same command included: a test run or build then goes through a
saved alias with its reader and takes no pipe. Name the words that make it that kind, the program and its first
arguments, not a whole line. `journal command-kind list` shows them.

## Aliases

- `journal alias add <name> "<line>"` names a command line of the project; then `journal <name>` runs it.
- `journal alias list` names them.

## Running journal commands

- A journal command runs on its own, or chained only with other journal commands.
- Never cut a journal command with a pipe: use its flags.
