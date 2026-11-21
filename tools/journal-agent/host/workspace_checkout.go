package host

import (
	"context"
	"fmt"
	"strconv"
	"strings"
)

// checkoutSource is where the main's workspace volume is mounted, read-only, while a writer's checkout is cloned or
// compared with it.
const checkoutSource = "/source"

// checkoutSourceLabel names, on a checkout volume, the workspace volume it was cloned from.
const checkoutSourceLabel = "journal.checkout-source"

// checkoutTaken is printed by the comparison when the checkout holds nothing the main's workspace lacks.
const checkoutTaken = "taken"

// CheckoutVolume names a writer session's own checkout volume.
func (containers Containers) CheckoutVolume(session string) string {
	return string(containers.Rules.InstallationName) + "-checkout-" + session
}

// PrepareCheckout gives a writer session its own volume, bounded to quotaBytes, holding a self-contained clone of the
// main's workspace volume at the revision, made and checked as Workspaces.Prepare and Check make and check one, in a
// throwaway container with no network. A daemon that cannot bound a volume's size gets no checkout at all: it answers
// ErrWorkspaceQuotaUnavailable and creates nothing. A failed clone or check removes the volume it began.
func (containers Containers) PrepareCheckout(ctx context.Context, session, source, revision string, quotaBytes int) (string, error) {
	volume := containers.CheckoutVolume(session)
	create := containers.command(ctx, "volume", "create", "--label",
		installationLabel+"="+string(containers.Rules.InstallationName), "--label", checkoutSourceLabel+"="+source,
		"--opt", "size="+strconv.Itoa(quotaBytes), volume)
	if output, err := create.CombinedOutput(); err != nil {
		if strings.Contains(strings.ToLower(string(output)), "quota") {
			return "", fmt.Errorf("%w (asked for %d bytes)", ErrWorkspaceQuotaUnavailable, quotaBytes)
		}

		return "", fmt.Errorf("creating the checkout volume %s failed: %w", volume, err)
	}

	output, err := containers.runCheckWith(ctx, []string{
		"--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,mode=0700,uid=10001", "--env", "HOME=/tmp",
		"--env", "GIT_CONFIG_NOSYSTEM=1",
		"--mount", "type=volume,source=" + source + ",target=" + checkoutSource + ",readonly",
		"--mount", "type=volume,source=" + volume + ",target=" + workspaceTarget,
	}, "sh", "-c", checkoutScript(revision))
	if err == nil {
		return volume, nil
	}

	_ = containers.command(ctx, "volume", "rm", "--force", volume).Run()
	if refusal, named := folderRefusals[lastLine(output)]; named {
		return "", fmt.Errorf("%w: checkout %s", refusal, volume)
	}

	return "", fmt.Errorf("%w: checkout %s", ErrWorkspaceCloneFailed, volume)
}

// RemoveCheckout removes a writer session's checkout volume when the main's workspace it was cloned from holds its
// commit and it has no uncommitted change; otherwise it keeps the volume and answers its name, to be reported. A
// session that had no checkout counts as removed.
func (containers Containers) RemoveCheckout(ctx context.Context, session string) (string, error) {
	volume := containers.CheckoutVolume(session)
	source, err := containers.command(ctx, "volume", "inspect", "--format",
		`{{index .Labels "`+checkoutSourceLabel+`"}}`, volume).CombinedOutput()
	if err != nil {
		return "", absentIsDone(source, err)
	}

	output, _ := containers.runCheckWith(ctx, []string{
		"--mount", "type=volume,source=" + strings.TrimSpace(string(source)) + ",target=" + checkoutSource + ",readonly",
		"--mount", "type=volume,source=" + volume + ",target=" + workspaceTarget + ",readonly",
	}, "sh", "-c", takenScript())
	if lastLine(output) != checkoutTaken {
		return volume, nil
	}

	return "", absentIsDone(containers.command(ctx, "volume", "rm", volume).CombinedOutput())
}

// takenScript prints taken when the checkout is clean and the main's workspace holds its commit.
func takenScript() string {
	return strings.Join([]string{
		"[ -z \"$(git -C " + workspaceTarget + " status --porcelain)\" ] || exit 0",
		"commit=$(git -C " + workspaceTarget + " rev-parse HEAD) || exit 0",
		"git -C " + checkoutSource + " cat-file -e \"$commit^{commit}\" && echo " + checkoutTaken,
	}, "\n")
}

// checkoutScript clones the mounted main workspace with Prepare's steps, then runs the folder checks on the result.
func checkoutScript(revision string) string {
	clone := append([]string{"set -e"}, cloneSteps(checkoutSource, revision)...)

	return strings.Join(append(clone, "set +e", folderCheckScript(workspaceTarget)), "\n")
}

// lastLine is the last line printed, where a check names the one word of its refusal.
func lastLine(output string) string {
	lines := strings.Split(strings.TrimSpace(output), "\n")

	return strings.TrimSpace(lines[len(lines)-1])
}
