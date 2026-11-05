//go:build darwin || linux

package launch

import "syscall"

// signalGroup signals the process group a program leads, since it starts its own session in its terminal.
func signalGroup(pid int, forced bool) {
	signal := syscall.SIGTERM
	if forced {
		signal = syscall.SIGKILL
	}
	_ = syscall.Kill(-pid, signal)
}
