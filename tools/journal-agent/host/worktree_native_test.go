package host

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// repositoryWithCommit is a real temporary repository on branch main with one commit, by its real path.
func repositoryWithCommit(t *testing.T) (string, string) {
	t.Helper()
	root, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	run := func(arguments ...string) string {
		command := exec.Command("git", append([]string{"-C", root, "-c", "user.name=t", "-c", "user.email=t@t"}, arguments...)...)
		command.Env = append(os.Environ(), "GIT_CONFIG_GLOBAL=/dev/null", "GIT_CONFIG_NOSYSTEM=1")
		output, err := command.CombinedOutput()
		if err != nil {
			t.Fatalf("git %v: %v: %s", arguments, err, output)
		}
		return strings.TrimSpace(string(output))
	}
	run("init", "-b", "main")
	if err := os.WriteFile(filepath.Join(root, "README"), []byte("shop\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	run("add", "README")
	run("commit", "-m", "first")

	return root, run("rev-parse", "HEAD")
}

func preparedWorktree(t *testing.T, worktrees NativeWorktrees, child string, base string) (WorktreeClaim, WorktreeReceipt) {
	t.Helper()
	claim := WorktreeClaim{ClaimID: "claim-" + child, Generation: 1, ChildID: child, Writes: true, BaseOID: base}
	receipt, err := worktrees.Prepare(context.Background(), claim)
	if err != nil {
		t.Fatal(err)
	}

	return claim, receipt
}

func TestCleanupRemovesOnlyAnOwnedCleanReachableWorktreeAndNamesWhyItKeepsTheOthers(t *testing.T) {
	root, base := repositoryWithCommit(t)
	worktrees := NativeWorktrees{Root: root, Git: "git"}
	ctx := context.Background()

	clean, cleanReceipt := preparedWorktree(t, worktrees, "clean", base)
	dirty, dirtyReceipt := preparedWorktree(t, worktrees, "dirty", base)
	leased, _ := preparedWorktree(t, worktrees, "leased", base)
	ahead, aheadReceipt := preparedWorktree(t, worktrees, "ahead", base)
	if err := os.WriteFile(filepath.Join(dirtyReceipt.Path, "draft.txt"), []byte("work\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	commit := exec.Command("git", "-C", aheadReceipt.Path, "-c", "user.name=t", "-c", "user.email=t@t",
		"commit", "--allow-empty", "-m", "ahead of main")
	commit.Env = append(os.Environ(), "GIT_CONFIG_GLOBAL=/dev/null", "GIT_CONFIG_NOSYSTEM=1")
	if output, err := commit.CombinedOutput(); err != nil {
		t.Fatalf("commit: %v: %s", err, output)
	}

	cases := []struct {
		claim   WorktreeClaim
		lease   bool
		outcome string
		reason  string
	}{
		{dirty, false, CleanupKept, "uncommitted work"},
		{leased, true, CleanupKept, "lease"},
		{ahead, false, CleanupKept, "not reachable from main"},
		{WorktreeClaim{ClaimID: "claim-stranger", Generation: 1, ChildID: "stranger"}, false, CleanupAmbiguous, "no completed receipt"},
		{clean, false, CleanupRemoved, ""},
	}
	for _, each := range cases {
		cleanup := worktrees.Cleanup(ctx, each.claim, each.lease, "main", false)
		if cleanup.Outcome != each.outcome || !strings.Contains(cleanup.Reason, each.reason) {
			t.Fatalf("%s answered %+v, want %s (%s)", each.claim.ChildID, cleanup, each.outcome, each.reason)
		}
	}

	if _, err := os.Stat(cleanReceipt.Path); !os.IsNotExist(err) {
		t.Fatalf("the clean worktree is still there: %v", err)
	}
	if _, err := os.Stat(filepath.Join(dirtyReceipt.Path, "draft.txt")); err != nil {
		t.Fatalf("the dirty worktree lost its work: %v", err)
	}
	if !worktrees.isRegistered(ctx, aheadReceipt.Path) {
		t.Fatal("the worktree whose commit is not reachable was removed")
	}
}
