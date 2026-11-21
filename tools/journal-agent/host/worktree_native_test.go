package host

import (
	"context"
	"errors"
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

func gitOutput(t *testing.T, folder string, arguments ...string) string {
	t.Helper()
	output, err := exec.Command("git", append([]string{"-C", folder}, arguments...)...).Output()
	if err != nil {
		t.Fatalf("git %v: %v", arguments, err)
	}

	return strings.TrimSpace(string(output))
}

func TestPrepareMakesAWriterBranchAndADetachedReaderAndAdoptsNoStrangeFolder(t *testing.T) {
	root, base := repositoryWithCommit(t)
	worktrees := NativeWorktrees{Root: root, Git: "git"}
	ctx := context.Background()

	_, writer := preparedWorktree(t, worktrees, "writer", base)
	reader, err := worktrees.Prepare(ctx, WorktreeClaim{ClaimID: "claim-reader", Generation: 1, ChildID: "reader", BaseOID: base})
	if err != nil {
		t.Fatal(err)
	}

	if gitOutput(t, writer.Path, "symbolic-ref", "HEAD") != "refs/heads/journal/worker/writer" ||
		gitOutput(t, writer.Path, "rev-parse", "HEAD") != base {
		t.Fatal("the writer is not on journal/worker/writer at the base")
	}
	if exec.Command("git", "-C", reader.Path, "symbolic-ref", "-q", "HEAD").Run() == nil || reader.Branch != "" {
		t.Fatal("the reader is not detached")
	}
	if !writer.Complete || !reader.Complete {
		t.Fatal("a receipt was not completed")
	}
	exclude, err := os.ReadFile(gitOutput(t, writer.Path, "rev-parse", "--path-format=absolute", "--git-path", "info/exclude"))
	if err != nil || !strings.Contains(string(exclude), "/.journal/") {
		t.Fatalf("/.journal/ is not excluded: %v", err)
	}

	again, err := worktrees.Prepare(ctx, writer.WorktreeClaim)
	if err != nil || again.Path != writer.Path {
		t.Fatalf("a repeated claim answered %+v, %v", again, err)
	}

	interrupted := WorktreeClaim{ClaimID: "claim-interrupted", Generation: 1, ChildID: "interrupted", Writes: true, BaseOID: base}
	intent := worktrees.receiptFor(interrupted)
	if err := worktrees.writeReceipt(intent); err != nil {
		t.Fatal(err)
	}
	if _, err := worktrees.git(ctx, root, worktrees.addArguments(intent)...); err != nil {
		t.Fatal(err)
	}
	resumed, err := worktrees.Prepare(ctx, interrupted)
	if err != nil || resumed.Path != intent.Path || !resumed.Complete {
		t.Fatalf("an interrupted claim answered %+v, %v", resumed, err)
	}

	stranger := WorktreeClaim{ClaimID: "claim-stranger", Generation: 1, ChildID: "stranger", Writes: true, BaseOID: strings.Repeat("1", 40)}
	if _, err := worktrees.Prepare(ctx, stranger); err == nil {
		t.Fatal("a claim at a base Git does not have was prepared")
	}
	similar := WorktreeClaim{ClaimID: "claim-similar", Generation: 1, ChildID: "similar", Writes: true, BaseOID: base}
	if err := os.MkdirAll(worktrees.receiptFor(similar).Path, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := worktrees.writeReceipt(worktrees.receiptFor(similar)); err != nil {
		t.Fatal(err)
	}
	if err := worktrees.confirm(ctx, worktrees.receiptFor(similar)); !errors.Is(err, ErrWorktreeMismatch) {
		t.Fatalf("a folder Git does not list answered %v", err)
	}
}
