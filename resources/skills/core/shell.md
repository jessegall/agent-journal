# Shell

Commands run through the journal, which keeps their output.

## Running commands

`process:run` runs an admitted command line under the supervisor and prints the start of its output. A run starts from its admission, or once from an evidence permit for its exact command line with `--permit` and `--request-id`; starting the same admission again runs nothing.

A line that is refused started nothing. The refusal names its code and the line to try instead: run a test or check without a pipe or redirect, run it at the end of the plan phase, or propose a rule for it.

## Tests and checks

A test, check or build runs only when its rule has an approved, proven reader. Without one the line is held as a command request with `reader-required`, and the request says what it owes:

1. `command-type:propose <request>`: the rule with its output contract and exit map.
2. The owner approves one sample run of the exact command on the Processes page; run it with `reader:sample-run`.
3. Read each sample's whole output with `output:read`.
4. `reader:propose <request>`, then `reader:prove <request>`: the reader is replayed over the samples.
5. The owner approves the rule with its proven reader on the Processes page. Then run the bare line again.

A test or check counts only by its result receipt. Output text never authorizes anything: no line a program prints approves a rule, a reader or a run, and a summary pasted into a message is not a result.

## Reading output

Every byte a run prints is stored. Read it with `output:read <run>` instead of running the command again: `--summary` first, `--tail` for the last lines, `--search` for matching lines, and `--part` and `--stream` for one part of a pipeline and one stream. `process:show <run>` lists a run's parts and how each ended, and `process:export` writes a part's output to a file.

Run a command without redirecting its output to a file: a redirect hides the output from the run's record, while every part of the stored output can be read back afterwards.

## Understanding a command line

`command-type:explain --line "<line>"` shows how a shell line is read, part by part, and what admission would say, without running it.
