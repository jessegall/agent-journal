package host

import (
	"context"

	"github.com/moby/moby/client"
)

// ExitOf waits until the container's program ends and answers how, as Docker tells it: its exit code, whether the
// kernel killed it for its memory, and the last lines of its log, as many lines and at most as many of their last
// bytes as asked, as they were printed.
func (containers Containers) ExitOf(ctx context.Context, name string, lines int, most int) (ContainerExit, error) {
	code, err := containers.exitCodeOf(ctx, name)
	if err != nil {
		return ContainerExit{}, err
	}

	inspected, err := containers.Daemon.ContainerInspect(ctx, name, client.ContainerInspectOptions{})
	if err != nil {
		return ContainerExit{}, err
	}

	described := inspected.Container
	hasTerminal := described.Config != nil && described.Config.Tty

	return ContainerExit{
		Code:        code,
		OutOfMemory: described.State != nil && described.State.OOMKilled,
		LastPrinted: containers.lastPrinted(ctx, name, hasTerminal, lines, most),
	}, nil
}

// ContainerExit is how a container's program ended: its exit code, whether the kernel killed it for using more memory
// than its budget, and the last lines of its log.
type ContainerExit struct {
	Code        int
	OutOfMemory bool
	LastPrinted string
}
