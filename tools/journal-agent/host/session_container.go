package host

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"journal-agent/drivers/contracts"
)

// SessionContainer is the one container a contained session's program runs in, as its own process, under the name
// the journal gave it (the installation and the session), with a network of the same name. The host opens it once,
// attaches to its terminal, and attaches again after its own restart; a stop is proven and removes the container and
// its network while the session's volumes stay.
type SessionContainer struct {
	Containers Containers
	Name       string
	Labels     LaunchLabels
}

// StopSeconds bounds how long a session container's program gets to exit before Docker kills it.
const StopSeconds = 10

// ErrSessionContainerUnattachable refuses a session container whose manifest gives its program no terminal.
var ErrSessionContainerUnattachable = errors.New("a session's terminal program needs an attachable container")

// Open creates and starts the session's container running the process, or finds the one that already runs under
// its name, as after a restart of the host. Its terminal is then attached to with Containers.AttachTerminal.
func (container SessionContainer) Open(
	ctx context.Context,
	manifest ContainerManifest,
	process ContainerProcess,
) error {
	if !manifest.Attachable {
		return ErrSessionContainerUnattachable
	}

	running, err := container.Containers.IsRunning(ctx, container.Name)
	if err == nil && running {
		return nil
	}

	if err := container.Containers.EnsureNetwork(ctx, manifest.Network, container.Labels); err != nil {
		return err
	}

	if _, err := container.Containers.Create(ctx, manifest, container.Name, container.Labels, process); err != nil {
		return contracts.RefuseStart(
			contracts.RefusalContainerUnavailable,
			fmt.Errorf("creating the session container %s failed: %w", container.Name, err),
		)
	}

	if err := container.Containers.Start(ctx, container.Name); err != nil {
		return fmt.Errorf("starting the session container %s failed: %w", container.Name, err)
	}

	return nil
}

// ErrSessionContainerAttachable refuses a terminal manifest for a program run one turn at a time without a terminal.
var ErrSessionContainerAttachable = errors.New("a program without a terminal needs a container without one")

// Turn creates the session's container for one turn of a program without a terminal, the program its own process,
// and answers the turn, created and not yet started. The container of the turn before is removed first; the
// session's network and volumes, a writer's checkout too, stay.
func (container SessionContainer) Turn(
	ctx context.Context,
	manifest ContainerManifest,
	process ContainerProcess,
) (*ContainerTurn, error) {
	if manifest.Attachable {
		return nil, contracts.RefuseStart(contracts.RefusalContainerUnavailable, ErrSessionContainerAttachable)
	}

	if err := container.Containers.Remove(ctx, container.Name, StopSeconds); err != nil {
		return nil, fmt.Errorf("the session container %s of the turn before could not be removed: %w", container.Name, err)
	}

	if err := container.Containers.EnsureNetwork(ctx, manifest.Network, container.Labels); err != nil {
		return nil, err
	}

	if _, err := container.Containers.Create(ctx, manifest, container.Name, container.Labels, process); err != nil {
		return nil, contracts.RefuseStart(
			contracts.RefusalContainerUnavailable,
			fmt.Errorf("creating the session container %s failed: %w", container.Name, err),
		)
	}

	return &ContainerTurn{containers: container.Containers, name: container.Name}, nil
}

// RemoveCheckout removes a writer's checkout once the main's workspace holds its work, and answers the volume it
// kept otherwise, the place to recover the work from; a session without a checkout has nothing to remove.
func (container SessionContainer) RemoveCheckout(ctx context.Context, manifest ContainerManifest) (string, error) {
	source, found := manifest.CheckoutSource()
	if !found {
		return "", nil
	}

	return container.Containers.RemoveCheckout(ctx, container.Labels.Session, source)
}

// Stop stops the container with proof and removes it and its network; the session's volumes stay. A container
// already gone, which the daemon no longer finds, needs no stop.
func (container SessionContainer) Stop(ctx context.Context, network string) error {
	running, err := container.Containers.IsRunning(ctx, container.Name)
	if err == nil && running {
		if err := container.Containers.Stop(ctx, container.Name, StopSeconds); err != nil {
			return fmt.Errorf("the session container %s could not be proven stopped: %w", container.Name, err)
		}
	}

	return container.remove(ctx, network)
}

// remove takes the stopped container and its network away; either already gone counts as removed.
func (container SessionContainer) remove(ctx context.Context, network string) error {
	if err := container.Containers.Remove(ctx, container.Name, StopSeconds); err != nil {
		return err
	}

	return container.Containers.RemoveNetwork(ctx, network)
}

// ContainerExit is how a session container's program ended: its exit code, whether the kernel killed it for using
// more memory than its budget, and the last lines it printed.
type ContainerExit struct {
	Code        int
	OutOfMemory bool
	LastLines   string
}

// Evidence is the exit as the host reports it to the journal, with the program's own last lines as the reason when
// it printed any.
func (exit ContainerExit) Evidence() string {
	if exit.OutOfMemory {
		return "the session container was killed for using more memory than its budget"
	}

	evidence := "the session container's program exited with " + strconv.Itoa(exit.Code)
	if exit.LastLines == "" {
		return evidence
	}

	return evidence + ": " + exit.LastLines
}

// Wait waits until the container's program ends, answers how, and removes the container and its network.
func (container SessionContainer) Wait(ctx context.Context, network string) (ContainerExit, error) {
	exit, err := container.Containers.exitOf(ctx, container.Name)
	if err != nil {
		return ContainerExit{}, err
	}

	return exit, container.remove(ctx, network)
}
