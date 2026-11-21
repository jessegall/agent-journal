package hookadapter

import (
	"context"
	"encoding/json"
	"errors"
	"net"
	"os"
	"path/filepath"
	"time"
)

// SocketName is the session socket inside a session's private run folder, .journal/sessions/<runtime>/run.
const SocketName = "hook.sock"

// hookCall is one native call the adapter hands the relay over the session socket.
type hookCall struct {
	Driver string          `json:"driver"`
	Native json.RawMessage `json:"native"`
}

// AskThroughSocket is an Ask that hands the call to the relay serving the session socket at the path; the relay,
// not the adapter, holds the runtime's authority and talks to the journal.
func AskThroughSocket(path string, driver string) func(ctx context.Context, native []byte) (Reply, error) {
	return func(ctx context.Context, native []byte) (Reply, error) {
		var dialer net.Dialer
		connection, err := dialer.DialContext(ctx, "unix", path)
		if err != nil {
			return Reply{}, err
		}
		defer connection.Close()
		if deadline, set := ctx.Deadline(); set {
			_ = connection.SetDeadline(deadline)
		}
		if err := json.NewEncoder(connection).Encode(hookCall{Driver: driver, Native: native}); err != nil {
			return Reply{}, err
		}
		var reply Reply

		return reply, json.NewDecoder(connection).Decode(&reply)
	}
}

// ErrSocketFolderOpen is returned when a session's run folder could be entered by another user.
var ErrSocketFolderOpen = errors.New("the session's run folder is open to other users")

// Listen opens the session socket in the run folder, which must be private to this user, so only this user's
// processes reach it; the socket file is private too.
func Listen(runFolder string) (net.Listener, error) {
	if err := os.MkdirAll(runFolder, 0o700); err != nil {
		return nil, err
	}
	info, err := os.Stat(runFolder)
	if err != nil {
		return nil, err
	}
	if info.Mode().Perm()&0o077 != 0 {
		return nil, ErrSocketFolderOpen
	}
	path := filepath.Join(runFolder, SocketName)
	_ = os.Remove(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		return nil, err
	}

	return listener, os.Chmod(path, 0o600)
}

// Serve answers each call on the session socket with forward, which sends it to the journal with the runtime's
// authority, until the listener closes.
func Serve(listener net.Listener, forward func(ctx context.Context, driver string, native []byte) (Reply, error)) {
	for {
		connection, err := listener.Accept()
		if err != nil {
			return
		}
		go answer(connection, forward)
	}
}

func answer(connection net.Conn, forward func(ctx context.Context, driver string, native []byte) (Reply, error)) {
	defer connection.Close()
	_ = connection.SetDeadline(time.Now().Add(Budget))
	var call hookCall
	if err := json.NewDecoder(connection).Decode(&call); err != nil {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), Budget)
	defer cancel()
	reply, err := forward(ctx, call.Driver, call.Native)
	if err != nil {
		return
	}
	_ = json.NewEncoder(connection).Encode(reply)
}
