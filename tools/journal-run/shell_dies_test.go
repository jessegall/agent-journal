package main

import (
	"os/exec"
	"strconv"
	"strings"
	"sync/atomic"
	"syscall"
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

func TestARunThatIgnoresTheStopWhenItsShellDiesIsKilled(t *testing.T) {
	setup := options(t, "trap '' TERM; sleep 30")
	var dead atomic.Bool
	setup.ShellAlive = func() bool { return !dead.Load() }
	client := newClient()
	go func() {
		time.Sleep(300 * time.Millisecond)
		dead.Store(true)
	}()
	_, code := run(t, setup, client)
	pid, recorded := NewFolder(setup.Home, setup.Process).Pid()
	if code == 0 || !recorded {
		t.Fatalf("code %d, pid recorded %t", code, recorded)
	}
	for waited := 0; waited < 100 && processRuns(pid); waited++ {
		time.Sleep(50 * time.Millisecond)
	}
	if processRuns(pid) {
		_ = syscall.Kill(-pid, syscall.SIGKILL)
		t.Fatal("the run that ignores SIGTERM was left running")
	}
}

// processRuns says whether a process still runs; one that ended and waits to be collected does not count.
func processRuns(pid int) bool {
	states, _ := exec.Command("ps", "-o", "stat=", "-p", strconv.Itoa(pid)).Output()
	for _, state := range strings.Fields(string(states)) {
		if !strings.HasPrefix(state, "Z") {
			return true
		}
	}
	return false
}
