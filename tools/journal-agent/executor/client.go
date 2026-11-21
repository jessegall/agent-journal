package executor

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net"
)

// SocketPath is where the executor listens inside a protected-account container.
const SocketPath = "/run/journal-exec/exec.sock"

// ErrRefused is a request the executor refused before starting anything; the error names its reason.
var ErrRefused = errors.New("the executor refused the command")

// Request is what the program may ask for: command data, a working folder in the workspace and a terminal or not.
type Request struct {
	Command string
	Cwd     string
	Tty     bool
	Rows    uint16
	Cols    uint16
}

// Streams are where the command's input comes from and its output goes, and the resizes and signals to pass on.
type Streams struct {
	Stdin   io.Reader
	Stdout  io.Writer
	Stderr  io.Writer
	Resizes <-chan [2]uint16
	Signals <-chan string
}

// Exit is how the command ended: its code, or the signal that ended it.
type Exit struct {
	Code   int
	Signal string
}

// Client is one connection to the executor, which runs one command.
type Client struct {
	conn *net.UnixConn
}

// Dial connects to the executor's socket.
func Dial(ctx context.Context, path string) (*Client, error) {
	var dialer net.Dialer
	conn, err := dialer.DialContext(ctx, "unix", path)
	if err != nil {
		return nil, err
	}

	return &Client{conn: conn.(*net.UnixConn)}, nil
}

// Run asks for the command, streams its input, resizes and signals and its output, and answers how it ended. A
// cancelled context closes the connection, which stops the command's whole group.
func (client *Client) Run(ctx context.Context, request Request, streams Streams) (Exit, error) {
	defer client.conn.Close()
	if err := WriteFrame(client.conn, Frame{Type: FrameRequest, Command: request.Command, Cwd: request.Cwd,
		Tty: request.Tty, Rows: request.Rows, Cols: request.Cols}); err != nil {
		return Exit{}, err
	}

	stop := context.AfterFunc(ctx, func() { _ = client.conn.Close() })
	defer stop()
	go client.sendInput(streams)

	for {
		frame, err := ReadFrame(client.conn)
		if err != nil {
			return Exit{}, fmt.Errorf("the executor's answer ended: %w", err)
		}

		switch frame.Type {
		case FrameStdout:
			_, _ = streams.Stdout.Write(frame.Data)
		case FrameStderr:
			_, _ = streams.Stderr.Write(frame.Data)
		case FrameRefused:
			return Exit{}, fmt.Errorf("%w: %s", ErrRefused, frame.Reason)
		case FrameExit:
			return Exit{Code: frame.Code, Signal: frame.Signal}, nil
		}
	}
}

// sendInput passes the input, then its end, and every resize and signal, until the connection closes.
func (client *Client) sendInput(streams Streams) {
	frames := make(chan Frame)
	if streams.Stdin != nil {
		go readInput(streams.Stdin, frames)
	}

	for {
		var frame Frame
		select {
		case frame = <-frames:
		case size, open := <-streams.Resizes:
			if !open {
				streams.Resizes = nil
				continue
			}
			frame = Frame{Type: FrameResize, Rows: size[0], Cols: size[1]}
		case signal, open := <-streams.Signals:
			if !open {
				streams.Signals = nil
				continue
			}
			frame = Frame{Type: FrameSignal, Signal: signal}
		}

		if WriteFrame(client.conn, frame) != nil {
			return
		}
	}
}

// readInput turns the input into stdin frames and one eof frame at its end.
func readInput(input io.Reader, frames chan<- Frame) {
	buffer := make([]byte, 32*1024)
	for {
		read, err := input.Read(buffer)
		if read > 0 {
			frames <- Frame{Type: FrameStdin, Data: append([]byte(nil), buffer[:read]...)}
		}
		if err != nil {
			frames <- Frame{Type: FrameEOF}
			return
		}
	}
}
