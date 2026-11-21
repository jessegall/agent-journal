package host

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

// ErrWorktreeMismatch is returned when Git's registry does not hold the worktree the receipts promise: another
// path, branch or base. A similar folder is never adopted.
var ErrWorktreeMismatch = errors.New("the linked worktree is not the one the claim recorded")

// WorktreeClaim is one child's claim for a linked worktree of a connected root: the claim and generation, the
// child, whether it writes, and the verified base commit, all from the journal's ids.
type WorktreeClaim struct {
	ClaimID    string `json:"claim"`
	Generation int    `json:"generation"`
	ChildID    string `json:"child"`
	Writes     bool   `json:"writes"`
	BaseOID    string `json:"base"`
}

// WorktreeReceipt is what the preparer recorded of one claim: the intent before Git ran, then its completion.
type WorktreeReceipt struct {
	WorktreeClaim
	Path     string `json:"path"`
	Branch   string `json:"branch,omitempty"`
	Complete bool   `json:"complete"`
	// RuntimeID and StartKey name the child's runtime and its process start once one runs in the worktree, so a
	// cleanup or a restart maps the claim to the process, not only to the folder.
	RuntimeID string `json:"runtime,omitempty"`
	StartKey  string `json:"start,omitempty"`
}

// NativeWorktrees prepares real linked worktrees of a connected root under .journal/worktrees/<child>, for the
// local-project arrangement; the contained path keeps its own checkouts.
type NativeWorktrees struct {
	Root string
	Git  string
}

// Prepare makes the claim's linked worktree once: under a lock on the repository's common directory it writes the
// intent receipt, runs git worktree add (a branch journal/worker/<child> for a writer, a detached checkout for a
// reader), checks Git registered exactly that path at exactly the base, excludes the private metadata and records
// the completion. A repeated claim answers its first worktree; one whose intent Git cannot confirm is refused.
func (worktrees NativeWorktrees) Prepare(ctx context.Context, claim WorktreeClaim) (WorktreeReceipt, error) {
	common, err := worktrees.git(ctx, worktrees.Root, "rev-parse", "--path-format=absolute", "--git-common-dir")
	if err != nil {
		return WorktreeReceipt{}, err
	}
	unlock, err := lockFile(filepath.Join(strings.TrimSpace(common), "journal-worktrees.lock"))
	if err != nil {
		return WorktreeReceipt{}, err
	}
	defer unlock()

	receipt := worktrees.receiptFor(claim)
	if earlier, err := worktrees.readReceipt(claim); err == nil {
		if earlier.Complete {
			return earlier, nil
		}
		receipt = earlier
	} else if err := worktrees.writeReceipt(receipt); err != nil {
		return WorktreeReceipt{}, err
	}

	if !worktrees.isRegistered(ctx, receipt.Path) {
		if _, err := worktrees.git(ctx, worktrees.Root, worktrees.addArguments(receipt)...); err != nil {
			return WorktreeReceipt{}, err
		}
	}
	if err := worktrees.confirm(ctx, receipt); err != nil {
		return WorktreeReceipt{}, err
	}
	if err := worktrees.excludePrivateMetadata(receipt.Path); err != nil {
		return WorktreeReceipt{}, err
	}

	receipt.Complete = true

	return receipt, worktrees.writeReceipt(receipt)
}

// RecordRuntime keeps on the claim's completed receipt the runtime and process start that run in its worktree.
func (worktrees NativeWorktrees) RecordRuntime(receipt WorktreeReceipt, runtimeID string, startKey string) error {
	receipt.RuntimeID = runtimeID
	receipt.StartKey = startKey

	return worktrees.writeReceipt(receipt)
}

func (worktrees NativeWorktrees) receiptFor(claim WorktreeClaim) WorktreeReceipt {
	receipt := WorktreeReceipt{WorktreeClaim: claim, Path: filepath.Join(worktrees.Root, ".journal", "worktrees", claim.ChildID)}
	if claim.Writes {
		receipt.Branch = "journal/worker/" + claim.ChildID
	}

	return receipt
}

// addArguments is the git worktree add argv, built in Go from the claim's ids and local paths only.
func (worktrees NativeWorktrees) addArguments(receipt WorktreeReceipt) []string {
	if receipt.Branch == "" {
		return []string{"worktree", "add", "--detach", receipt.Path, receipt.BaseOID}
	}

	return []string{"worktree", "add", "-b", receipt.Branch, receipt.Path, receipt.BaseOID}
}

// isRegistered is whether Git's registry lists a worktree at exactly this path.
func (worktrees NativeWorktrees) isRegistered(ctx context.Context, path string) bool {
	listed, err := worktrees.git(ctx, worktrees.Root, "worktree", "list", "--porcelain", "-z")
	if err != nil {
		return false
	}
	for _, field := range strings.Split(listed, "\x00") {
		if field == "worktree "+path {
			return true
		}
	}

	return false
}

// confirm refuses a worktree Git does not list at the path or whose HEAD is not the base.
func (worktrees NativeWorktrees) confirm(ctx context.Context, receipt WorktreeReceipt) error {
	if !worktrees.isRegistered(ctx, receipt.Path) {
		return fmt.Errorf("%w: %s is not registered", ErrWorktreeMismatch, receipt.Path)
	}
	head, err := worktrees.git(ctx, receipt.Path, "rev-parse", "--verify", "HEAD")
	if err != nil || strings.TrimSpace(head) != receipt.BaseOID {
		return fmt.Errorf("%w: %s is not at %s", ErrWorktreeMismatch, receipt.Path, receipt.BaseOID)
	}

	return nil
}

