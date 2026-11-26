# Approving a new test or check

A test, check or build is only run once its rule carries a contract and a proven reader approved by the project's
owner. A line that lacks one is held as a command request, and the workflow below fills what it owes. Every step is
a bus command in `app/Processes/Commands`, run through the console commands named here.

## Request states

A `CommandRequest` moves through `RequestState`:

| State | Waits on |
|---|---|
| `collecting_declaration` | A proposed rule with its contract |
| `awaiting_sample_approval` | The owner approving a sample run of the exact command |
| `ready_for_sample` | The sample run starting from its evidence permit |
| `capturing_sample` | The sample run ending and its output being read |
| `awaiting_proof` | A reader proven on the samples |
| `awaiting_approval` | The owner approving the rule with its reader |
| `active` | Nothing: the line is admitted again |
| `rejected`, `withdrawn` | Nothing: the request is closed |

Why it was held is its `RequestHoldReason`: `unknown_command`, `reader_required`, `reader_stale` (the approved reader
no longer matches) or `binding_changed` (the executable or its configuration changed).

## The steps

```text
command-type:explain --line 'vendor/bin/phpstan analyse --error-format=json --no-progress'
    # Tests and checks; reader-required; nothing started; request 42
command-type:propose 42            # the rule with its contract: output contract, exit map, binding
# the owner approves one sample run of the exact command on the Processes page, which issues a permit
reader:sample-run 42               # runs the sample in evidence mode from that permit
output:read <run> --summary        # the author reads the sample's whole output: an evidence read
reader:propose 42                  # the reader definition
reader:prove 42                    # the reader is replayed over every sample; each exit branch needs one
# the owner approves the rule with its proven reader on the Processes page
```

Then the agent runs the bare approved line again through normal admission.

- **Evidence permits.** A sample runs only from an `EvidencePermit`: one use, for one exact command and binding,
  for one actor, until it expires. `IssueEvidencePermit` and `ApproveSample` make one; `StartSample` spends it.
- **Evidence reads.** Before a reader is proposed, the request's author must have read each sample's envelope and
  every stream it wrote (`RecordEvidenceReads`); a reader written without looking at the output is refused.
- **Proof.** `ProveReader` replays the reader over the real sample runs and records a `ReaderProof` only when every
  run reads cleanly and every exit status the contract names has a sample; otherwise it refuses and names what is
  missing.
- **Approval.** `ApproveRuleProposal` takes an `OwnerApproval`: the expected proposal and active revisions and a
  `ReaderApproval` per contract (reader revision and proof). It writes the `RuleRevision` and activates the request.

## Who may do what

The author of a request (an agent or a user) proposes, revises, runs approved samples, reads evidence and proves.
Only an actor with the owner's authority approves samples and rules. Nothing a program prints can stand in for
either: output text never authorizes anything.
