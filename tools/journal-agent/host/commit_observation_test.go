package host

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func gitIn(t *testing.T, folder string, arguments ...string) {
	t.Helper()
	command := exec.Command("git", append([]string{"-C", folder}, arguments...)...)
	command.Env = append(os.Environ(), "GIT_AUTHOR_NAME=t", "GIT_AUTHOR_EMAIL=t@example.com", "GIT_COMMITTER_NAME=t", "GIT_COMMITTER_EMAIL=t@example.com")
	if printed, err := command.CombinedOutput(); err != nil {
		t.Fatalf("git %v: %v\n%s", arguments, err, printed)
	}
}

func TestAConnectedRootReportsItsVerifiedHeadAndDirtyFlag(t *testing.T) {
	root := t.TempDir()
	gitIn(t, root, "init", "-q")
	if err := os.WriteFile(filepath.Join(root, "file"), []byte("one\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	gitIn(t, root, "add", "file")
	gitIn(t, root, "commit", "-q", "-m", "first")
	if err := os.WriteFile(filepath.Join(root, "file"), []byte("two\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	observation := ObserveCommit(context.Background(), "git", root, "binding-1", "checkout-1")

	if observation.Version != 2 || len(observation.HeadOID) < 40 || !observation.Dirty || observation.Reason != "" {
		t.Fatalf("observed %+v", observation)
	}
}

func TestAnEmptyRepositoryReportsTheUnbornReason(t *testing.T) {
	root := t.TempDir()
	gitIn(t, root, "init", "-q")

	observation := ObserveCommit(context.Background(), "git", root, "binding-1", "checkout-1")

	if observation.Reason != UnbornRoot || observation.HeadOID != "" {
		t.Fatalf("observed %+v", observation)
	}
	if outside := ObserveCommit(context.Background(), "git", t.TempDir(), "binding-1", "checkout-1"); outside.Reason != UnavailableRoot {
		t.Fatalf("a folder outside Git observed %+v", outside)
	}
}
