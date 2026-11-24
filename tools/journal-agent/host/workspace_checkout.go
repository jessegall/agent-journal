package host

import (
	"context"
	"fmt"
	"slices"
	"strings"

	"github.com/moby/moby/api/types/mount"
	"github.com/moby/moby/client"
)

// checkoutSource is where the main's workspace volume is mounted, read-only, while a writer's checkout is cloned or
// compared with it.
const checkoutSource = "/source"

// checkoutSourceLabel names, on a checkout volume, the workspace volume it was cloned from.
const checkoutSourceLabel = "journal.checkout-source"

// checkoutRevision is where a writer's checkout starts: the commit the main's workspace has checked out now.
const checkoutRevision = "HEAD"

// checkoutTaken is printed by the comparison when the checkout holds nothing the main's workspace lacks.
const checkoutTaken = "taken"

// CheckoutVolume names a writer session's own checkout volume.
func (containers Containers) CheckoutVolume(session string) string {
	return string(containers.Rules.InstallationName) + "-checkout-" + session
}

// PrepareCheckout gives a writer session its own volume, bounded to quotaBytes, holding a self-contained clone of the
// main's workspace, its volume or server folder, at the revision, made and checked as Workspaces.Prepare and Check
// make and check one, in a throwaway container with no network. A daemon that cannot bound a volume's size gets no
// checkout at all: it answers ErrWorkspaceQuotaUnavailable and creates nothing. A failed clone or check removes the
// volume it began.
func (containers Containers) PrepareCheckout(
	ctx context.Context,
	session string,
	source ContainerMount,
	revision string,
	quotaBytes int,
) (string, error) {
	volume := containers.CheckoutVolume(session)
	labels := map[string]string{
		installationLabel:   string(containers.Rules.InstallationName),
		checkoutSourceLabel: source.Source,
	}
	if err := containers.createBoundedVolume(ctx, volume, labels, quotaBytes); err != nil {
		return "", err
	}

	output, err := containers.runCheck(ctx, throwaway{
		Program:      "sh",
		Arguments:    []string{"-c", checkoutScript(revision)},
		Environment:  cloneEnvironment,
		ReadOnlyRoot: true,
		Tmpfs:        cloneTmpfs,
		Mounts:       []mount.Mount{source.readOnlyAt(checkoutSource), volumeMount(volume, workspaceTarget, true)},
	})
	if err == nil {
		return volume, nil
	}

	_ = containers.removeVolume(ctx, volume, true)
	if refusal, named := folderRefusals[lastLine(output)]; named {
		return "", fmt.Errorf("%w: checkout %s", refusal, volume)
	}

	return "", fmt.Errorf("%w: checkout %s", ErrWorkspaceCloneFailed, volume)
}

// RemoveCheckout removes a writer session's checkout volume when the main's workspace it was cloned from holds its
// commit and it has no uncommitted change; otherwise it keeps the volume and answers its name, to be reported. A
// session that had no checkout counts as removed.
func (containers Containers) RemoveCheckout(ctx context.Context, session string, source ContainerMount) (string, error) {
	volume := containers.CheckoutVolume(session)
	if _, err := containers.Daemon.VolumeInspect(ctx, volume, client.VolumeInspectOptions{}); err != nil {
		return "", absentIsDone(err)
	}

	output, _ := containers.runScript(ctx, takenScript(),
		source.readOnlyAt(checkoutSource), volumeMount(volume, workspaceTarget, false))
	if lastLine(output) != checkoutTaken {
		return volume, nil
	}

	return "", absentIsDone(containers.removeVolume(ctx, volume, false))
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

// ensureCheckout answers the writer session's checkout volume, cloning it from the workspace mount the first time;
// a later turn or a restart finds the one already made, with the writer's work in it.
func (containers Containers) ensureCheckout(ctx context.Context, session string, source ContainerMount, quotaBytes int) (string, error) {
	if !containers.Rules.permitsSource(source) || source.Target != workspaceTarget {
		return "", ErrManifestUnsafe
	}

	volume := containers.CheckoutVolume(session)
	if containers.hasVolume(ctx, volume) {
		return volume, nil
	}

	return containers.PrepareCheckout(ctx, session, source, checkoutRevision, quotaBytes)
}

// withCheckout is the manifest with a writer's workspace mount replaced by its own checkout volume, read-write at the
// same target, which ensureCheckout makes first; a manifest without a checkout is answered as it is.
func (containers Containers) withCheckout(ctx context.Context, manifest ContainerManifest, session string) (ContainerManifest, error) {
	mounts := slices.Clone(manifest.Mounts)
	for index, mount := range mounts {
		if !mount.IsCheckout {
			continue
		}

		volume, err := containers.ensureCheckout(ctx, session, mount, manifest.Budgets.WorkspaceBytes)
		if err != nil {
			return ContainerManifest{}, err
		}

		mounts[index] = ContainerMount{Type: MountVolume, Source: volume, Target: mount.Target, IsWritable: true}
	}

	manifest.Mounts = mounts

	return manifest, nil
}

// CheckoutSource is the workspace mount a writer's checkout was cloned from, and whether the manifest has one.
func (manifest ContainerManifest) CheckoutSource() (ContainerMount, bool) {
	index := slices.IndexFunc(manifest.Mounts, func(mount ContainerMount) bool { return mount.IsCheckout })
	if index < 0 {
		return ContainerMount{}, false
	}

	return manifest.Mounts[index], true
}

// lastLine is the last line printed, where a check names the one word of its refusal.
func lastLine(output string) string {
	lines := strings.Split(strings.TrimSpace(output), "\n")

	return strings.TrimSpace(lines[len(lines)-1])
}
