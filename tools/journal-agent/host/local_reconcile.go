package host

import (
	"context"
	"os"
	"strconv"
	"strings"
	"syscall"
)

// Outcomes of reconciling one local runtime after the relay restarted or the machine woke.
const (
	LocalResumed   = "resumed"
	LocalEnded     = "ended"
	LocalAmbiguous = "ambiguous"
)

// LocalRuntimeReceipt is what the relay recorded of a local runtime when it started: its claim, the process and
// the time that process started, the server's generation and its worktree claim.
type LocalRuntimeReceipt struct {
	ClaimID          string        `json:"claim"`
	RuntimeID        string        `json:"runtime"`
	PID              int           `json:"pid"`
	ProcessStartedAt string        `json:"process_started_at"`
	Generation       int           `json:"generation"`
	Worktree         WorktreeClaim `json:"worktree"`
}

// LocalReconciliation is how one receipt was settled, and why.
type LocalReconciliation struct {
	RuntimeID string `json:"runtime"`
	Outcome   string `json:"outcome"`
	Reason    string `json:"reason,omitempty"`
}

// ReconcileLocal settles each receipt against the process and Git as they are now: a live process with the same
// start time and a registered worktree at its base resumes; a gone process is ended; a PID reused by another
// process, a worktree Git does not confirm or a generation the server moved past is ambiguous and kept. Receipts of
// one claim resolve to one runtime: the first.
func ReconcileLocal(
	ctx context.Context,
	worktrees NativeWorktrees,
	receipts []LocalRuntimeReceipt,
	serverGeneration func(runtimeID string) int,
	startedAt func(pid int) (string, bool),
) []LocalReconciliation {
	seen := map[string]bool{}
	settled := []LocalReconciliation{}
	for _, receipt := range receipts {
		if seen[receipt.ClaimID] {
			continue
		}
		seen[receipt.ClaimID] = true
		settled = append(settled, reconcileOne(ctx, worktrees, receipt, serverGeneration, startedAt))
	}

	return settled
}

func reconcileOne(
	ctx context.Context,
	worktrees NativeWorktrees,
	receipt LocalRuntimeReceipt,
	serverGeneration func(runtimeID string) int,
	startedAt func(pid int) (string, bool),
) LocalReconciliation {
	result := LocalReconciliation{RuntimeID: receipt.RuntimeID}
	started, alive := startedAt(receipt.PID)
	if !alive {
		result.Outcome = LocalEnded
		result.Reason = "its process is gone"
		return result
	}
	if started != receipt.ProcessStartedAt {
		result.Outcome = LocalAmbiguous
		result.Reason = "its process id now belongs to another process"
		return result
	}
	if serverGeneration(receipt.RuntimeID) != receipt.Generation {
		result.Outcome = LocalAmbiguous
		result.Reason = "the journal moved to another generation"
		return result
	}
	if err := worktrees.confirm(ctx, worktrees.receiptFor(receipt.Worktree)); err != nil {
		result.Outcome = LocalAmbiguous
		result.Reason = err.Error()
		return result
	}
	result.Outcome = LocalResumed

	return result
}

// ProcessStartedAt is a process's start time as the system reports it, and whether the process lives.
func ProcessStartedAt(pid int) (string, bool) {
	if pid <= 0 || syscall.Kill(pid, 0) != nil {
		return "", false
	}
	output, err := os.ReadFile("/proc/" + strconv.Itoa(pid) + "/stat")
	if err == nil {
		fields := strings.Fields(string(output))
		if len(fields) > 21 {
			return fields[21], true
		}
	}
	started, err := psStartTime(pid)

	return started, err == nil
}

// RetainedQueue keeps at most Most entries of a backlog awaiting acknowledgement, each with its sequence; the
// oldest go first, and the queue says it was truncated so a reader never takes it for complete.
type RetainedQueue struct {
	Most      int
	Entries   []RetainedEntry
	Truncated bool
	next      int
}

// RetainedEntry is one retained report, delivery or output frame, by its sequence.
type RetainedEntry struct {
	Sequence int    `json:"sequence"`
	Payload  []byte `json:"payload"`
}

// Add keeps the payload under the next sequence, cut to the cap.
func (queue *RetainedQueue) Add(payload []byte) {
	queue.next++
	queue.Entries = append(queue.Entries, RetainedEntry{Sequence: queue.next, Payload: payload})
	if len(queue.Entries) > queue.Most {
		queue.Entries = queue.Entries[len(queue.Entries)-queue.Most:]
		queue.Truncated = true
	}
}

// Acknowledge drops every entry up to and including the sequence the journal acknowledged.
func (queue *RetainedQueue) Acknowledge(sequence int) {
	kept := queue.Entries[:0]
	for _, entry := range queue.Entries {
		if entry.Sequence > sequence {
			kept = append(kept, entry)
		}
	}
	queue.Entries = kept
}
