//go:build !windows

package main

import (
	"os"
	"syscall"
)

// serverLockIsFree takes the server lock without waiting and lets it go at once: a free lock means no server is
// running, starting or stopping, as the journal program's own check.
func serverLockIsFree(path string) bool {
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
