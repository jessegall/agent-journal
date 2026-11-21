package host

import (
	"encoding/json"
	"net"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func askBroker(t *testing.T, worktree string, call BrokerCall) BrokerAnswer {
	t.Helper()
	connection, err := net.Dial("unix", filepath.Join(worktree, ".journal", BrokerSocketName))
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
	listener, err := ListenBroker(receipt.Path)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	go ServeBroker(listener, GitBroker{Checkout: receipt.Path, Writes: true, Git: "git"})
	if err := os.WriteFile(filepath.Join(receipt.Path, "work.txt"), []byte("done\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	if answer := askBroker(t, receipt.Path, BrokerCall{Operation: "stage", Paths: []string{"work.txt"}}); answer.Error != "" {
		t.Fatal(answer.Error)
	}
	ref := "refs/heads/" + receipt.Branch
	committed := askBroker(t, receipt.Path, BrokerCall{Operation: "commit", Ref: ref, OldOID: base, Message: "the work"})
	if committed.Error != "" || committed.Output == base {
		t.Fatalf("the commit answered %+v", committed)
	}
	if head := gitOutput(t, receipt.Path, "rev-parse", "HEAD"); head != committed.Output {
		t.Fatalf("the worktree's branch is at %s, want %s", head, committed.Output)
	}

	refused := askBroker(t, receipt.Path, BrokerCall{Operation: "push"})
	if !strings.Contains(refused.Error, ErrUnknownBrokerOperation.Error()) {
		t.Fatalf("an operation outside the broker answered %+v", refused)
	}
}
