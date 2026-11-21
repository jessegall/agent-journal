package host

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"
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
// its name, as after a restart of the host, and answers the command that attaches to its terminal.
func (container SessionContainer) Open(
	ctx context.Context,
	manifest ContainerManifest,
	process ContainerProcess,
) ([]string, error) {
	if !manifest.Attachable {
		return nil, ErrSessionContainerUnattachable
	}

	running, err := container.Containers.IsRunning(ctx, container.Name)
	if err == nil && running {
		return container.attachCommand(ctx), nil
	}

	if err := container.Containers.EnsureNetwork(ctx, manifest.Network, container.Labels); err != nil {
		return nil, err
	}

	if _, err := container.Containers.Create(ctx, manifest, container.Name, container.Labels, process); err != nil {
		return nil, fmt.Errorf("creating the session container %s failed: %w", container.Name, err)
	}

	if err := container.Containers.Start(ctx, container.Name); err != nil {
		return nil, fmt.Errorf("starting the session container %s failed: %w", container.Name, err)
	}

	return container.attachCommand(ctx), nil
}

// attachCommand is the attach as the host's terminal runs it, the docker client first.
func (container SessionContainer) attachCommand(ctx context.Context) []string {
	attach := container.Containers.Attach(ctx, container.Name)

	return append([]string{attach.Path}, attach.Args[1:]...)
}

// Stop stops the container with proof and removes it and its network; the session's volumes stay. A container
// already gone, which docker inspect no longer finds, needs no stop.
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

// ContainerExit is how a session container's program ended: its exit code and whether the kernel killed it for
// using more memory than its budget.
type ContainerExit struct {
	Code        int
	OutOfMemory bool
}

// Evidence is the exit as the host reports it to the journal.
func (exit ContainerExit) Evidence() string {
	if exit.OutOfMemory {
		return "the session container was killed for using more memory than its budget"
	}

	return "the session container's program exited with " + strconv.Itoa(exit.Code)
}

// Wait waits until the container's program ends, answers how, and removes the container and its network.
func (container SessionContainer) Wait(ctx context.Context, network string) (ContainerExit, error) {
	output, err := container.Containers.command(ctx, "wait", container.Name).Output()
	if err != nil {
		return ContainerExit{}, err
	}

	code, err := strconv.Atoi(strings.TrimSpace(string(output)))
	if err != nil {
		return ContainerExit{}, fmt.Errorf("docker wait answered %q: %w", strings.TrimSpace(string(output)), err)
	}

	killed, _ := container.Containers.command(ctx, "inspect", "--format", "{{.State.OOMKilled}}", container.Name).Output()
	exit := ContainerExit{Code: code, OutOfMemory: strings.TrimSpace(string(killed)) == "true"}

	return exit, container.remove(ctx, network)
}
