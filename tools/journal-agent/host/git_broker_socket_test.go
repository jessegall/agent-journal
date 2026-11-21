package host

import (
	"encoding/json"
	"errors"
	"net"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func askBroker(t *testing.T, socket string, call BrokerCall) BrokerAnswer {
	t.Helper()
	connection, err := net.Dial("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Close()
	if err := json.NewEncoder(connection).Encode(call); err != nil {
		t.Fatal(err)
	}
	var answer BrokerAnswer
	if err := json.NewDecoder(connection).Decode(&answer); err != nil {
		t.Fatal(err)
	}

	return answer
}

func TestAChildCommitsOnItsWorktreeBranchThroughTheBrokerSocketAndNothingElse(t *testing.T) {
	root, base := repositoryWithCommit(t)
	worktrees := NativeWorktrees{Root: root, Git: "git"}
	_, receipt := preparedWorktree(t, worktrees, "child", base)
	// The worktree lies under the test's temporary folder, longer on macOS than a Unix socket path may be.
	socket := BrokerSocketPath("runtime-" + filepath.Base(t.TempDir()) + t.Name())
	listener, err := ListenBroker(socket)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	defer os.RemoveAll(filepath.Dir(socket))
	go ServeBroker(listener, GitBroker{Checkout: receipt.Path, Writes: true, Git: "git"})
	if err := os.WriteFile(filepath.Join(receipt.Path, "work.txt"), []byte("done\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	if answer := askBroker(t, socket, BrokerCall{Operation: "stage", Paths: []string{"work.txt"}}); answer.Error != "" {
		t.Fatal(answer.Error)
	}
	ref := "refs/heads/" + receipt.Branch
	committed := askBroker(t, socket, BrokerCall{Operation: "commit", Ref: ref, OldOID: base, Message: "the work"})
	if committed.Error != "" || committed.Output == base {
		t.Fatalf("the commit answered %+v", committed)
	}
	if head := gitOutput(t, receipt.Path, "rev-parse", "HEAD"); head != committed.Output {
		t.Fatalf("the worktree's branch is at %s, want %s", head, committed.Output)
	}

	refused := askBroker(t, socket, BrokerCall{Operation: "push"})
	if !strings.Contains(refused.Error, ErrUnknownBrokerOperation.Error()) {
		t.Fatalf("an operation outside the broker answered %+v", refused)
	}
}

func TestABrokerSocketPathNoUnixSocketTakesIsRefusedByName(t *testing.T) {
	path := filepath.Join(BrokerRoot(), strings.Repeat("x", unixSocketPathMost), BrokerSocketName)

	if _, err := ListenBroker(path); !errors.Is(err, ErrBrokerSocketTooLong) {
		t.Fatalf("a socket path of %d bytes was not refused by name: %v", len(path), err)
	}
}

func TestEveryRuntimesBrokerSocketFitsAUnixSocket(t *testing.T) {
	path := BrokerSocketPath(strings.Repeat("runtime", 40))

	if len(path) > unixSocketPathMost || !strings.HasPrefix(path, BrokerRoot()+"/") {
		t.Fatalf("the broker socket %s does not fit under its root", path)
	}
}
