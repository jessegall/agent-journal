package host

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"time"
)

// BrokerSocketName is the Git broker's socket in a child's worktree, under its private .journal folder, which Git
// excludes there.
const BrokerSocketName = "git.sock"

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

// ListenBroker opens the broker's socket in the worktree's private .journal folder, private to this user.
func ListenBroker(worktree string) (net.Listener, error) {
	folder := filepath.Join(worktree, ".journal")
	if err := os.MkdirAll(folder, 0o700); err != nil {
		return nil, err
	}
	path := filepath.Join(folder, BrokerSocketName)
	_ = os.Remove(path)
	listener, err := net.Listen("unix", path)
	if err != nil {
		return nil, err
	}

	return listener, os.Chmod(path, 0o600)
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
