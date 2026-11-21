package host

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"syscall"
	"time"
)

// BrokerSocketName is the Git broker's socket in its runtime's own folder under the broker root.
const BrokerSocketName = "git.sock"

// BrokerSocketVariable tells a connected child's program where its Git broker listens.
const BrokerSocketVariable = "JOURNAL_GIT_BROKER"

// unixSocketPathMost is the longest Unix socket path every platform binds: macOS keeps 104 bytes, the last a NUL.
const unixSocketPathMost = 103

// ErrBrokerSocketTooLong refuses a broker socket whose path no Unix socket can bind.
var ErrBrokerSocketTooLong = errors.New("the Git broker's socket path is longer than a Unix socket takes")

// ErrBrokerRootNotOwn refuses a broker root another user made, or one open to them.
var ErrBrokerRootNotOwn = errors.New("the Git brokers' root is not this user's own private folder")

// brokerTimeout bounds one broker call, so a stuck Git never holds the socket.
const brokerTimeout = 2 * time.Minute

// BrokerCall is one request a child sends the broker: one of its fixed operations and what that operation takes.
type BrokerCall struct {
	Operation string   `json:"operation"`
	Paths     []string `json:"paths,omitempty"`
	Ref       string   `json:"ref,omitempty"`
	OldOID    string   `json:"old,omitempty"`
	Message   string   `json:"message,omitempty"`
}

// BrokerAnswer is what the broker answers: the operation's output, or the reason it refused or failed.
type BrokerAnswer struct {
	Output string `json:"output,omitempty"`
	Error  string `json:"error,omitempty"`
}

// ErrUnknownBrokerOperation refuses an operation outside the broker's fixed set.
var ErrUnknownBrokerOperation = errors.New("the Git broker carries out only status, diff, stage, commit and verified")

// BrokerRoot is the short folder every Git broker socket of this user lives under, whatever depth its project has:
// /tmp, not the platform's temporary folder, which is long on macOS.
func BrokerRoot() string {
	return filepath.Join("/tmp", "journal-"+strconv.Itoa(os.Getuid()))
}

// BrokerSocketPath is the broker socket of one runtime, in a folder of its own under the broker root, named by a
// digest of the runtime id so its length never depends on the id.
func BrokerSocketPath(runtimeID string) string {
	digest := sha256.Sum256([]byte(runtimeID))

	return filepath.Join(BrokerRoot(), hex.EncodeToString(digest[:6]), BrokerSocketName)
}

// ListenBroker opens the broker's socket at its path, in an owner-only folder under an owner-only broker root; a
// root another user holds or a path too long to bind is refused by name.
func ListenBroker(path string) (net.Listener, error) {
	if len(path) > unixSocketPathMost {
		return nil, fmt.Errorf("%w: %s", ErrBrokerSocketTooLong, path)
	}
	root := filepath.Dir(filepath.Dir(path))
	if err := os.Mkdir(root, 0o700); err != nil && !errors.Is(err, os.ErrExist) {
		return nil, err
	}
	if err := assertOwnFolder(root); err != nil {
		return nil, err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return nil, err
	}
	_ = os.Remove(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		return nil, err
	}

	return listener, os.Chmod(path, 0o600)
}

// assertOwnFolder refuses a folder that is a link, is not this user's or is open to anyone else.
func assertOwnFolder(folder string) error {
	info, err := os.Lstat(folder)
	if err != nil {
		return err
	}
	owner, known := info.Sys().(*syscall.Stat_t)
	if !info.IsDir() || !known || int(owner.Uid) != os.Getuid() || info.Mode().Perm()&0o077 != 0 {
		return fmt.Errorf("%w: %s", ErrBrokerRootNotOwn, folder)
	}

	return nil
}

// ServeBroker answers each call on the listener through the broker until the listener closes.
func ServeBroker(listener net.Listener, broker GitBroker) {
	for {
		connection, err := listener.Accept()
		if err != nil {
			return
		}
		go answerBroker(connection, broker)
	}
}

func answerBroker(connection net.Conn, broker GitBroker) {
	defer connection.Close()
	_ = connection.SetDeadline(time.Now().Add(brokerTimeout))
	var call BrokerCall
	if err := json.NewDecoder(connection).Decode(&call); err != nil {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), brokerTimeout)
	defer cancel()
	output, err := broker.Carry(ctx, call)
	answer := BrokerAnswer{Output: output}
	if err != nil {
		answer.Error = err.Error()
	}
	_ = json.NewEncoder(connection).Encode(answer)
}

// Carry carries out one call of the broker's fixed set; any other operation is refused.
func (broker GitBroker) Carry(ctx context.Context, call BrokerCall) (string, error) {
	switch call.Operation {
	case "status":
		return broker.Status(ctx)
	case "diff":
		return broker.Diff(ctx)
	case "stage":
		return "", broker.Stage(ctx, call.Paths)
	case "commit":
		return broker.Commit(ctx, call.Ref, call.OldOID, call.Message)
	case "verified":
		return broker.Verified(ctx, call.Ref)
	}

	return "", fmt.Errorf("%w: %q", ErrUnknownBrokerOperation, call.Operation)
}
