package host

import (
	"context"
	"errors"
	"fmt"
	"journal-agent/shellwords"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"

	"github.com/moby/moby/api/types/mount"
	"github.com/moby/moby/client"
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

// secretName is a compose secret's name as the operator writes it: letters, digits, dashes and underscores.
var secretName = regexp.MustCompile(`^[A-Za-z0-9_-]+$`)

// ReadDeployKey reads an environment's deploy key from the compose secret of that name, such as deploy_key_main.
func ReadDeployKey(secret string) ([]byte, error) {
	if !secretName.MatchString(secret) {
		return nil, fmt.Errorf("%w: %q", ErrDeployKeyMissing, secret)
	}

	key, err := os.ReadFile(filepath.Join(DeployKeyFolder, secret))
	if err != nil {
		return nil, fmt.Errorf("%w: %s", ErrDeployKeyMissing, secret)
	}

	return key, nil
}

// PrepareWorkspace makes the workspace ready before a container mounts it: an operator's folder is checked at every
// start, a Git workspace's volume is filled the first time and left as it is once it exists. A refusal is named and
// nothing is created; a manifest without a preparation, as a local one, needs nothing.
func (containers Containers) PrepareWorkspace(ctx context.Context, preparation *WorkspacePreparation) error {
	if preparation == nil {
		return nil
	}

	if preparation.Clone == nil {
		_, err := containers.CheckFolder(ctx, preparation.Folder)
		return err
	}

	clone := preparation.Clone
	if !containers.Rules.permitsSource(ContainerMount{Type: MountVolume, Source: clone.Volume}) {
		return ErrManifestUnsafe
	}

	if containers.hasVolume(ctx, clone.Volume) {
		return nil
	}

	key, err := ReadDeployKey(clone.DeployKeySecret)
	if err != nil {
		return err
	}

	return containers.FillWorkspace(ctx, clone.Volume, clone.Repository, clone.Revision, key)
}

// FillWorkspace fills the named workspace volume with a self-contained clone of the repository at the revision, the
// way Workspaces.Prepare makes one, from a throwaway container of the agent image on the agent daemon. The deploy key
// reaches that container on standard input only and lives in its private tmpfs for the one clone; it is never an
// argument, an environment value, a mount or part of the volume. A failed clone removes the volume it began.
func (containers Containers) FillWorkspace(ctx context.Context, volume, repository, revision string, deployKey []byte) error {
	labels := map[string]string{installationLabel: string(containers.Rules.InstallationName)}
	if _, err := containers.Daemon.VolumeCreate(ctx, client.VolumeCreateOptions{Name: volume, Labels: labels}); err != nil {
		return fmt.Errorf("creating the workspace volume %s failed: %w", volume, err)
	}

	output, err := containers.runCheck(ctx, containers.cloneRun(volume, repository, revision, deployKey))
	if err == nil {
		return nil
	}

	_ = containers.removeVolume(ctx, volume, true)

	return cloneFailure(output)
}

// cloneEnvironment keeps git in a clone container to its private tmpfs and off the image's own settings.
var cloneEnvironment = []string{"HOME=/tmp", "GIT_CONFIG_NOSYSTEM=1"}

// cloneTmpfs is a clone container's private folder in memory, the agent user's alone, where nothing can be run.
var cloneTmpfs = map[string]string{"/tmp": "rw,noexec,nosuid,mode=0700,uid=10001"}

// cloneRun is the clone as the agent's user with every capability dropped, a read-only root, the workspace volume at
// /workspace, a private tmpfs for the key, the daemon's network to reach the repository, and the key on its standard
// input alone.
func (containers Containers) cloneRun(volume, repository, revision string, deployKey []byte) throwaway {
	environment := append(slices.Clone(cloneEnvironment), "GIT_TERMINAL_PROMPT=0")
	for _, proxy := range []string{"HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY"} {
		if value := os.Getenv(proxy); value != "" {
			environment = append(environment, proxy+"="+value)
		}
	}

	return throwaway{
		Program:      "sh",
		Arguments:    []string{"-c", cloneScript(repository, revision)},
		Environment:  environment,
		ReadOnlyRoot: true,
		Tmpfs:        cloneTmpfs,
		Mounts:       []mount.Mount{volumeMount(volume, workspaceTarget, true)},
		HasNetwork:   true,
		Input:        deployKey,
	}
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
	lines := []string{"git " + shellwords.Quoted(cloneArguments(repository, workspaceTarget)...)}
	for _, step := range checkoutSteps(revision) {
		lines = append(lines, "git -C "+workspaceTarget+" "+shellwords.Quoted(step...))
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
