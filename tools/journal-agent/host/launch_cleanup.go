package host

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

// LaunchLabels name a container launch's resources, so reconciliation finds exactly those of this installation and
// leaves every other container alone.
type LaunchLabels struct {
	Installation string
	Launch       string
	Session      string
	// Account is the plain id of the account folder the container binds, so every container that binds an account's
	// folder can be found; empty for one that binds none.
	Account string
}

const (
	installationLabel = "journal.installation"
	launchLabel       = "journal.launch"
	sessionLabel      = "journal.session"
	accountLabel      = "journal.account"
)

// asMap are the labels as the daemon takes them; the account's only when the container binds one.
func (labels LaunchLabels) asMap() map[string]string {
	named := map[string]string{
		installationLabel: labels.Installation,
		launchLabel:       labels.Launch,
		sessionLabel:      labels.Session,
	}
	if labels.Account != "" {
		named[accountLabel] = labels.Account
	}

	return named
}

// CleanupStep mirrors App\Agents\Enums\CleanupStep: one transient resource of an ended launch.
type CleanupStep string

const (
	CleanupContainer CleanupStep = "container"
	CleanupNetwork   CleanupStep = "network"
	CleanupRuntime   CleanupStep = "runtime"
)

// PendingCleanup mirrors one entry of the journal's pending cleanups: the ended launch's session and what is left.
type PendingCleanup struct {
	SessionID string        `json:"session_id"`
	Remaining []CleanupStep `json:"remaining"`
}

// CleanupReport mirrors what the host reports of one pass: what it removed or found gone, the dirty workspace it
// kept, and why a deletion failed.
type CleanupReport struct {
	Removed       []CleanupStep `json:"removed"`
	KeptWorkspace string        `json:"kept_workspace,omitempty"`
	Failure       string        `json:"failure,omitempty"`
}

// LaunchCleanup removes an ended launch's container, launch network and ephemeral runtime folder. The workspace and
// its named volumes are never among them, and no account is touched.
type LaunchCleanup struct {
	Containers     Containers
	Installation   InstallationName
	RuntimeFolders string
	StopSeconds    int
}

// CleanUp removes what the pending cleanup still lists, the container first, since its network and folder are in
// use until it is gone. Something already gone counts as removed, so a second pass changes nothing more; the first
// failure ends the pass and is reported, to be retried.
func (cleanup LaunchCleanup) CleanUp(ctx context.Context, pending PendingCleanup) CleanupReport {
	report := CleanupReport{Removed: []CleanupStep{}}
	name := cleanup.Installation.ResourceName(pending.SessionID)
	removals := map[CleanupStep]func() error{
		CleanupContainer: func() error { return cleanup.Containers.Remove(ctx, name, cleanup.StopSeconds) },
		CleanupNetwork:   func() error { return cleanup.Containers.RemoveNetwork(ctx, name) },
		CleanupRuntime: func() error {
			return os.RemoveAll(filepath.Join(cleanup.RuntimeFolders, filepath.Base(pending.SessionID)))
		},
	}
	for _, step := range []CleanupStep{CleanupContainer, CleanupNetwork, CleanupRuntime} {
		if !containsStep(pending.Remaining, step) {
			continue
		}
		if err := removals[step](); err != nil {
			report.Failure = fmt.Sprintf("removing the %s failed: %v", step, err)
			return report
		}
		report.Removed = append(report.Removed, step)
	}
	return report
}

func containsStep(steps []CleanupStep, wanted CleanupStep) bool {
	for _, step := range steps {
		if step == wanted {
			return true
		}
	}
	return false
}

// Remove stops the container within the bound and removes it with its anonymous volumes, which Docker refuses while
// it still runs, so a removal confirms its processes exited; a container already gone counts as removed.
func (containers Containers) Remove(ctx context.Context, name string, stopSeconds int) error {
	_, err := containers.Daemon.ContainerStop(ctx, name, client.ContainerStopOptions{Timeout: &stopSeconds})
	if err != nil {
		return absentIsDone(err)
	}

	err = containers.removeStopped(ctx, name)
	for tries := 0; err != nil && strings.Contains(err.Error(), removalUnderWay) && tries < removalTries; tries++ {
		time.Sleep(removalPause)
		err = containers.removeStopped(ctx, name)
	}

	return absentIsDone(err)
}

