//go:build !windows

package main

import (
	"os"
	"path/filepath"
	"syscall"
	"testing"
	"time"
)

func TestAHookStartsNothingWhileAServerHoldsItsLock(t *testing.T) {
	root, ranFile := journalWithProgram(t)
	lock, err := os.OpenFile(filepath.Join(root, ".journal", "server.lock"), os.O_CREATE|os.O_RDWR, 0o600)
	if err != nil {
		t.Fatal(err)
	}
	defer lock.Close()
	if err := syscall.Flock(int(lock.Fd()), syscall.LOCK_EX|syscall.LOCK_NB); err != nil {
		t.Fatal(err)
	}
	startMissingServer(root)
	time.Sleep(200 * time.Millisecond)
	if _, err := os.Stat(ranFile); err == nil {
		t.Fatal("a server was started beside the one that holds the lock")
	}
}

func TestAHookStartsAServerWhenACrashedOneLeftItsSocketAndFreedItsLock(t *testing.T) {
	root, ranFile := journalWithProgram(t)
	if err := os.WriteFile(filepath.Join(root, ".journal", "server.sock"), nil, 0o644); err != nil {
		t.Fatal(err)
	}
	startMissingServer(root)
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		if _, err := os.Stat(ranFile); err == nil {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatal("no server was started although the lock was free")
}
