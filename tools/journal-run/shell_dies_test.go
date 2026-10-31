package main

import (
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

func TestARunInTheForegroundEndsItsOwnProcessWhenItsShellDies(t *testing.T) {
	setup := options(t, "sleep 30")
	var dead atomic.Bool
	setup.ShellAlive = func() bool { return !dead.Load() }
	client := newClient()
	started := time.Now()
	go func() {
		time.Sleep(300 * time.Millisecond)
		dead.Store(true)
	}()
	_, code := run(t, setup, client)
	if code == 0 || time.Since(started) > 5*time.Second || !strings.Contains(strings.Join(client.reported(), "\n"), "process orphan 4") {
		t.Fatalf("code %d after %s, reported %q", code, time.Since(started), client.reported())
	}
}

func TestARunWhoseShellLivesIsNotLost(t *testing.T) {
	setup := options(t, "echo fine")
	setup.ShellAlive = func() bool { return true }
	client := newClient()
	if _, code := run(t, setup, client); code != 0 || strings.Contains(strings.Join(client.reported(), "\n"), "orphan") {
		t.Fatalf("code %d, reported %q", code, client.reported())
	}
}
