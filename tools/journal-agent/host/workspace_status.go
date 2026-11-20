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

func protectedGit(ctx context.Context, git string, folder string, arguments ...string) (string, error) {
	command := exec.CommandContext(ctx, git, append(append([]string{"-C", folder}, workspaceStatusSettings...),
		arguments...)...)
	command.Env = []string{"GIT_CONFIG_NOSYSTEM=1", "GIT_CONFIG_GLOBAL=/dev/null", "GIT_TERMINAL_PROMPT=0",
		"GIT_OPTIONAL_LOCKS=0", "PATH=/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin"}
	output, err := command.Output()
	return string(output), err
}
