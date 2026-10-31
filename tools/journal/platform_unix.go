//go:build !windows

package main

import (
	"os"
	"syscall"
)

// ServerSupported says whether this platform runs the journal's server; it needs Unix sockets and flock.
const ServerSupported = true

// LockIsFree takes the server lock without waiting and lets it go at once: a free lock means no server is
// running, starting or stopping. The client never holds it while a server starts, so the server can take it.
func LockIsFree(path string) bool {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0o600)
	if err != nil {
		return false
	}
	defer file.Close()
	if syscall.Flock(int(file.Fd()), syscall.LOCK_EX|syscall.LOCK_NB) != nil {
		return false
	}
	return syscall.Flock(int(file.Fd()), syscall.LOCK_UN) == nil
}

// DetachedProcess starts the server in a session of its own, so it outlives the client.
func DetachedProcess() *syscall.SysProcAttr {
	return &syscall.SysProcAttr{Setsid: true}
}
