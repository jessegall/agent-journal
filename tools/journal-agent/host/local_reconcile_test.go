package host

import (
	"context"
	"testing"
)

func TestARestartedRelaySettlesEachLocalRuntimeOnce(t *testing.T) {
	worktrees := NativeWorktrees{Root: t.TempDir(), Git: "git"}
	receipts := []LocalRuntimeReceipt{
		{ClaimID: "gone", RuntimeID: "runtime-gone", PID: 1001, ProcessStartedAt: "t1", Generation: 1},
		{ClaimID: "reused", RuntimeID: "runtime-reused", PID: 1002, ProcessStartedAt: "t1", Generation: 1},
		{ClaimID: "reused", RuntimeID: "runtime-duplicate", PID: 1002, ProcessStartedAt: "t1", Generation: 1},
	}
	startedAt := func(pid int) (string, bool) {
		if pid == 1001 {
			return "", false
		}
		return "t2", true
	}

	settled := ReconcileLocal(context.Background(), worktrees, receipts, func(string) int { return 1 }, startedAt)

	if len(settled) != 2 || settled[0].Outcome != LocalEnded || settled[1].Outcome != LocalAmbiguous {
		t.Fatalf("settled %+v", settled)
	}
}

func TestABacklogBeyondTheCapCarriesTheTruncationMark(t *testing.T) {
	queue := RetainedQueue{Most: 2}
	for _, payload := range []string{"one", "two", "three"} {
		queue.Add([]byte(payload))
	}

	if !queue.Truncated || len(queue.Entries) != 2 || queue.Entries[0].Sequence != 2 {
		t.Fatalf("the queue holds %+v, truncated %v", queue.Entries, queue.Truncated)
	}
	queue.Acknowledge(2)
	if len(queue.Entries) != 1 || queue.Entries[0].Sequence != 3 {
		t.Fatalf("after acknowledgement the queue holds %+v", queue.Entries)
	}
}
