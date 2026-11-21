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

// plantedRepository is a repository whose own configuration and attributes would run programs through a clean
// filter, a textconv and a pre-commit hook, each touching its marker in the folder answered last.
func plantedRepository(t *testing.T) (string, string, string) {
	t.Helper()
	root, base := repositoryWithCommit(t)
	markers := t.TempDir()
	git := func(arguments ...string) {
		if output, err := exec.Command("git", append([]string{"-C", root}, arguments...)...).CombinedOutput(); err != nil {
			t.Fatalf("git %v: %v: %s", arguments, err, output)
		}
	}
	git("config", "filter.evil.clean", "touch "+filepath.Join(markers, "clean"))
	git("config", "filter.evil.required", "true")
	git("config", "diff.evil.textconv", "touch "+filepath.Join(markers, "textconv"))
	hook := filepath.Join(root, ".git", "hooks", "pre-commit")
	if err := os.WriteFile(hook, []byte("#!/bin/sh\ntouch "+filepath.Join(markers, "hook")+"\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, ".gitattributes"), []byte("* filter=evil diff=evil\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "README"), []byte("shop, changed\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	return root, base, markers
}

func TestTheBrokerRunsNoPlantedProgramAndCommitsOnlyOnTheExpectedRef(t *testing.T) {
	root, base, markers := plantedRepository(t)
	broker := GitBroker{Checkout: root, Writes: true, Git: "git"}
	ctx := context.Background()

	if _, err := broker.Status(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := broker.Diff(ctx); err != nil {
		t.Fatal(err)
	}
	if err := broker.Stage(ctx, []string{"../outside"}); !errors.Is(err, ErrBrokerRefused) {
		t.Fatalf("a path outside the checkout answered %v", err)
	}
	if err := broker.Stage(ctx, []string{"README", ".gitattributes"}); err != nil {
		t.Fatal(err)
	}
	if _, err := broker.Commit(ctx, "refs/heads/main", strings.Repeat("0", 40), "stale"); !errors.Is(err, ErrBrokerRefused) {
		t.Fatalf("a commit on a moved ref answered %v", err)
	}
	committed, err := broker.Commit(ctx, "refs/heads/main", base, "change")
	if err != nil || committed == base || len(committed) != 40 {
		t.Fatalf("the commit answered %q, %v", committed, err)
	}

	for _, marker := range []string{"clean", "textconv", "hook"} {
		if _, err := os.Stat(filepath.Join(markers, marker)); err == nil {
			t.Fatalf("the planted %s program ran", marker)
		}
	}
	reader := GitBroker{Checkout: root, Writes: false, Git: "git"}
	if err := reader.Stage(ctx, []string{"README"}); !errors.Is(err, ErrBrokerRefused) {
		t.Fatalf("a reader's stage answered %v", err)
	}
	if _, err := reader.Commit(ctx, "refs/heads/main", committed, "reader"); !errors.Is(err, ErrBrokerRefused) {
		t.Fatalf("a reader's commit answered %v", err)
	}
}
