# Results

A finished part is described by four separate observations, and none of them is guessed from another:

1. **How the process ended** (`PartEnd`): `exited` with its own status, `signalled`, or `unavailable` when the
   status could not be read. A part the runner did not start and watch itself has no status to report.
2. **Whether its output was captured whole** (`CaptureState`): `recording`, `complete`, `incomplete`, `corrupt` or
   `removed`.
3. **What the reader read** (`ReaderAssessment`): the records it found, the outcome the output claims
   (`ClaimedOutcome`: `passed`, `failed`, `unknown`) and the problems it met.
4. **What the contract makes of it** (`OutputAssessment`): the exit map turns the status into `Outcome` (`passed`,
   `findings`, `execution_error`), and the assessment's `AssessmentOutcome` is `passed`, `findings`, `allowed_empty`
   or `unavailable`.

## Problem codes

A problem makes the result unavailable and says why (`ProblemCode`):

| Code | Means |
|---|---|
| `output_unrecognized` | The output had bytes but no record the reader knows |
| `output_missing`, `output_incomplete` | Output the contract requires is absent or cut short |
| `output_ambiguous` | Two records claim different results |
| `output_encoding` | The bytes are not in the contract's encoding |
| `summary_missing`, `summary_conflict` | The required summary is absent, or disagrees with the records |
| `counts_invalid` | The counts do not add up |
| `progress_total_stale` | The progress total no longer matches the selection |
| `reader_failed`, `reader_stale`, `record_limit` | The reader broke, is not the approved revision, or read too much |
| `execution_error` | The exit status is one the contract calls an execution error |
| `exit_unavailable` | The process has no exit status of its own |
| `outcome_conflict` | The output claims one result and the exit status another |
| `not_normal_run` | The run was a sample or a replay, never a normal admitted run |

## Receipts

Only an assessment with no problems, from a normal admitted run of the approved rule, reader and binding, is
published: `ResultPublisher` writes a `ResultReceipt` and returns a `PublishedResult` (receipt, run, operation,
outcome, time). A part's result is `receipted`, `evidence_only` (captured but never a result, such as a sample) or
`unavailable` (`PartResultType`).

## Replay

`ReplayAssessment` reads a stored run again with the reader approved now, and links the new assessment to the one
it replaces. The stored bytes never change.

## What consumers accept

A task, a plan phase or a worker's proof accepts a test or check only by its receipt. A run's printed text, a
summary line pasted into a message, or an exit status alone is never a result.
