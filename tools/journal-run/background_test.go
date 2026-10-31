package main

import (
	"strings"
	"testing"
	"time"
)

func TestARunPastTheLimitMovesToTheBackgroundAndExitsWithTheShellStillRunning(t *testing.T) {
	setup := options(t, "echo first; sleep 3; echo later")
	setup.LimitSeconds = 1
	client := newClient()
	started := time.Now()
	output, code := run(t, setup, client)
	if code != 0 || time.Since(started) > 2500*time.Millisecond || !strings.Contains(output, "first") || strings.Contains(output, "later") {
		t.Fatalf("printed %q with code %d after %s", output, code, time.Since(started))
	}
	if !strings.Contains(output, "moved to the background: journal output read 4 --summary when it ends") {
		t.Errorf("printed %q", output)
	}
	if exists(folderOf(setup) + "/end") {
		t.Error("the run ended with its shell still running")
	}
	waitFor(t, 10*time.Second, "the end of the moved run", func() bool { return exists(folderOf(setup) + "/end") })
	waitFor(t, 5*time.Second, "the report of the end", func() bool {
		return strings.Contains(strings.Join(client.reported(), "\n"), "process end 4 --exit-code 0")
	})
	if !strings.Contains(strings.Join(client.reported(), "\n"), "process background 4") {
		t.Errorf("reported %q", client.reported())
	}
}

func TestAnAtOnceRunMovesBeforeItsFirstOutput(t *testing.T) {
	setup := options(t, "sleep 2; echo late")
	setup.Background = true
	started := time.Now()
	output, code := run(t, setup, newClient())
	if code != 0 || time.Since(started) > time.Second || !strings.Contains(output, "moved to the background: journal output read 4 --summary when it ends") {
		t.Fatalf("printed %q with code %d after %s", output, code, time.Since(started))
	}
	waitFor(t, 10*time.Second, "the end of the moved run", func() bool { return exists(folderOf(setup) + "/end") })
}

func TestALimitOf0NeverMoves(t *testing.T) {
	setup := options(t, "sleep 1; echo whole")
	setup.LimitSeconds = 0
	output, code := run(t, setup, newClient())
	if code != 0 || !strings.Contains(output, "whole") || strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}
