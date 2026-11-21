package host

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// DeployKeyFolder is where agent-host finds the compose secrets that hold each environment's deploy key.
var DeployKeyFolder = "/run/secrets"

// workspaceTarget is where a workspace volume is mounted, in the clone container as in every agent container.
const workspaceTarget = "/workspace"

var (
	// ErrRepositoryNotFound refuses a clone whose repository the host does not have.
	ErrRepositoryNotFound = errors.New("the workspace clone failed: repository not found")
	// ErrDeployKeyRefused refuses a clone the repository's host refused the deploy key for.
	ErrDeployKeyRefused = errors.New("the workspace clone failed: the deploy key was refused")
	// ErrRepositoryHostUnreachable refuses a clone whose repository host could not be reached.
	ErrRepositoryHostUnreachable = errors.New("the workspace clone failed: the repository's host is unreachable")
	// ErrWorkspaceCloneFailed refuses a clone that failed for another reason.
	ErrWorkspaceCloneFailed = errors.New("the workspace clone failed")
	// ErrDeployKeyMissing refuses a clone for an environment whose deploy key secret is not mounted.
	ErrDeployKeyMissing = errors.New("the environment has no deploy key secret")
)

// cloneFailures name a failed clone's cause from what git and ssh printed; the printed text itself never leaves.
var cloneFailures = []struct {
	signs []string
	err   error
}{
	{[]string{"Permission denied (publickey", "Host key verification failed"}, ErrDeployKeyRefused},
	{[]string{"Could not resolve hostname", "Connection timed out", "Connection refused", "Network is unreachable",
		"Could not resolve host"}, ErrRepositoryHostUnreachable},
	{[]string{"Repository not found", "does not appear to be a git repository", "not found"}, ErrRepositoryNotFound},
}

// ReadDeployKey reads the deploy key of the environment from its compose secret, deploy_key_<environment>.
func ReadDeployKey(environment string) ([]byte, error) {
	key, err := os.ReadFile(filepath.Join(DeployKeyFolder, "deploy_key_"+environment))
	if err != nil {
		return nil, fmt.Errorf("%w: deploy_key_%s", ErrDeployKeyMissing, environment)
	}

	return key, nil
}

// FillWorkspace fills the named workspace volume with a self-contained clone of the repository at the revision, the
// way Workspaces.Prepare makes one, from a throwaway container of the agent image on the agent daemon. The deploy key
// reaches that container on standard input only and lives in its private tmpfs for the one clone; it is never an
// argument, an environment value, a mount or part of the volume. A failed clone removes the volume it began.
func (containers Containers) FillWorkspace(ctx context.Context, volume, repository, revision string, deployKey []byte) error {
	if err := containers.command(ctx, "volume", "create", "--label",
		installationLabel+"="+string(containers.Rules.InstallationName), volume).Run(); err != nil {
		return fmt.Errorf("creating the workspace volume %s failed: %w", volume, err)
	}

	clone := containers.command(ctx, containers.cloneRun(volume, repository, revision)...)
	clone.Stdin = strings.NewReader(string(deployKey))
	output, err := clone.CombinedOutput()
	if err == nil {
		return nil
	}

	_ = containers.command(ctx, "volume", "rm", "--force", volume).Run()

	return cloneFailure(string(output))
}

// cloneRun runs the clone as the agent's user with every capability dropped, a read-only root, the workspace volume
// at /workspace and a private tmpfs for the key, then removes the container.
func (containers Containers) cloneRun(volume, repository, revision string) []string {
	arguments := []string{
		"run", "--rm", "--interactive", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
		"--user", agentUser, "--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,mode=0700,uid=10001",
		"--label", installationLabel + "=" + string(containers.Rules.InstallationName),
		"--mount", "type=volume,source=" + volume + ",target=" + workspaceTarget,
		"--env", "HOME=/tmp", "--env", "GIT_CONFIG_NOSYSTEM=1", "--env", "GIT_TERMINAL_PROMPT=0",
	}
	for _, proxy := range []string{"HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY"} {
		if value := os.Getenv(proxy); value != "" {
			arguments = append(arguments, "--env", proxy+"="+value)
		}
	}

	return append(arguments, "--entrypoint", "sh", containers.Rules.AgentImage, "-c", cloneScript(repository, revision))
}

// cloneScript keeps the key from standard input in the tmpfs, clones with Prepare's own steps and removes the hooks.
func cloneScript(repository, revision string) string {
	lines := []string{
		"set -e",
		"umask 077",
		"cat > /tmp/deploy_key",
		"export GIT_SSH_COMMAND='ssh -i /tmp/deploy_key -o IdentitiesOnly=yes -o BatchMode=yes " +
			"-o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/tmp/known_hosts'",
	}

	return strings.Join(append(append(lines, cloneSteps(repository, revision)...), "rm -f /tmp/deploy_key"), "\n")
}

// cloneSteps are Prepare's clone, checkout and hook removal as shell lines into the workspace target.
func cloneSteps(repository, revision string) []string {
	lines := []string{"git " + shellWords(cloneArguments(repository, workspaceTarget))}
	for _, step := range checkoutSteps(revision) {
		lines = append(lines, "git -C "+workspaceTarget+" "+shellWords(step))
	}

	return append(lines, "rm -rf "+workspaceTarget+"/.git/hooks")
}

// cloneFailure names a failed clone by its cause, never with what was printed.
func cloneFailure(output string) error {
	for _, failure := range cloneFailures {
		for _, sign := range failure.signs {
			if strings.Contains(output, sign) {
				return failure.err
			}
		}
	}

	return ErrWorkspaceCloneFailed
}

// shellWords quotes each word for sh.
func shellWords(words []string) string {
	quoted := make([]string, len(words))
	for index, word := range words {
		quoted[index] = "'" + strings.ReplaceAll(word, "'", `'\''`) + "'"
	}

	return strings.Join(quoted, " ")
}
