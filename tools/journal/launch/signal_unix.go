//go:build darwin || linux

package launch

import "syscall"

// signalGroup signals the process group a program leads, since it starts its own session in its terminal.
func signalGroup(pid int, forced bool) {
	signal := syscall.SIGTERM
	if forced {
		signal = syscall.SIGKILL
	}
	if syscall.Kill(-pid, signal) != nil {
		_ = syscall.Kill(pid, signal)
	}
}
