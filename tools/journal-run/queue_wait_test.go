package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestQueuedRunReturnsItsOutputNumberWhenTheSlotWaitExpires(t *testing.T) {
	options := options(t, "echo admitted")
	options.Queue = true
	options.QueueWait = 40 * time.Millisecond
	started := time.Now()
	output, code := run(t, options, newClient())
	if code != 0 || time.Since(started) > time.Second || !strings.Contains(output, "queued as output 4") {
		t.Fatalf("queue response %d: %q", code, output)
	}
	folder := NewFolder(options.Home, options.Process)
	if folder.Started(1) {
		t.Fatal("the command started without admission")
	}
	if err := os.WriteFile(filepath.Join(folder.Path, "slot"), nil, 0o644); err != nil {
		t.Fatal(err)
	}
	waitFor(t, 3*time.Second, "the admitted run to end", func() bool { _, ended := folder.End(); return ended })
}

func TestQueuedRunAdmittedInTimeStaysInTheForeground(t *testing.T) {
	options := options(t, "echo admitted")
	options.Queue = true
	options.QueueWait = 2 * time.Second
	go func() {
		folder := NewFolder(options.Home, options.Process)
		for !folder.Exists() {
			time.Sleep(time.Millisecond)
		}
		_ = os.WriteFile(filepath.Join(folder.Path, "slot"), nil, 0o644)
	}()
	output, code := run(t, options, newClient())
	if code != 0 || !strings.Contains(output, "admitted") || strings.Contains(output, "background") || strings.Contains(output, "queued as output") {
		t.Fatalf("foreground response %d: %q", code, output)
	}
}

func TestQueueWaitDefaultsToFiveSecondsAndReadsTheSetting(t *testing.T) {
	t.Setenv(queueWaitVariable, "")
	if queueWait() != 5*time.Second {
		t.Fatal("the default queue wait is not five seconds")
	}
	t.Setenv(queueWaitVariable, "2")
	if queueWait() != 2*time.Second {
		t.Fatal("the queue wait setting was not read")
	}
}

func TestCountedQueueCountsTheTimeInTheQueueInTheForegroundLimit(t *testing.T) {
	options := options(t, "sleep 5")
	options.Queue = true
	options.QueueWait = 2 * time.Second
	options.LimitSeconds = 2
	options.CountedQueue = true
	go func() {
		time.Sleep(1500 * time.Millisecond)
		_ = os.WriteFile(filepath.Join(NewFolder(options.Home, options.Process).Path, "slot"), nil, 0o644)
	}()
	started := time.Now()
	output, code := run(t, options, newClient())
	if code != 0 || time.Since(started) > 3*time.Second || !strings.Contains(output, "moved to the background: output 4; you will be told when it ends") {
		t.Fatalf("counted queue response %d after %s: %q", code, time.Since(started), output)
	}
}

func TestCountedQueueIsReadFromItsVariable(t *testing.T) {
	t.Setenv(countedQueueVariable, "1")
	if !countedQueue() {
		t.Fatal("the counted queue variable was not read")
	}
	if countedQueue() {
		t.Fatal("the counted queue variable stayed set for runs inside this one")
	}
}
