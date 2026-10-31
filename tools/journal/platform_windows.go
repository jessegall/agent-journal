//go:build windows

package main

import "syscall"

// ServerSupported says whether this platform runs the journal's server; on Windows every line runs directly.
const ServerSupported = false

// LockIsFree is never true on Windows, where no server is started.
func LockIsFree(path string) bool {
	return false
}

// DetachedProcess has nothing to set on Windows, where no server is started.
func DetachedProcess() *syscall.SysProcAttr {
	return nil
}

// ProcessAlive is never true on Windows, where no server is started.
func ProcessAlive(pid int) bool {
	return false
}
