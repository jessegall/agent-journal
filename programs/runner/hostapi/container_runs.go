package hostapi

import (
	"context"

	"journal-runner/host"
)

// errNoDaemon refuses an instruction about containers on a host that runs none.
const errNoDaemon = "this host runs no containers"

// RunContainers runs each container the journal describes to its end, in order, and answers each one's exit code and
// output; it stops at the first that could not run at all.
func (table *ProcessTable) RunContainers(ctx context.Context, _ Instruction, plan ContainerRuns) (ContainerRunResults, error) {
	if table.containers.Daemon == nil {
		return ContainerRunResults{}, RefusalError{Refusal: Unsafe, Reason: errNoDaemon}
	}

	results := []host.ContainerRunResult{}
	for _, run := range plan.Runs {
		result, err := table.containers.RunToEnd(ctx, run)
		if err != nil {
			return ContainerRunResults{Results: results}, refusalOf(err)
		}
		results = append(results, result)
	}

	return ContainerRunResults{Results: results}, nil
}

// ListContainers answers the names of the containers that carry the label with its value.
func (table *ProcessTable) ListContainers(ctx context.Context, _ Instruction, label host.ContainerLabel) (ContainerNames, error) {
	if table.containers.Daemon == nil {
		return ContainerNames{Names: []string{}}, nil
	}

	names, err := table.containers.NamesWithLabel(ctx, label)
	if err != nil {
		return ContainerNames{}, RefusalError{Refusal: Unsafe, Reason: "the Docker daemon could not be asked: " + err.Error()}
	}

	return ContainerNames{Names: names}, nil
}

// InstallationContainers are the names of every container of this installation on the daemon, running or not, for the
// inventory, so the journal removes each one no live process of its own holds; a host that runs no containers has none.
func (table *ProcessTable) InstallationContainers(ctx context.Context) ([]string, error) {
	if table.containers.Daemon == nil {
		return []string{}, nil
	}

	return table.containers.InstallationNames(ctx)
}

// RemoveImage removes the image by its reference; one already gone counts as removed.
func (table *ProcessTable) RemoveImage(ctx context.Context, _ Instruction, removal ImageRemoval) (Empty, error) {
	if table.containers.Daemon == nil {
		return Empty{}, nil
	}

	return Empty{}, table.containers.RemoveImage(ctx, removal.Image)
}

// RemoveNetwork removes the network by its name; one already gone counts as removed.
func (table *ProcessTable) RemoveNetwork(ctx context.Context, _ Instruction, removal NetworkRemoval) (Empty, error) {
	if table.containers.Daemon == nil {
		return Empty{}, nil
	}

	return Empty{}, table.containers.RemoveNetwork(ctx, removal.Network)
}
