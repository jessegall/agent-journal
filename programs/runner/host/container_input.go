package host

import (
	"context"
	"fmt"
	"io"

	"github.com/moby/moby/client"
)

// AttachInput attaches to the standard input of the running container with that id, which has no terminal: what is
// written goes to its program, and closing it ends that input while the program runs on.
func (containers Containers) AttachInput(ctx context.Context, id string) (io.WriteCloser, error) {
	attached, err := containers.Daemon.ContainerAttach(ctx, id, client.ContainerAttachOptions{Stream: true, Stdin: true})
	if err != nil {
		return nil, fmt.Errorf("attaching to the input of the container %s failed: %w", id, err)
	}
	return containerInput{attached: attached}, nil
}

// containerInput is the standard input of a container without a terminal, reached through the daemon.
type containerInput struct {
	attached client.ContainerAttachResult
}

func (input containerInput) Write(written []byte) (int, error) {
	return input.attached.Conn.Write(written)
}

// Close ends the input the program reads, as a closed pipe does.
func (input containerInput) Close() error {
	return input.attached.CloseWrite()
}
