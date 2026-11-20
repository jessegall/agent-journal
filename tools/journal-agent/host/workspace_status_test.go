package host

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func repository(t *testing.T) string {
	t.Helper()
	folder := t.TempDir()
	for _, arguments := range [][]string{
		{"init", "--quiet"},
		{"-c", "user.name=Test", "-c", "user.email=test@example.test", "commit", "--allow-empty", "-q", "-m", "first"},
	} {
		if output, err := exec.Command("git", append([]string{"-C", folder}, arguments...)...).CombinedOutput(); err != nil {
			t.Fatalf("git %v: %v %s", arguments, err, output)
		}
	}
	return folder
}

func TestACleanCheckoutIsCleanAndAChangedOneIsDirty(t *testing.T) {
	folder := repository(t)

	clean := SampleWorkspace(context.Background(), "git", folder)
	if err := os.WriteFile(filepath.Join(folder, "change.txt"), []byte("x"), 0o600); err != nil {
		t.Fatal(err)
	}
	dirty := SampleWorkspace(context.Background(), "git", folder)

	if clean != (WorkspaceStatus{Available: true, Clean: true, Generation: 1}) {
		t.Fatalf("a clean checkout read as %+v", clean)
	}
	if dirty != (WorkspaceStatus{Available: true, Dirty: true, Generation: 1}) {
		t.Fatalf("a changed checkout read as %+v", dirty)
	}
}

func TestAnUnreadableCheckoutIsNeitherDirtyNorClean(t *testing.T) {
	status := SampleWorkspace(context.Background(), "git", filepath.Join(t.TempDir(), "missing"))

	if status != (WorkspaceStatus{}) {
		t.Fatalf("a missing checkout read as %+v", status)
	}
}

func TestAHookInTheCheckoutNeverRuns(t *testing.T) {
	folder := repository(t)
	marker := filepath.Join(t.TempDir(), "hook-ran")
	hook := filepath.Join(folder, ".git", "hooks", "post-index-change")
	if err := os.WriteFile(hook, []byte("#!/bin/sh\ntouch "+marker+"\n"), 0o755); err != nil {
		t.Fatal(err)
	}

	SampleWorkspace(context.Background(), "git", folder)

	if _, err := os.Stat(marker); err == nil {
		t.Fatal("a checkout hook ran during the read")
	}
}
