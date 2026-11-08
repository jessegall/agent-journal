package main

import (
	"os"
	"strings"
	"testing"
	"time"
)

func TestEveryCommandMovesAfterFifteenSeconds(t *testing.T) {
	for _, test := range []struct {
		name string
		line string
	}{
		{"read", "cat file"},
		{"write", "edit file"},
		{"unknown", "custom command"},
		{"journal", "journal task list"},
	} {
		t.Run(test.name, func(t *testing.T) {
			setup := options(t, test.line)
			setup.LimitSeconds = 15
			setup.ShellAlive = func() bool { return true }
			detached := false
			setup.Detach = func(Options) { detached = true }
			folder := NewFolder(setup.Home, setup.Process)
			if err := folder.Start(test.line, Parts(test.line), ""); err != nil {
				t.Fatal(err)
			}
			now := time.Unix(0, 0)
			tracker := Tracker{Options: setup, Client: newClient(), Folder: folder,
				Reported: map[int]bool{}, Positions: map[int]bool{1: true}, Now: func() time.Time { return now },
				Wait: func() { now = now.Add(time.Second) }}
			var output strings.Builder
			if code := tracker.Run(&output); code != 0 || !detached || now.Sub(time.Unix(0, 0)) != 15*time.Second || !strings.Contains(output.String(), "moved to the background: output 4") {
				t.Fatalf("code %d, detached %t, at %s: %s", code, detached, now, output.String())
			}
		})
	}
}

func TestACommandFinishingBeforeTheLimitStaysInTheForeground(t *testing.T) {
	setup := options(t, "read")
	setup.LimitSeconds = 15
	setup.ShellAlive = func() bool { return true }
	folder := NewFolder(setup.Home, setup.Process)
	if err := folder.Start(setup.Line, Parts(setup.Line), ""); err != nil {
		t.Fatal(err)
	}
	now := time.Unix(0, 0)
	tracker := Tracker{Options: setup, Client: newClient(), Folder: folder, Reported: map[int]bool{},
		Now: func() time.Time { return now }, Wait: func() { now = now.Add(time.Second); _ = folder.WriteEnd(0) }}
	var output strings.Builder
	if code := tracker.Run(&output); code != 0 || strings.Contains(output.String(), "background") {
		t.Fatalf("code %d: %s", code, output.String())
	}
}

func TestARunPastTheLimitMovesToTheBackgroundAndExitsWithTheShellStillRunning(t *testing.T) {
	setup := options(t, "echo first; sleep 3; echo later")
	setup.LimitSeconds = 1
	client := newClient()
	started := time.Now()
	output, code := run(t, setup, client)
	if code != 0 || time.Since(started) > 2500*time.Millisecond || !strings.Contains(output, "first") || strings.Contains(output, "later") {
		t.Fatalf("printed %q with code %d after %s", output, code, time.Since(started))
	}
	if !strings.Contains(output, "moved to the background: output 4") {
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

func TestARunMovesToTheBackgroundAsSoonAsTheJournalAsksForIt(t *testing.T) {
	setup := options(t, "sleep 3; echo late")
	setup.LimitSeconds = 60
	go func() {
		waitFor(t, 2*time.Second, "the run's folder", func() bool { return exists(folderOf(setup) + "/run.sh") })
		_ = os.WriteFile(folderOf(setup)+"/move", []byte("1"), 0o644)
	}()
	started := time.Now()
	output, code := run(t, setup, newClient())
	if code != 0 || time.Since(started) > 2500*time.Millisecond || !strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q with code %d after %s", output, code, time.Since(started))
	}
	waitFor(t, 10*time.Second, "the end of the moved run", func() bool { return exists(folderOf(setup) + "/end") })
}

func TestAnAtOnceRunMovesBeforeItsFirstOutput(t *testing.T) {
	setup := options(t, "sleep 2; echo late")
	setup.Background = true
	started := time.Now()
	output, code := run(t, setup, newClient())
	if code != 0 || time.Since(started) > time.Second || !strings.Contains(output, "moved to the background: output 4") {
		t.Fatalf("printed %q with code %d after %s", output, code, time.Since(started))
	}
	waitFor(t, 10*time.Second, "the end of the moved run", func() bool { return exists(folderOf(setup) + "/end") })
}

func TestALimitOf0NeverMoves(t *testing.T) {
	setup := options(t, "sleep 1; echo uncapped")
	setup.LimitSeconds = 0
	output, code := run(t, setup, newClient())
	if code != 0 || !strings.Contains(output, "uncapped") || strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestAFollowerEndsWhenItsFolderIsGone(t *testing.T) {
	setup := options(t, "sleep 5")
	tracker := Tracker{Options: setup, Client: newClient(), Folder: NewFolder(setup.Home, setup.Process), Parts: 1, Reported: map[int]bool{}}
	bounded(t, 5*time.Second, tracker.Watch)
}

func TestAFollowerKeepsWritingTheHeartbeatOfARunThatMoved(t *testing.T) {
	setup := options(t, "sleep 5")
	folder := NewFolder(setup.Home, setup.Process)
	if err := folder.Start(setup.Line, Parts(setup.Line), "true"); err != nil {
		t.Fatal(err)
	}
	if err := folder.WritePid(os.Getpid()); err != nil {
		t.Fatal(err)
	}
	tracker := Tracker{Options: setup, Client: newClient(), Folder: folder, Parts: 1, Reported: map[int]bool{}}
	go tracker.Watch()
	waitFor(t, 5*time.Second, "the heartbeat of the moved run", func() bool { return exists(folderOf(setup) + "/heartbeat") })
	if err := folder.WriteEnd(0); err != nil {
		t.Fatal(err)
	}
}

func TestASlowTestRunMovesToTheBackground(t *testing.T) {
	bin := t.TempDir()
	if err := os.WriteFile(bin+"/pytest", []byte("#!/bin/sh\nsleep 3\necho done\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	t.Setenv("PATH", bin+":"+os.Getenv("PATH"))
	setup := options(t, "cat /dev/null; pytest")
	setup.LimitSeconds = 1
	output, code := run(t, setup, newClient())
	if code != 0 || !strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q with code %d", output, code)
	}
	waitFor(t, 10*time.Second, "the end of the test run", func() bool { return exists(folderOf(setup) + "/end") })
}
