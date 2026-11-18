package host

import (
	"bytes"
	"encoding/binary"
	"encoding/json"
	"errors"
	"io"
	"net"
	"os"
	"path/filepath"
	"sync"

	"github.com/creack/pty"
)

// The frames on the attach socket: a byte naming the frame, four bytes of length, then the payload.
const (
	frameData   byte = 'd'
	frameResize byte = 'r'
	socketName       = "attach.sock"
)

// AttachRequest is the first line a client sends: which runtime to show, and how to start it when the host does not
// run it yet.
type AttachRequest struct {
	RuntimeID string   `json:"runtime_id"`
	Command   []string `json:"command"`
	Folder    string   `json:"folder"`
	Env       []string `json:"env"`
	Rows      uint16   `json:"rows"`
	Columns   uint16   `json:"columns"`
}

// TerminalStarter starts the program of a runtime the host does not run yet; it returns the PTY.
type TerminalStarter func(request AttachRequest) (*os.File, error)

// AttachSocket lets a person's terminal attach to the programs the host runs: an owner-only Unix socket in the
// host's private folder. The host owns each program; a client that detaches leaves it running.
type AttachSocket struct {
	Folder    string
	Start     TerminalStarter
	mutex     sync.Mutex
	terminals map[string]*hostTerminal
}

type hostTerminal struct {
	pty      *os.File
	mutex    sync.Mutex
	attached io.Writer
}

// Path is where the socket listens.
func (socket *AttachSocket) Path() string { return filepath.Join(socket.Folder, socketName) }

// Listen opens the socket with owner-only permissions and serves clients until the listener closes.
func (socket *AttachSocket) Listen() (net.Listener, error) {
	if err := os.MkdirAll(socket.Folder, stateFolderMode); err != nil {
		return nil, err
	}
	_ = os.Remove(socket.Path())
	listener, err := net.Listen("unix", socket.Path())
	if err != nil {
		return nil, err
	}
	if err := os.Chmod(socket.Path(), secretFileMode); err != nil {
		listener.Close()
		return nil, err
	}
	socket.terminals = map[string]*hostTerminal{}
	go func() {
		for {
			connection, err := listener.Accept()
			if err != nil {
				return
			}
			go socket.serve(connection)
		}
	}()
	return listener, nil
}

func (socket *AttachSocket) serve(connection net.Conn) {
	defer connection.Close()
	var request AttachRequest
	if err := json.NewDecoder(io.LimitReader(firstLine(connection), 1<<16)).Decode(&request); err != nil {
		return
	}
	terminal, err := socket.terminalFor(request)
	if err != nil {
		writeFrame(connection, frameData, []byte("journal-agent: "+err.Error()+"\r\n"))
		return
	}
	terminal.attach(connection)
	defer terminal.attach(nil)
	_ = pty.Setsize(terminal.pty, &pty.Winsize{Rows: request.Rows, Cols: request.Columns})

	for {
		kind, payload, err := readFrame(connection)
		if err != nil {
			return
		}
		switch kind {
		case frameData:
			if _, err := terminal.pty.Write(payload); err != nil {
				return
			}
		case frameResize:
			if len(payload) == 4 {
				_ = pty.Setsize(terminal.pty, &pty.Winsize{Rows: binary.BigEndian.Uint16(payload[:2]), Cols: binary.BigEndian.Uint16(payload[2:])})
			}
		}
	}
}

func (socket *AttachSocket) terminalFor(request AttachRequest) (*hostTerminal, error) {
	socket.mutex.Lock()
	defer socket.mutex.Unlock()
	if terminal, found := socket.terminals[request.RuntimeID]; found {
		return terminal, nil
	}
	file, err := socket.Start(request)
	if err != nil {
		return nil, err
	}
	terminal := &hostTerminal{pty: file}
	socket.terminals[request.RuntimeID] = terminal
	go terminal.copyOut()
	return terminal, nil
}

func (terminal *hostTerminal) attach(client io.Writer) {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()
	terminal.attached = client
}

// copyOut sends the program's output to whoever is attached; with nobody attached it is read and dropped, so the
// program never blocks on a full terminal.
func (terminal *hostTerminal) copyOut() {
	buffer := make([]byte, 32*1024)
	for {
		count, err := terminal.pty.Read(buffer)
		if count > 0 {
			terminal.mutex.Lock()
			if terminal.attached != nil {
				writeFrame(terminal.attached, frameData, buffer[:count])
			}
			terminal.mutex.Unlock()
		}
		if err != nil {
			return
		}
	}
}

// WriteAttachRequest, WriteKeys and WriteResize are the client's side of the protocol.
func WriteAttachRequest(writer io.Writer, request AttachRequest) error {
	content, err := json.Marshal(request)
	if err != nil {
		return err
	}
	_, err = writer.Write(append(content, '\n'))
	return err
}

func WriteKeys(writer io.Writer, keys []byte) error { return writeFrame(writer, frameData, keys) }

func WriteResize(writer io.Writer, rows, columns uint16) error {
	payload := make([]byte, 4)
	binary.BigEndian.PutUint16(payload[:2], rows)
	binary.BigEndian.PutUint16(payload[2:], columns)
	return writeFrame(writer, frameResize, payload)
}

// ReadOutput copies the program's output frames to out until the host closes the connection.
func ReadOutput(reader io.Reader, out io.Writer) error {
	for {
		kind, payload, err := readFrame(reader)
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return err
		}
		if kind == frameData {
			if _, err := out.Write(payload); err != nil {
				return err
			}
		}
	}
}

func writeFrame(writer io.Writer, kind byte, payload []byte) error {
	header := make([]byte, 5)
	header[0] = kind
	binary.BigEndian.PutUint32(header[1:], uint32(len(payload)))
	if _, err := writer.Write(append(header, payload...)); err != nil {
		return err
	}
	return nil
}

func readFrame(reader io.Reader) (byte, []byte, error) {
	header := make([]byte, 5)
	if _, err := io.ReadFull(reader, header); err != nil {
		return 0, nil, err
	}
	payload := make([]byte, binary.BigEndian.Uint32(header[1:]))
	_, err := io.ReadFull(reader, payload)
	return header[0], payload, err
}

// firstLine reads up to the first newline byte by byte, so nothing after it is taken from the connection.
func firstLine(reader io.Reader) io.Reader {
	line := []byte{}
	one := make([]byte, 1)
	for {
		if _, err := reader.Read(one); err != nil || one[0] == '\n' {
			break
		}
		line = append(line, one[0])
	}
	return bytes.NewReader(line)
}
