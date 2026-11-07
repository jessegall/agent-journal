package main

import (
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
