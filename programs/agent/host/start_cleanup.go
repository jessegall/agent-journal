package host

import (
	"context"
	"strings"
	"time"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

// StartLabels name a container start's resources, so reconciliation finds exactly those of this installation and
// leaves every other container alone.
type StartLabels struct {
	Installation string `json:"installation"`
	// Start is the host's own id of the process, which the host sets and keeps with its saved plan; the journal's plan
	// leaves it out.
	Start   string `json:"start,omitempty"`
	Session string `json:"session"`
	// Account is the plain id of the account folder the container binds, so every container that binds an account's
	// folder can be found; empty for one that binds none.
	Account string `json:"account"`
}

const (
	installationLabel = "journal.installation"
	startLabel        = "journal.start"
	sessionLabel      = "journal.session"
	accountLabel      = "journal.account"
)

// asMap are the labels as the daemon takes them; the account's only when the container binds one.
func (labels StartLabels) asMap() map[string]string {
	named := map[string]string{
		installationLabel: labels.Installation,
		startLabel:        labels.Start,
		sessionLabel:      labels.Session,
	}
	if labels.Account != "" {
		named[accountLabel] = labels.Account
	}

	return named
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

// RemoveNetwork removes the start network; a network already gone counts as removed.
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
