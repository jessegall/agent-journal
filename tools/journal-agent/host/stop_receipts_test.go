package host

import (
	"context"
	"errors"
	"slices"
	"testing"
)

// stopJournal takes stop receipts while it is reachable and counts each one it took.
type stopJournal struct {
	reachable bool
	taken     []string
}

func (journal *stopJournal) NotifyRuntimeStopped(_ context.Context, _ string, runtimeID string) error {
	if !journal.reachable {
		return errors.New("the journal is out of reach")
	}
	journal.taken = append(journal.taken, runtimeID)

	return nil
}

func TestAStopReceiptIsKeptWhileTheJournalIsAwayAndSentOnceItIsBack(t *testing.T) {
	state := ConnectionState{Folder: t.TempDir(), CanonicalRoot: "/Users/owner/shop"}
	journal := &stopJournal{}
	if err := state.QueueStopReceipt("runtime-1"); err != nil {
		t.Fatal(err)
	}
	if err := state.QueueStopReceipt("runtime-1"); err != nil {
		t.Fatal(err)
	}

	if err := state.SendStopReceipts(context.Background(), "binding-1", journal); err == nil {
		t.Fatal("a receipt the journal never took was counted as sent")
	}
	if pending, _ := state.PendingStopReceipts(); !slices.Equal(pending, []string{"runtime-1"}) {
		t.Fatalf("the receipt was not kept once: %v", pending)
	}

	journal.reachable = true
	if err := state.SendStopReceipts(context.Background(), "binding-1", journal); err != nil {
		t.Fatal(err)
	}
	if err := state.SendStopReceipts(context.Background(), "binding-1", journal); err != nil {
		t.Fatal(err)
	}

	if !slices.Equal(journal.taken, []string{"runtime-1"}) {
		t.Fatalf("the journal took %v, want the stop once", journal.taken)
	}
}
