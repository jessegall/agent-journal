package main

import (
	"os"
	"slices"
	"testing"
	"time"
)

func TestARunsEndIsToldAgainWhileAReachableServerRestarts(t *testing.T) {
	client := newClient()
	client.restarting, client.failing = true, true
	go func() {
		time.Sleep(50 * time.Millisecond)
		client.mutex.Lock()
		defer client.mutex.Unlock()
		client.restarting, client.failing = false, false
	}()
	tracker := Tracker{Client: client}
	tracker.report("process", "end", "7")
	client.mutex.Lock()
	defer client.mutex.Unlock()
	if !slices.ContainsFunc(client.lines, func(line string) bool { return line == "process end 7" }) {
		t.Fatalf("lines %v", client.lines)
	}
}

// slowRestartClient takes twenty seconds of the tracker's time to fail its first try while the server restarts, and answers the next.
type slowRestartClient struct {
	*recordingClient
	current *time.Time
	tries   int
}

func (client *slowRestartClient) Run(arguments ...string) error {
	client.tries++
	if client.tries == 1 {
		*client.current = client.current.Add(20 * time.Second)
		return os.ErrDeadlineExceeded
	}
	return client.recordingClient.Run(arguments...)
}

func (client *slowRestartClient) Restarting() bool { return client.tries < 2 }

func TestTheTimeSpentTellingAnEndWhileTheServerRestartsDoesNotMoveAQuickRunToTheBackground(t *testing.T) {
	current := time.Unix(0, 0)
	client := &slowRestartClient{recordingClient: newClient(), current: &current}
	tracker := Tracker{Client: client, Options: Options{LimitSeconds: 15}, Clock: func() time.Time { return current }}
	started := current
	tracker.report("process", "end", "7")
	if current.Sub(started) < 20*time.Second {
		t.Fatalf("the restart took %s", current.Sub(started))
	}
	if tracker.mayMove(started) {
		t.Fatalf("a run that ran for no time moved after %s of restart", current.Sub(started))
	}
}
