package host

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// ErrBrokerRefused is returned for a Git operation a child may not ask of the broker: a reader's change, a path
// outside the child's checkout, or a commit whose ref no longer points at the expected old commit.
var ErrBrokerRefused = errors.New("the Git broker refuses this operation")

// brokerSettings switch off everything in a repository or a user's configuration that would run a program with
// the broker's powers: hooks, filters, an external diff, a pager, an editor, credential helpers and fsmonitor.
var brokerSettings = []string{
	"-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", "-c", "core.pager=cat", "-c", "core.editor=true",
	"-c", "diff.external=", "-c", "credential.helper=", "-c", "protocol.allow=never", "-c", "core.attributesFile=/dev/null",
	"-c", "filter.lfs.process=", "-c", "filter.lfs.smudge=", "-c", "filter.lfs.clean=", "-c", "gpg.program=true",
	"-c", "commit.gpgSign=false",
}

// GitBroker carries out a child's fixed Git operations in its own checkout, so the child never runs Git with the
// repository's or the user's programs. A reader may only inspect.
type GitBroker struct {
	Checkout string
	Writes   bool
	Git      string
}

// Status is the checkout's porcelain status.
func (broker GitBroker) Status(ctx context.Context) (string, error) {
	return broker.run(ctx, "status", "--porcelain=v1", "--untracked-files=normal")
}

// Diff is the checkout's diff against its HEAD, with no external diff and no text conversion.
func (broker GitBroker) Diff(ctx context.Context) (string, error) {
	return broker.run(ctx, "diff", "--no-ext-diff", "--no-textconv", "HEAD")
}

// Stage stages the child's own paths; a reader stages nothing and no path may leave the checkout.
func (broker GitBroker) Stage(ctx context.Context, paths []string) error {
	if !broker.Writes {
		return fmt.Errorf("%w: a reader only inspects", ErrBrokerRefused)
	}
	for _, path := range paths {
		absolute := filepath.Join(broker.Checkout, path)
		if !filepath.IsLocal(path) || !strings.HasPrefix(absolute, broker.Checkout+string(filepath.Separator)) {
			return fmt.Errorf("%w: %s is outside the checkout", ErrBrokerRefused, path)
		}
	}
	_, err := broker.run(ctx, append([]string{"add", "--"}, paths...)...)

	return err
}

// Commit commits the staged change on the expected ref after checking it still points at the expected old commit,
// and answers the verified new commit.
func (broker GitBroker) Commit(ctx context.Context, ref string, oldOID string, message string) (string, error) {
	if !broker.Writes {
		return "", fmt.Errorf("%w: a reader only inspects", ErrBrokerRefused)
	}
	current, err := broker.run(ctx, "rev-parse", "--verify", ref)
	if err != nil {
		return "", err
	}
	if strings.TrimSpace(current) != oldOID {
		return "", fmt.Errorf("%w: %s no longer points at %s", ErrBrokerRefused, ref, oldOID)
	}
	tree, err := broker.run(ctx, "write-tree")
	if err != nil {
		return "", err
	}
	commit, err := broker.run(ctx, "commit-tree", strings.TrimSpace(tree), "-p", oldOID, "-m", message)
	if err != nil {
		return "", err
	}
	newOID := strings.TrimSpace(commit)
	if _, err := broker.run(ctx, "update-ref", ref, newOID, oldOID); err != nil {
		return "", err
	}

	return broker.Verified(ctx, ref)
}

// Verified is the commit the ref points at, verified by Git.
func (broker GitBroker) Verified(ctx context.Context, ref string) (string, error) {
	oid, err := broker.run(ctx, "rev-parse", "--verify", ref+"^{commit}")

	return strings.TrimSpace(oid), err
}

func (broker GitBroker) run(ctx context.Context, arguments ...string) (string, error) {
	command := exec.CommandContext(ctx, broker.Git, append(append([]string{"-C", broker.Checkout}, brokerSettings...), arguments...)...)
	command.Env = []string{"GIT_CONFIG_GLOBAL=/dev/null", "GIT_CONFIG_NOSYSTEM=1", "GIT_TERMINAL_PROMPT=0",
		"GIT_OPTIONAL_LOCKS=0", "GIT_AUTHOR_NAME=journal", "GIT_AUTHOR_EMAIL=journal@localhost",
		"GIT_COMMITTER_NAME=journal", "GIT_COMMITTER_EMAIL=journal@localhost",
		"PATH=/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin"}
	var failure bytes.Buffer
	command.Stderr = &failure
	output, err := command.Output()
	if err != nil {
		return "", fmt.Errorf("git %s failed: %w: %s", arguments[0], err, failure.String())
	}

	return string(output), nil
}
