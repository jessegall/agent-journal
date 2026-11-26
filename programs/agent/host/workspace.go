package host

import "errors"

// WorkspaceBranch is the branch a helper checkout works on.
const WorkspaceBranch = "version-6"

var (
	// ErrWorkspaceUnsafe refuses a checkout that reaches outside its own folder: a linked worktree, alternates, an
	// external git directory, hooks, a credential helper or submodules.
	ErrWorkspaceUnsafe = errors.New("the workspace checkout reaches outside its own folder")
	// ErrWorkspaceQuotaUnavailable refuses a workspace on a host that cannot bound its size.
	ErrWorkspaceQuotaUnavailable = errors.New("workspace-quota-unavailable: this host has no bounded workspace volume")
)

// reachingGitPaths are the paths under .git that make a checkout reach outside its own folder.
var reachingGitPaths = []string{"objects/info/alternates", "commondir", "hooks"}

// cloneArguments clone the repository into the folder with its own objects: no hardlinks, no alternates, no hooks
// and nothing checked out yet.
func cloneArguments(repository, folder string) []string {
	return []string{"clone", "--quiet", "--no-local", "--no-hardlinks", "--no-checkout",
		"--config", "core.hooksPath=/dev/null", repository, folder}
}

// checkoutSteps put a fresh clone on the workspace branch at the revision and cut it from its remote.
func checkoutSteps(revision string) [][]string {
	return [][]string{
		{"checkout", "--quiet", "-B", WorkspaceBranch, revision},
		{"remote", "remove", "origin"},
	}
}
