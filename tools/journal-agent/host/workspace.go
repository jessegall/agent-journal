package host

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// WorkspaceBranch is the branch a helper checkout works on.
const WorkspaceBranch = "version-6"

var (
	// ErrWorkspaceUnsafe refuses a checkout that reaches outside its own folder: a linked worktree, alternates, an
	// external git directory, hooks, a credential helper or submodules.
	ErrWorkspaceUnsafe = errors.New("the workspace checkout reaches outside its own folder")
	// ErrWorkspaceMountUnsafe refuses a mount source that is not its own canonical folder under the workspaces root.
	ErrWorkspaceMountUnsafe = errors.New("the workspace mount source is not a canonical folder of its own")
	// ErrWorkspaceHeld refuses a checkout another identity or purpose holds.
	ErrWorkspaceHeld = errors.New("the workspace is held by another launch")
	// ErrWorkspaceQuotaUnavailable refuses a workspace on a host that cannot bound its size.
	ErrWorkspaceQuotaUnavailable = errors.New("workspace-quota-unavailable: this host has no bounded workspace volume")
)

// WorkspaceOwner is who holds a checkout: the helper identity and the purpose it works for.
type WorkspaceOwner struct {
	Identity string `json:"identity"`
	Purpose  string `json:"purpose"`
}

// Workspaces prepares and checks helper checkouts under one root folder.
type Workspaces struct {
	Root string
	Git  string
}

// Prepare makes a self-contained clone of the repository at the revision inside the folder: its own .git, no
// hardlinks or alternates into the source, no hooks and no remote, on the workspace branch.
func (workspaces Workspaces) Prepare(ctx context.Context, repository, revision, folder string) error {
	if err := workspaces.RequireMountSource(folder); err != nil {
		return err
	}
	if err := workspaces.git(ctx, "", "clone", "--quiet", "--no-local", "--no-hardlinks", "--no-checkout",
		"--config", "core.hooksPath=/dev/null", repository, folder); err != nil {
		return err
	}
	for _, step := range [][]string{
		{"checkout", "--quiet", "-B", WorkspaceBranch, revision},
		{"remote", "remove", "origin"},
	} {
		if err := workspaces.git(ctx, folder, step...); err != nil {
			return err
		}
	}
	if err := os.RemoveAll(filepath.Join(folder, ".git", "hooks")); err != nil {
		return err
	}
	return workspaces.Check(ctx, folder)
}

// Check refuses a checkout that is not self-contained.
func (workspaces Workspaces) Check(ctx context.Context, folder string) error {
	gitDirectory := filepath.Join(folder, ".git")
	info, err := os.Lstat(gitDirectory)
	if err != nil || !info.IsDir() {
		return fmt.Errorf("%w: %s has no .git folder of its own", ErrWorkspaceUnsafe, folder)
	}
	for _, reaching := range []string{"objects/info/alternates", "commondir", "hooks"} {
		if _, err := os.Lstat(filepath.Join(gitDirectory, reaching)); err == nil {
			return fmt.Errorf("%w: %s has .git/%s", ErrWorkspaceUnsafe, folder, reaching)
		}
	}
	if _, err := os.Lstat(filepath.Join(folder, ".gitmodules")); err == nil {
		return fmt.Errorf("%w: %s has submodules", ErrWorkspaceUnsafe, folder)
	}
	for _, key := range []string{"credential.helper", "core.worktree", "include.path"} {
		if value, _ := workspaces.output(ctx, folder, "config", "--get", key); value != "" {
			return fmt.Errorf("%w: %s sets %s", ErrWorkspaceUnsafe, folder, key)
		}
	}
	common, err := workspaces.output(ctx, folder, "rev-parse", "--path-format=absolute", "--git-common-dir")
	if err != nil {
		return err
	}
	canonical, err := filepath.EvalSymlinks(gitDirectory)
	if err != nil || filepath.Clean(common) != canonical {
		return fmt.Errorf("%w: %s shares its git directory", ErrWorkspaceUnsafe, folder)
	}
	return nil
}

// RequireMountSource refuses a folder that is not a direct, canonical child of the workspaces root: no relative
// path, no symlink anywhere on the way, nothing nested deeper.
func (workspaces Workspaces) RequireMountSource(folder string) error {
	root, err := filepath.EvalSymlinks(workspaces.Root)
	if err != nil {
		return fmt.Errorf("%w: the workspaces root %s: %v", ErrWorkspaceMountUnsafe, workspaces.Root, err)
	}
	if !filepath.IsAbs(folder) || filepath.Clean(folder) != folder || filepath.Dir(folder) != root {
		return fmt.Errorf("%w: %s", ErrWorkspaceMountUnsafe, folder)
	}
	if info, err := os.Lstat(folder); err == nil && info.Mode()&os.ModeSymlink != 0 {
		return fmt.Errorf("%w: %s is a symlink", ErrWorkspaceMountUnsafe, folder)
	}
	return nil
}

// Claim gives the checkout to the owner, once: the same identity and purpose may take it again, any other is
// refused while the claim stands.
func (workspaces Workspaces) Claim(folder string, owner WorkspaceOwner) error {
	claim := folder + ".owner"
	text := owner.Identity + "\n" + owner.Purpose + "\n"
	file, err := os.OpenFile(claim, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o600)
	if err == nil {
		defer file.Close()
		_, err = file.WriteString(text)
		return err
	}
	if !errors.Is(err, os.ErrExist) {
		return err
	}
	held, err := os.ReadFile(claim)
	if err != nil {
		return err
	}
	if string(held) != text {
		return fmt.Errorf("%w: %s", ErrWorkspaceHeld, folder)
	}
	return nil
}

// Release ends the owner's claim on the checkout.
func (workspaces Workspaces) Release(folder string, owner WorkspaceOwner) error {
	if err := workspaces.Claim(folder, owner); err != nil {
		return err
	}
	return os.Remove(folder + ".owner")
}

// RequireQuota refuses a workspace on this host: no bounded volume or filesystem quota is arranged yet, so a
// helper workspace could fill the host disk.
func (workspaces Workspaces) RequireQuota(bytes int64) error {
	return fmt.Errorf("%w (asked for %d bytes)", ErrWorkspaceQuotaUnavailable, bytes)
}

func (workspaces Workspaces) git(ctx context.Context, folder string, arguments ...string) error {
	_, err := workspaces.output(ctx, folder, arguments...)
	return err
}

func (workspaces Workspaces) output(ctx context.Context, folder string, arguments ...string) (string, error) {
	gitArguments := arguments
	if folder != "" {
		gitArguments = append([]string{"-C", folder}, arguments...)
	}
	command := exec.CommandContext(ctx, workspaces.Git, gitArguments...)
	command.Env = append(os.Environ(), "GIT_CONFIG_NOSYSTEM=1", "GIT_TERMINAL_PROMPT=0")
	output, err := command.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("git %s: %w: %s", strings.Join(arguments, " "), err, strings.TrimSpace(string(output)))
	}
	return strings.TrimSpace(string(output)), nil
}
