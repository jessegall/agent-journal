package hostapi

import (
	"context"
	"testing"
)

// A start that fails after its network was made, here because its image is gone, leaves that network on the agent
// daemon; the journal's removal of a failed start's network takes it away, and asking again finds it gone already.
func TestAFailedStartLeavesNoNetworkOnceTheJournalRemovesIt(t *testing.T) {
	table, daemon, _ := containedTable(t, 0)
	delete(daemon.Images, mockImage)
	network := containedManifest().Network

	if _, err := carry(testInstructions{ProcessTable: table}, "open_container")(context.Background(), containedInstruction(t, func(*OpenPlan) {})); err == nil {
		t.Fatal("a start whose image is gone opened")
	}
	if _, found := daemon.Network(network); !found {
		t.Fatalf("the failed start made no network %s, so this scenario proves nothing", network)
	}

	for range 2 {
		if _, err := table.RemoveNetwork(context.Background(), Instruction{}, NetworkRemoval{Network: network}); err != nil {
			t.Fatalf("removing the failed start's network failed: %v", err)
		}
	}

	if _, found := daemon.Network(network); found {
		t.Fatalf("the network %s of the failed start is still on the daemon", network)
	}
}
