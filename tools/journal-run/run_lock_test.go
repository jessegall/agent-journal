package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestANewRunWaitsOnTheRunLockAndStartsWhenItIsGone(t *testing.T) {
	setup := options(t, "echo ran")
	mark := filepath.Join(setup.Home, RunLockMark)
	if err := os.MkdirAll(setup.Home, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(mark, nil, 0o644); err != nil {
		t.Fatal(err)
	}
	time.AfterFunc(1500*time.Millisecond, func() { os.Remove(mark) })
	started := time.Now()
	output, code := run(t, setup, newClient())
	if code != 0 || !strings.Contains(output, "ran") || time.Since(started) < time.Second {
		t.Fatalf("printed %q with code %d after %s", output, code, time.Since(started))
	}
}

func TestAJournalCommandDoesNotWaitOnTheRunLock(t *testing.T) {
	journalLine := Parts("journal message read 7; journal task list")
	if strings.Contains(LockWait("/home", 4, journalLine, nil, false), "while") {
		t.Errorf("a journal line waits: %q", LockWait("/home", 4, journalLine, nil, false))
	}
	if !strings.Contains(LockWait("/home", 4, Parts("journal task list; make build"), nil, false), "while") {
		t.Error("a line with another command in it does not wait")
	}
}

func TestALineThatOnlyReadsDoesNotWaitOnTheRunLock(t *testing.T) {
	if strings.Contains(LockWait("/home", 4, Parts("grep -n word notes | head"), nil, true), "while") {
		t.Error("a line that only reads waits")
	}
}

// awayClient refuses the first report of the end and is unreachable from then until the report is tried again.
type awayClient struct {
	*recordingClient
	unreachable bool
	refusals    int
}

func (client *awayClient) Run(arguments ...string) error {
	if arguments[1] == "end" && client.refusals > 0 {
		client.refusals--
		client.unreachable = true
		return os.ErrClosed
	}
	return client.recordingClient.Run(arguments...)
}

func (client *awayClient) Reachable() bool { return !client.unreachable }

func (client *awayClient) Restarting() bool { return false }

func TestAnEndIsToldAgainWhileTheServerIsAway(t *testing.T) {
	setup := options(t, "echo ran")
	client := &awayClient{recordingClient: newClient(), refusals: 1}
	if _, code := run(t, setup, client); code != 0 {
		t.Fatalf("exit code %d", code)
	}
	if !strings.Contains(strings.Join(client.reported(), "\n"), "process end 4") {
		t.Errorf("reported %q", client.reported())
	}
}

func TestAnAliasWaitsOnTheRunLockAsTheCommandUnderItDoes(t *testing.T) {
	if !strings.Contains(LockWait("/home", 4, Parts("journal go-tests ."), []string{"go-tests"}, false), "while") {
		t.Error("an alias does not wait on the run lock")
	}
}

func TestAQueuedRunWaitsForItsSpotAndAnyOtherDoesNot(t *testing.T) {
	if !strings.Contains(SlotWait("/home", 4, true), "/home/processes/4/slot") {
		t.Error("a queued run does not wait for its spot")
	}
	if SlotWait("/home", 4, false) != "" {
		t.Error("a run that is not queued waits")
	}
}
