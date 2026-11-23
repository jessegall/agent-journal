package host

import (
	"context"
	"os/exec"
	"strconv"
	"strings"
)

// WorkspaceStatus is one sample of a checkout as a retained workspace read is answered with: whether the host could
// read it, whether it has uncommitted changes, whether it is positively clean, and its generation, the number of
// commits on its current branch. A failed read is neither dirty nor clean.
type WorkspaceStatus struct {
	Available  bool `json:"available"`
	Dirty      bool `json:"dirty"`
	Clean      bool `json:"clean"`
	Generation int  `json:"generation"`
}

// workspaceStatusSettings keep git from running anything the checkout or the user's configuration names while it
// reads the checkout.
var workspaceStatusSettings = []string{
	"-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", "-c", "credential.helper=",
	"-c", "protocol.allow=never", "-c", "core.untrackedCache=false",
}

// SampleWorkspace reads the checkout once with bounded, protected git calls that change nothing in it.
func SampleWorkspace(ctx context.Context, git string, folder string) WorkspaceStatus {
	status, err := protectedGit(ctx, git, folder, "status", "--porcelain=v1", "--untracked-files=normal")
	if err != nil {
		return WorkspaceStatus{}
	}
	commits, err := protectedGit(ctx, git, folder, "rev-list", "--count", "HEAD")
	if err != nil {
		return WorkspaceStatus{}
	}
	generation, err := strconv.Atoi(strings.TrimSpace(commits))
	if err != nil {
		return WorkspaceStatus{}
	}
	dirty := strings.TrimSpace(status) != ""
	return WorkspaceStatus{Available: true, Dirty: dirty, Clean: !dirty, Generation: generation}
}

// Reasons a sample of a connected root names when it has no HEAD to report.
const (
	UnbornRoot      = "unborn"
	UnavailableRoot = "unavailable"
)

// CommitObservation is the sample of a connected project's root: its git facts and, for the binding and checkout it
// was read for, the full verified HEAD object id, or the typed reason there is none.
type CommitObservation struct {
	WorkspaceStatus
	BindingID  string `json:"binding"`
	CheckoutID string `json:"checkout"`
	HeadOID    string `json:"head"`
	Reason     string `json:"reason,omitempty"`
}

// ObserveCommit reads a connected root once: its version 1 facts and its verified HEAD, or unborn for a
// repository with no commit yet and unavailable when the root cannot be read.
func ObserveCommit(ctx context.Context, git string, folder string, bindingID string, checkoutID string) CommitObservation {
	observation := CommitObservation{BindingID: bindingID, CheckoutID: checkoutID}
	if _, err := protectedGit(ctx, git, folder, "rev-parse", "--git-dir"); err != nil {
		observation.Reason = UnavailableRoot
		return observation
	}
	head, err := protectedGit(ctx, git, folder, "rev-parse", "--verify", "--quiet", "HEAD^{commit}")
	if err != nil {
		observation.Reason = UnbornRoot
		return observation
	}
	observation.WorkspaceStatus = SampleWorkspace(ctx, git, folder)
	observation.HeadOID = strings.TrimSpace(head)

	return observation
}

func protectedGit(ctx context.Context, git string, folder string, arguments ...string) (string, error) {
	command := exec.CommandContext(ctx, git, append(append([]string{"-C", folder}, workspaceStatusSettings...),
		arguments...)...)
	command.Env = []string{"GIT_CONFIG_NOSYSTEM=1", "GIT_CONFIG_GLOBAL=/dev/null", "GIT_TERMINAL_PROMPT=0",
		"GIT_OPTIONAL_LOCKS=0", "PATH=/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin"}
	output, err := command.Output()
	return string(output), err
}
