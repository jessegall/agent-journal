package main

import (
	"os"
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

func TestAJournalCommandInALineFinishesBeforeTheRunMoves(t *testing.T) {
	bin := t.TempDir()
	if err := os.WriteFile(bin+"/journal", []byte("#!/bin/sh\nsleep 1\necho answered\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	t.Setenv("PATH", bin+":"+os.Getenv("PATH"))
	setup := options(t, "echo first; journal task show 1; sleep 3")
	setup.Background = true
	output, _ := run(t, setup, newClient())
	if !strings.Contains(output, "answered") || !strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q", output)
	}
	waitFor(t, 10*time.Second, "the end of the moved run", func() bool { return exists(folderOf(setup) + "/end") })
}

func TestAnAliasIsNoJournalCommandToTheRunner(t *testing.T) {
	parts := []Part{{Text: "journal task show 1", Position: 1}, {Text: "journal tests --all", Position: 2}}
	if actual := LastJournal(parts, []string{"tests"}); actual != 1 {
		t.Fatalf("the last journal part is %d", actual)
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

func TestSlowFileCommandsStayInTheForeground(t *testing.T) {
	bin := t.TempDir()
	if err := os.WriteFile(bin+"/cat", []byte("#!/bin/sh\nsleep 2\nprintf 'found\n'\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	t.Setenv("PATH", bin+":"+os.Getenv("PATH"))
	setup := options(t, "cat file | cut -c1-; cat file")
	setup.LimitSeconds = 1
	setup.FileCommands = true
	output, code := run(t, setup, newClient())
	if code != 0 || strings.Count(output, "found") != 2 || strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestStuckFileCommandsAreStopped(t *testing.T) {
	setup := options(t, "sleep 5")
	setup.FileCommands = true
	setup.FileCommandLimit = 100 * time.Millisecond
	output, code := run(t, setup, newClient())
	if code != 124 || !strings.Contains(output, "time limit") || strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q with code %d", output, code)
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
