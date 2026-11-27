package worktreecheck

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// repository is a fresh repository with one committed file, notes.md, on branch main.
func repository(t *testing.T) string {
	t.Helper()
	folder := t.TempDir()
	run(t, folder, "init", "-q", "-b", "main")
	write(t, folder, "notes.md", "first")
	run(t, folder, "add", "notes.md")
	run(t, folder, "commit", "-q", "-m", "First.")
	return folder
}

func run(t *testing.T, folder string, arguments ...string) {
	t.Helper()
	command := exec.Command("git", append([]string{"-C", folder, "-c", "user.name=Test", "-c", "user.email=test@example.com"}, arguments...)...)
	if output, err := command.CombinedOutput(); err != nil {
		t.Fatalf("git %v: %v: %s", arguments, err, output)
	}
}

func write(t *testing.T, folder, name, content string) {
	t.Helper()
	if err := os.WriteFile(filepath.Join(folder, name), []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
}

func TestACleanCommittedTreePasses(t *testing.T) {
	if problems := Problems(repository(t), "main"); len(problems) != 0 {
		t.Fatalf("a clean tree has problems: %v", problems)
	}
}

func TestADirtyTreeFailsWithASummary(t *testing.T) {
	cases := map[string]struct {
		dirty   func(t *testing.T, folder string)
		summary string
	}{
		"an edited tracked file": {func(t *testing.T, folder string) { write(t, folder, "notes.md", "changed") }, "Changed and not committed: notes.md"},
		"an untracked file":      {func(t *testing.T, folder string) { write(t, folder, "new.md", "new") }, "Untracked: new.md"},
		"a staged change": {func(t *testing.T, folder string) {
			write(t, folder, "notes.md", "staged")
			run(t, folder, "add", "notes.md")
		}, "Staged but not committed: notes.md"},
		"a skip-worktree file": {func(t *testing.T, folder string) {
			run(t, folder, "update-index", "--skip-worktree", "notes.md")
		}, "Marked skip-worktree or assume-unchanged: notes.md"},
		"a detached head":  {func(t *testing.T, folder string) { run(t, folder, "checkout", "-q", "--detach") }, "HEAD is detached"},
		"another branch":   {func(t *testing.T, folder string) { run(t, folder, "checkout", "-q", "-b", "other") }, "not the assigned main"},
		"a merge underway": {func(t *testing.T, folder string) { write(t, folder, ".git/MERGE_HEAD", "x") }, "a merge is in progress"},
	}

	for name, sample := range cases {
		folder := repository(t)
		sample.dirty(t, folder)
		if problems := strings.Join(Problems(folder, "main"), "\n"); !strings.Contains(problems, sample.summary) {
			t.Errorf("%s: the problems %q do not say %q", name, problems, sample.summary)
		}
	}
}

func TestAFolderThatIsNoWorktreeFails(t *testing.T) {
	if problems := Problems(t.TempDir(), ""); len(problems) != 1 || !strings.Contains(problems[0], "is not a git worktree") {
		t.Fatalf("a plain folder gave %v", problems)
	}
}

func TestManyPathsAreCountedPastTheFirstFive(t *testing.T) {
	if named := namedPaths([]string{"a", "b", "c", "d", "e", "f", "g"}); named != "a, b, c, d, e and 2 more" {
		t.Fatalf("named %q", named)
	}
}
