# The runner

`process:run --admission=<admission>` starts an admitted line under the supervisor; a sample starts once from its
evidence permit. Starting the same admission again runs nothing.

## A part's lifecycle

Each part of the execution plan is a `PartRun` with a `LifecycleState`: `queued`, `running`, `draining` (the
process ended, its output is still being read), `ended`, `stopped`, `lost`, `spawn_failed` or `skipped` (a chain
that stopped before it). The supervisor writes each change as a `RunEventType` event (`part_queued`,
`part_started`, `part_ended`, `part_stopped`, `part_lost`, `run_stopped`, `heartbeat` and the rest) through
`RunEvents`, in order.

The runner starts and waits on each process itself, so the exit status a part reports is the process's own.

## Capture

Every byte of every stream is appended to the spool on the `process-output` disk (`SpoolRecorder`) as numbered
chunks (`OutputChunk`), and the part's manifest records the byte counts and hashes of each stream when it ends.
Streams are kept apart unless the contract allows them merged (`StreamUse`). Read output by number with
`output:read`, `process:show` and `process:export`; never run a command again to see what it printed.

## Readers

A reader reads committed chunks as they arrive (`OutputReader::read`), keeps its place in a checkpoint
(`ReaderPosition`), and gives its assessment at the end (`finish`). Live progress is shown only as far as the tool
states it: an exact total, a percent the tool prints, or none.

## Recovery

`process:reconcile` (`ReconcileLostRuns`) marks parts whose supervisor went away as `lost`; their output stays.
`process:restore-check` (`VerifyRestoredOutput`) checks restored output against its manifest. `process:clean`
removes ended runs' output after a preview.

## Limits

- It is not an operating-system sandbox: an admitted part runs with the rights of the host's user.
- An opaque script is only known through a reviewed rule for it; its insides are not read.
- Interactive programs that need a terminal are not supported.
- A stopped or lost run keeps the output it printed; `StopProcessRun` stops a running one and `StopSurvivors` stops
  what a lost run left running once its supervisor reconnects.