// removeStopped removes a container that does not run, with its anonymous volumes.
func (containers Containers) removeStopped(ctx context.Context, name string) error {
	_, err := containers.Daemon.ContainerRemove(ctx, name, client.ContainerRemoveOptions{RemoveVolumes: true})

	return err
}

// removalUnderWay is how Docker refuses to remove a container another caller is removing at that moment, such as a
// stop and the watch of the container's exit both cleaning up: the removal is asked for again after a pause, until
// the container is gone, and not failed on.
const removalUnderWay = "is already in progress"

const (
	removalPause = 250 * time.Millisecond
	removalTries = 40
)

// RemoveNetwork removes the launch network; a network already gone counts as removed.
func (containers Containers) RemoveNetwork(ctx context.Context, name string) error {
	_, err := containers.Daemon.NetworkRemove(ctx, name, client.NetworkRemoveOptions{})

	return absentIsDone(err)
}

// LabelledContainer is a container of this installation found by its labels: its id, the session it runs and whether
// it still runs.
type LabelledContainer struct {
	ID      string
	Session string
	Running bool
}

// Labelled lists every container, running or not, that carries this installation's label.
func (containers Containers) Labelled(ctx context.Context, installation string) ([]LabelledContainer, error) {
	listed, err := containers.withLabel(ctx, installationLabel, installation)
	if err != nil {
		return nil, err
	}

	var found []LabelledContainer
	for _, listedContainer := range listed {
		found = append(found, LabelledContainer{
			ID:      listedContainer.ID,
			Session: listedContainer.Labels[sessionLabel],
			Running: listedContainer.State == container.StateRunning,
		})
	}

	return found, nil
}

// withLabel lists every container, running or not, that carries the label with that value.
func (containers Containers) withLabel(ctx context.Context, label, value string) ([]container.Summary, error) {
	listed, err := containers.Daemon.ContainerList(ctx, client.ContainerListOptions{
		All:     true,
		Filters: make(client.Filters).Add("label", label+"="+value),
	})
	if err != nil {
		return nil, err
	}

	return listed.Items, nil
}

// BindsAccount is whether any container on the daemon, running or not yet removed, carries the label of the account
// folder with that plain id.
func (containers Containers) BindsAccount(ctx context.Context, folder string) (bool, error) {
	listed, err := containers.withLabel(ctx, accountLabel, folder)
	if err != nil {
		return true, err
	}

	return len(listed) > 0, nil
}

// OrphanOutcome is what reconciliation concluded about one container no running execution of this host owns.
type OrphanOutcome struct {
	Session string
	Outcome Reconciliation
}

// SweepOrphans fences every container of this installation that no execution of this host runs: it is stopped,
// confirmed exited and removed. One whose exit cannot be confirmed stays needing attention, possibly still running,
// and is never reported idle. Containers without this installation's label are never touched.
func SweepOrphans(
	ctx context.Context,
	containers Containers,
	installation string,
	runsHere func(session string) bool,
	stopSeconds int,
) ([]OrphanOutcome, error) {
	found, err := containers.Labelled(ctx, installation)
	if err != nil {
		return nil, err
	}
	var outcomes []OrphanOutcome
	for _, container := range found {
		if runsHere(container.Session) {
			continue
		}
		outcome := Exited
		if containers.Remove(ctx, container.ID, stopSeconds) != nil {
			outcome = NeedsAttention
		}
		outcomes = append(outcomes, OrphanOutcome{Session: container.Session, Outcome: outcome})
	}
	return outcomes, nil
}

// CleanupJournal is the journal's side of launch cleanups: the ones this host still owes, and each pass's report.
type CleanupJournal interface {
	PendingCleanups(ctx context.Context, answer any) error
	ReportCleanup(ctx context.Context, sessionID string, report any) error
}

// RunPending makes one pass over every cleanup the journal says this host owes and reports each; a pass that
// failed is reported with its failure and offered again by the journal on the next round.
func (cleanup LaunchCleanup) RunPending(ctx context.Context, journal CleanupJournal) error {
	var answer struct {
		Pending []PendingCleanup `json:"pending"`
	}
	if err := journal.PendingCleanups(ctx, &answer); err != nil {
		return err
	}
	for _, pending := range answer.Pending {
		if err := journal.ReportCleanup(ctx, pending.SessionID, cleanup.CleanUp(ctx, pending)); err != nil {
			return err
		}
	}
	return nil
}
