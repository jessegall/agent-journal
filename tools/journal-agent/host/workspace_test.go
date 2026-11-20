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

func gitIn(t *testing.T, folder string, arguments ...string) string {
	t.Helper()
	command := exec.Command("git", append([]string{"-C", folder}, arguments...)...)
	command.Env = append(os.Environ(), "GIT_CONFIG_NOSYSTEM=1", "GIT_AUTHOR_NAME=t", "GIT_AUTHOR_EMAIL=t@t",
		"GIT_COMMITTER_NAME=t", "GIT_COMMITTER_EMAIL=t@t")
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("git %v: %v: %s", arguments, err, output)
	}
	return strings.TrimSpace(string(output))
}

// sourceRepository is a host repository with one commit and a hook that must never reach a checkout.
func sourceRepository(t *testing.T) (string, string) {
	t.Helper()
	repository := t.TempDir()
	gitIn(t, repository, "init", "--quiet")
	if err := os.WriteFile(filepath.Join(repository, "README"), []byte("hello\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(repository, ".git", "hooks", "post-checkout"), []byte("#!/bin/sh\nexit 1\n"), 0o755); err != nil {
		t.Fatal(err)
	}
	gitIn(t, repository, "add", "README")
	gitIn(t, repository, "commit", "--quiet", "-m", "first")
	return repository, gitIn(t, repository, "rev-parse", "HEAD")
}

func workspacesFor(t *testing.T) Workspaces {
	t.Helper()
	root, err := filepath.EvalSymlinks(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	return Workspaces{Root: root, Git: "git"}
}

func TestAPreparedCheckoutIsSelfContainedAndItsCommitsStayInIt(t *testing.T) {
	repository, revision := sourceRepository(t)
	workspaces := workspacesFor(t)
	folder := filepath.Join(workspaces.Root, "helper-7")

	if err := workspaces.Prepare(context.Background(), repository, revision, folder); err != nil {
		t.Fatalf("prepare: %v", err)
	}

	if branch := gitIn(t, folder, "rev-parse", "--abbrev-ref", "HEAD"); branch != WorkspaceBranch {
		t.Fatalf("branch %q, want %q", branch, WorkspaceBranch)
	}
	if remotes := gitIn(t, folder, "remote"); remotes != "" {
		t.Fatalf("remotes %q, want none", remotes)
	}
	if _, err := os.Stat(filepath.Join(folder, ".git", "objects", "info", "alternates")); err == nil {
		t.Fatal("the checkout borrows objects from the host repository")
	}
	if err := os.WriteFile(filepath.Join(folder, "NOTE"), []byte("helper\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	gitIn(t, folder, "add", "NOTE")
	gitIn(t, folder, "commit", "--quiet", "-m", "helper work")
	if head := gitIn(t, repository, "rev-parse", "HEAD"); head != revision {
		t.Fatalf("the host repository moved to %s", head)
	}
}

func TestACheckoutThatSharesTheHostGitDirectoryIsRefused(t *testing.T) {
	repository, _ := sourceRepository(t)
	workspaces := workspacesFor(t)
	folder := filepath.Join(workspaces.Root, "helper-8")
	gitIn(t, repository, "-c", "core.hooksPath=/dev/null", "worktree", "add", "--quiet", "--detach", folder)

	if err := workspaces.Check(context.Background(), folder); !errors.Is(err, ErrWorkspaceUnsafe) {
		t.Fatalf("a linked worktree: %v, want ErrWorkspaceUnsafe", err)
	}
}

func TestAMountSourceOutsideTheRootOrBehindASymlinkIsRefused(t *testing.T) {
	workspaces := workspacesFor(t)
	outside := t.TempDir()
	link := filepath.Join(workspaces.Root, "helper-9")
	if err := os.Symlink(outside, link); err != nil {
		t.Fatal(err)
	}

	for _, folder := range []string{outside, link, filepath.Join(workspaces.Root, "a", "b"), "relative"} {
		if err := workspaces.RequireMountSource(folder); !errors.Is(err, ErrWorkspaceMountUnsafe) {
			t.Fatalf("%s: %v, want ErrWorkspaceMountUnsafe", folder, err)
		}
	}
}

func TestOnlyTheSameIdentityAndPurposeTakeAHeldCheckoutAgain(t *testing.T) {
	workspaces := workspacesFor(t)
	folder := filepath.Join(workspaces.Root, "helper-10")
	owner := WorkspaceOwner{Identity: "identity-67", Purpose: "purpose-31"}

	if err := workspaces.Claim(folder, owner); err != nil {
		t.Fatal(err)
	}
	if err := workspaces.Claim(folder, owner); err != nil {
		t.Fatalf("the same owner again: %v", err)
	}
	other := WorkspaceOwner{Identity: "identity-67", Purpose: "purpose-32"}
	if err := workspaces.Claim(folder, other); !errors.Is(err, ErrWorkspaceHeld) {
		t.Fatalf("another purpose: %v, want ErrWorkspaceHeld", err)
	}
	if err := workspaces.Release(folder, owner); err != nil {
		t.Fatal(err)
	}
	if err := workspaces.Claim(folder, other); err != nil {
		t.Fatalf("after the release: %v", err)
	}
}

func TestAHostWithoutABoundedVolumeRefusesTheWorkspace(t *testing.T) {
	if err := workspacesFor(t).RequireQuota(10 << 30); !errors.Is(err, ErrWorkspaceQuotaUnavailable) {
		t.Fatalf("%v, want ErrWorkspaceQuotaUnavailable", err)
	}
}
