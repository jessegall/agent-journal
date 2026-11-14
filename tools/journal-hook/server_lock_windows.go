//go:build windows

package main

// serverLockIsFree is never true on Windows, where no server is started.
func serverLockIsFree(path string) bool {
	return false
}
