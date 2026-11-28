package hostapi

import (
	"context"
	"encoding/json"
	"slices"
	"testing"
	"time"

	"journal-runner/dockermock"
	"journal-runner/host"
)

// A container a crash left on the stand-in daemon survives the host's restart with no process the host holds: the
// inventory names it beside the one a live process owns, the journal's order removes it, and the owned one still runs.
// A container of another installation is never named.
func TestAContainerLeftByACrashIsNamedAtTheRestartAndRemovedWhileTheOwnedOneStays(t *testing.T) {
	daemon := dockermock.Start(t, mockImage)
	containers, err := host.ContainersOn(daemon.Host(), host.ContainerRules{Arrangement: host.Local, InstallationName: "journal"})
	if err != nil {
		t.Fatal(err)
	}
	state := t.TempDir()
	open := func() (*ProcessTable, *sentReports) {
		sent := &sentReports{}
		queue, err := OpenReportQueue(t.TempDir(), sent.send)
		if err != nil {
			t.Fatal(err)
		}
		runQueue(t, queue)
		outputs := NewOutputs(state, func(string, Output) error { return nil }, time.Now)
		return OpenProcessTable(state, containers, queue, outputs), sent
	}
	first, sent := open()
	if _, err := carry(testInstructions{ProcessTable: first}, "open_container")(context.Background(), openInstruction(t, "owned", "never", mockImage)); err != nil {
		t.Fatal(err)
	}
	sent.waitFor(t, "running")
	daemon.AddContainer("journal-process-crashed", map[string]string{"journal.installation": "journal"}, false)
	daemon.AddContainer("other-process", map[string]string{"journal.installation": "other"}, false)

	restarted, _ := open()
	t.Cleanup(func() { stopAndWait(daemon, restarted) })
	if err := restarted.Adopt(context.Background()); err != nil {
		t.Fatal(err)
	}
	journal := &fakeJournal{}
	relay, _ := relayFor(t, journal)
	relay.Table = restarted
	if err := relay.SendInventory(context.Background()); err != nil {
		t.Fatal(err)
	}

	named := slices.Sorted(slices.Values(journal.inventory[0].Containers))
	if !slices.Equal(named, []string{"journal-process-crashed", "journal-process-owned"}) {
		t.Fatalf("the inventory does not name every container of the installation: %v", named)
	}
	removal, err := json.Marshal(RemovePlan{Container: "journal-process-crashed", StopSeconds: 1})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := carry(testInstructions{ProcessTable: restarted}, "remove")(context.Background(), Instruction{ID: "remove-crashed", Type: "remove", Payload: string(removal)}); err != nil {
		t.Fatalf("removing the container the crash left failed: %v", err)
	}

	if _, held := daemon.Container("journal-process-crashed"); held {
		t.Fatal("the container the crash left is still on the daemon")
	}
	owned, held := daemon.Container("journal-process-owned")
	if !held || !owned.IsRunning() {
		t.Fatal("the container a live process owns did not stay running")
	}
	if _, held := daemon.Container("other-process"); !held {
		t.Fatal("a container of another installation was touched")
	}
}
