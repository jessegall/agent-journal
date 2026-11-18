# Shell

## Running commands

`process:run` runs an admitted command line under the supervisor and prints the start of its output. A run starts from its admission, or once from an evidence permit for its exact command line with `--permit` and `--request-id`; starting the same admission again runs nothing.

## Reading output

Every byte a run prints is stored. Read it with `output:read <run>` instead of running the command again: `--summary` first, `--tail` for the last lines, `--search` for matching lines, and `--part` and `--stream` for one part of a pipeline and one stream. `process:show <run>` lists a run's parts and how each ended, and `process:export` writes a part's output to a file.

## Understanding a command line

`command-type:explain --line "<line>"` shows how a shell line is read, part by part, without running it.
