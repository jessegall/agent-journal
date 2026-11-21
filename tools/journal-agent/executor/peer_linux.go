//go:build linux

package executor

import (
	"net"
	"syscall"
)

// connectedUID is the user id of the process at the other end of the socket, as the kernel recorded it.
func connectedUID(conn *net.UnixConn) (int, error) {
	raw, err := conn.SyscallConn()
	if err != nil {
		return 0, err
	}

	var credentials *syscall.Ucred
	var credentialsErr error
	if err := raw.Control(func(fd uintptr) {
		credentials, credentialsErr = syscall.GetsockoptUcred(int(fd), syscall.SOL_SOCKET, syscall.SO_PEERCRED)
	}); err != nil {
		return 0, err
	}
	if credentialsErr != nil {
		return 0, credentialsErr
	}

	return int(credentials.Uid), nil
}
