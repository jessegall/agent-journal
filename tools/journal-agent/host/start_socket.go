package host

import (
	"context"
	"errors"
	"log"
	"net"
	"os"
	"path/filepath"
)

// StartSocketName is the host-local socket the PHP start executor reaches the protected host on.
const StartSocketName = "start.sock"

// StartSocket answers local start and stop requests on a socket in the host's owner-only state folder, so only the
// host's own user reaches it, never a sandboxed tool, whose sandbox allows no Unix socket.
type StartSocket struct {
	Folder   string
	Executor Executor
}

// Listen opens the socket, replacing one a stopped host left behind, readable by the host's owner alone.
func (socket StartSocket) Listen() (net.Listener, error) {
	if err := requireOwnerOnly(socket.Folder, stateFolderMode); err != nil {
		return nil, err
	}
	path := filepath.Join(socket.Folder, StartSocketName)
	if err := os.Remove(path); err != nil && !errors.Is(err, os.ErrNotExist) {
		return nil, err
	}
	listener, err := net.Listen("unix", path)
	if err != nil {
		return nil, err
	}
	if err := os.Chmod(path, secretFileMode); err != nil {
		listener.Close()
		return nil, err
	}
	return listener, nil
}

// Serve answers each connection's one request until the listener closes.
func (socket StartSocket) Serve(ctx context.Context, listener net.Listener) {
	for {
		connection, err := listener.Accept()
		if err != nil {
			return
		}
		go func() {
			defer connection.Close()
			if err := AnswerHostRequest(ctx, connection, socket.Executor); err != nil {
				log.Printf("a local start request was not answered: %v", err)
			}
		}()
	}
}