// excludePrivateMetadata keeps the worktree's private journal files out of Git in that worktree.
func (worktrees NativeWorktrees) excludePrivateMetadata(path string) error {
	info, err := worktrees.git(context.Background(), path, "rev-parse", "--path-format=absolute", "--git-path", "info/exclude")
	if err != nil {
		return err
	}
	exclude := strings.TrimSpace(info)
	existing, _ := os.ReadFile(exclude)
	if bytes.Contains(existing, []byte("/.journal/")) {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(exclude), 0o755); err != nil {
		return err
	}
	file, err := os.OpenFile(exclude, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	defer file.Close()
	_, err = file.WriteString("/.journal/\n")

	return err
}

func (worktrees NativeWorktrees) receiptPath(claim WorktreeClaim) string {
	return filepath.Join(worktrees.Root, ".journal", "receipts", fmt.Sprintf("%s-%d.json", claim.ClaimID, claim.Generation))
}

func (worktrees NativeWorktrees) readReceipt(claim WorktreeClaim) (WorktreeReceipt, error) {
	content, err := os.ReadFile(worktrees.receiptPath(claim))
	if err != nil {
		return WorktreeReceipt{}, err
	}
	var receipt WorktreeReceipt

	return receipt, json.Unmarshal(content, &receipt)
}

func (worktrees NativeWorktrees) writeReceipt(receipt WorktreeReceipt) error {
	return writePrivateJSON(worktrees.receiptPath(receipt.WorktreeClaim), receipt)
}

// git runs one git command in the folder with the user's configuration and the repository's hooks kept out.
func (worktrees NativeWorktrees) git(ctx context.Context, folder string, arguments ...string) (string, error) {
	command := exec.CommandContext(ctx, worktrees.Git, append([]string{"-C", folder, "-c", "core.hooksPath=/dev/null"}, arguments...)...)
	command.Env = []string{"GIT_CONFIG_GLOBAL=/dev/null", "GIT_CONFIG_NOSYSTEM=1", "GIT_TERMINAL_PROMPT=0",
		"PATH=/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin"}
	var failure bytes.Buffer
	command.Stderr = &failure
	output, err := command.Output()
	if err != nil {
		return "", fmt.Errorf("git %s failed: %w: %s", strings.Join(arguments, " "), err, failure.String())
	}

	return string(output), nil
}

// lockFile holds an exclusive lock on the file until the returned unlock runs.
func lockFile(path string) (func(), error) {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, secretFileMode)
	if err != nil {
		return nil, err
	}
	if err := syscall.Flock(int(file.Fd()), syscall.LOCK_EX); err != nil {
		file.Close()
		return nil, err
	}

	return func() {
		_ = syscall.Flock(int(file.Fd()), syscall.LOCK_UN)
		file.Close()
	}, nil
}

// Outcomes of a worktree cleanup, each with the reason it was decided.
const (
	CleanupRemoved   = "removed"
	CleanupKept      = "kept"
	CleanupAmbiguous = "ambiguous"
)

// WorktreeCleanup is what cleaning up one child's checkout did: removed, kept with a reason, or left alone as
// ambiguous when no receipt of this journal owns the path. It names the native checkout, never a container.
type WorktreeCleanup struct {
	Outcome string `json:"outcome"`
	Path    string `json:"path"`
	Branch  string `json:"branch,omitempty"`
	Reason  string `json:"reason,omitempty"`
}

// Cleanup removes the claim's worktree only when its completed receipt owns the path, no lease is active, the
// checkout is clean and its tip is reachable from the target or the owner chose removal; otherwise it keeps it
// with the reason. An unowned linked worktree is reported ambiguous and left alone; nothing is force-removed.
func (worktrees NativeWorktrees) Cleanup(
	ctx context.Context,
	claim WorktreeClaim,
	leaseActive bool,
	target string,
	ownerChoseRemoval bool,
) WorktreeCleanup {
	receipt, err := worktrees.readReceipt(claim)
	if err != nil || !receipt.Complete || !worktrees.isRegistered(ctx, receipt.Path) {
		return WorktreeCleanup{Outcome: CleanupAmbiguous, Path: worktrees.receiptFor(claim).Path,
			Reason: "no completed receipt of this journal owns this worktree"}
	}
	kept := WorktreeCleanup{Outcome: CleanupKept, Path: receipt.Path, Branch: receipt.Branch}
	if leaseActive {
		kept.Reason = "the child still holds its lease"
		return kept
	}
	status, err := worktrees.git(ctx, receipt.Path, "status", "--porcelain")
	if err != nil || strings.TrimSpace(status) != "" {
		kept.Reason = "the checkout has uncommitted work"
		return kept
	}
	if !ownerChoseRemoval && !worktrees.isReachable(ctx, receipt.Path, target) {
		kept.Reason = "its commit is not reachable from " + target
		return kept
	}
	if _, err := worktrees.git(ctx, worktrees.Root, "worktree", "remove", receipt.Path); err != nil {
		kept.Reason = "git worktree remove refused: " + err.Error()
		return kept
	}

	return WorktreeCleanup{Outcome: CleanupRemoved, Path: receipt.Path, Branch: receipt.Branch}
}

// isReachable is whether the checkout's HEAD is an ancestor of the target ref.
func (worktrees NativeWorktrees) isReachable(ctx context.Context, path string, target string) bool {
	head, err := worktrees.git(ctx, path, "rev-parse", "--verify", "HEAD")
	if err != nil {
		return false
	}
	_, err = worktrees.git(ctx, worktrees.Root, "merge-base", "--is-ancestor", strings.TrimSpace(head), target)

	return err == nil
}
