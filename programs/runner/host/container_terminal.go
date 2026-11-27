package host

import (
	"context"
	"fmt"
	"io"
	"sync"

	"github.com/moby/moby/client"
)

// containerTerminal is a session container's own terminal, reached through the daemon: what the program prints is
// read from the attachment, what is typed is written to it, and its size is the container terminal's.
type containerTerminal struct {
	containers Containers
	id         string
	attached   client.ContainerAttachResult
	mutex      sync.Mutex
	rows       uint16
	columns    uint16
}

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

// AttachTerminal attaches to the terminal of the running container with that id and gives it the size. Closing the
// attachment leaves the container's program running.
func (containers Containers) AttachTerminal(ctx context.Context, id string, rows, columns uint16) (TerminalStream, error) {
	attached, err := containers.Daemon.ContainerAttach(ctx, id, client.ContainerAttachOptions{
		Stream: true, Stdin: true, Stdout: true, Stderr: true,
	})
	if err != nil {
		return nil, fmt.Errorf("attaching to the session container %s failed: %w", id, err)
	}

	terminal := &containerTerminal{containers: containers, id: id, attached: attached}
	if err := terminal.Resize(rows, columns); err != nil {
		attached.Close()

		return nil, fmt.Errorf("sizing the terminal of the session container %s failed: %w", id, err)
	}

	return terminal, nil
}

func (terminal *containerTerminal) Read(buffer []byte) (int, error) {
	return terminal.attached.Reader.Read(buffer)
}

func (terminal *containerTerminal) Write(typed []byte) (int, error) {
	return terminal.attached.Conn.Write(typed)
}

// Close ends the attachment; the container's program runs on.
func (terminal *containerTerminal) Close() error {
	terminal.attached.Close()

	return nil
}

// Resize gives the container's terminal the size, which the program then draws on.
func (terminal *containerTerminal) Resize(rows, columns uint16) error {
	_, err := terminal.containers.Daemon.ContainerResize(context.Background(), terminal.id, client.ContainerResizeOptions{
		Height: uint(rows), Width: uint(columns),
	})
	if err != nil {
		return err
	}

	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()
	terminal.rows, terminal.columns = rows, columns

	return nil
}

// Size is the size the container's terminal was last given.
func (terminal *containerTerminal) Size() (uint16, uint16, error) {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()

	return terminal.rows, terminal.columns, nil
}
