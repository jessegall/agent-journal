package host

import (
	"context"
	"strings"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

// Remove stops the container within the bound and removes it with its anonymous volumes; a container already gone
// counts as removed, as removing it again leaves it as absent as the first time. A removal Docker refuses is answered
// as it refused it, for the journal to ask again.
func (containers Containers) Remove(ctx context.Context, name string, stopSeconds int) error {
	if _, err := containers.Daemon.ContainerStop(ctx, name, client.ContainerStopOptions{Timeout: &stopSeconds}); err != nil {
		return absentIsDone(err)
	}

	_, err := containers.Daemon.ContainerRemove(ctx, name, client.ContainerRemoveOptions{RemoveVolumes: true})

	return absentIsDone(err)
}

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
