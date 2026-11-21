//go:build !linux

package executor

import (
	"errors"
	"net"
)

// connectedUID needs the kernel's peer credentials, which the executor reads on Linux only.
func connectedUID(*net.UnixConn) (int, error) {
	return 0, errors.New("the peer's user is read on Linux only")
}
