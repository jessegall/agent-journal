package host

import (
	"context"
	"strings"
	"time"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

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

// LabelledContainer is a container the host made, found by its own label: its id, its labels and whether it still
// runs.
type LabelledContainer struct {
	ID      string
	Labels  map[string]string
	Running bool
}

// Labelled lists every container, running or not, that the host of this installation made.
func (containers Containers) Labelled(ctx context.Context) ([]LabelledContainer, error) {
	listed, err := containers.withLabel(ctx, runnerLabel, string(containers.Rules.InstallationName))
	if err != nil {
		return nil, err
	}

	var found []LabelledContainer
	for _, listedContainer := range listed {
		found = append(found, LabelledContainer{
			ID:      listedContainer.ID,
			Labels:  listedContainer.Labels,
			Running: listedContainer.State == container.StateRunning,
		})
	}

	return found, nil
}

// NamesWithLabel are the names of every container on the daemon, running or not yet removed, that carries the label
// with that value.
func (containers Containers) NamesWithLabel(ctx context.Context, label ContainerLabel) ([]string, error) {
	listed, err := containers.withLabel(ctx, label.Name, label.Value)
	if err != nil {
		return nil, err
	}

	names := []string{}
	for _, listedContainer := range listed {
		for _, name := range listedContainer.Names {
			names = append(names, strings.TrimPrefix(name, "/"))
		}
	}

	return names, nil
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
