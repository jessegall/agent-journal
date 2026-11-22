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
	"time"

	"github.com/creack/pty"

	"journal-agent/screen"
	inputs "journal-agent/terminal"
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
	RuntimeID string `json:"runtime_id"`
	// Driver is the profile name of the driver the command runs, which its screen layout belongs to; the command
	// itself may be another, such as a docker attach to a contained session.
	Driver    string   `json:"driver"`
	Command   []string `json:"command"`
	Folder    string   `json:"folder"`
	Env       []string `json:"env"`
	ReadFiles []string `json:"read_files"`
	Rows      uint16   `json:"rows"`
	Columns   uint16   `json:"columns"`
}

// TerminalStarter starts the program of a runtime the host does not run yet; it returns the PTY.
type TerminalStarter func(request AttachRequest) (*os.File, error)

// AttachSocket lets a user's terminal attach to the programs the host runs: an owner-only Unix socket in the
// host's private folder. The host owns each program; a client that detaches leaves it running.
type AttachSocket struct {
	Folder    string
	Start     TerminalStarter
	Layout    LayoutFinder
	mutex     sync.Mutex
	terminals map[string]*hostTerminal
}

// LayoutFinder gives the screen layout of the program a request starts, from its profile.
type LayoutFinder func(request AttachRequest) (screen.Layout, error)

// hostTerminal is one program the host runs: its PTY, the screen read from its output, and the one gate every key
// passes through on its way in.
type hostTerminal struct {
	pty      *os.File
	reader   *screen.EmulatorReader
	layout   screen.Layout
	gate     *inputs.InputGate
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
	terminal.gate.LocalResized()
	terminal.resize(request.Rows, request.Columns)

	for {
		kind, payload, err := readFrame(connection)
		if err != nil {
			return
		}
		switch kind {
		case frameData:
			if err := terminal.gate.UserTyped(payload); err != nil {
				return
			}
		case frameResize:
			if len(payload) == 4 {
				terminal.gate.LocalResized()
				terminal.resize(binary.BigEndian.Uint16(payload[:2]), binary.BigEndian.Uint16(payload[2:]))
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
	layout, err := socket.Layout(request)
	if err != nil {
		return nil, err
	}
	reader, err := layout.NewReader(int(request.Columns), int(request.Rows), screen.DefaultLimits)
	if err != nil {
		return nil, err
	}
	file, err := socket.Start(request)
	if err != nil {
		return nil, err
	}
	gate := inputs.NewInputGate(file, reader, layout.Composer, time.Now)
	terminal := &hostTerminal{pty: file, reader: reader, layout: layout, gate: gate}
	socket.terminals[request.RuntimeID] = terminal
	go func() {
		terminal.copyOut()
		socket.forget(request.RuntimeID, terminal)
	}()
	return terminal, nil
}

// ScreenFor gives the screen of the runtime's program with the layout it is classified by, while the host runs it; a
// program that ended has none, and a relaunch gets a new one.
func (socket *AttachSocket) ScreenFor(runtimeID string) (RuntimeScreen, bool) {
	socket.mutex.Lock()
	defer socket.mutex.Unlock()
	terminal, found := socket.terminals[runtimeID]
	if !found {
		return RuntimeScreen{}, false
	}
	return RuntimeScreen{Reader: terminal.reader, Layout: terminal.layout}, true
}

// forget drops the runtime's terminal once its program ended, unless a relaunch already put a new one in its place.
func (socket *AttachSocket) forget(runtimeID string, ended *hostTerminal) {
	socket.mutex.Lock()
	defer socket.mutex.Unlock()
	if socket.terminals[runtimeID] == ended {
		delete(socket.terminals, runtimeID)
	}
}

// resize gives the program's terminal and the screen read from it the size of the attached window, so the screen
// keeps the grid the program draws on; a size the reader refuses leaves the reader as it was.
func (terminal *hostTerminal) resize(rows, columns uint16) {
	_ = pty.Setsize(terminal.pty, &pty.Winsize{Rows: rows, Cols: columns})
	_ = terminal.reader.Resize(int(columns), int(rows))
}

// Terminal is a program the host runs as a driver sees it: the screen read from its output and the one gate every
// key passes through, the user's included.
type Terminal struct {
	Reader *screen.EmulatorReader
	Gate   *inputs.InputGate
}

// Open starts the runtime's program on a PTY the host owns, or finds the one it already runs under the runtime's id,
// such as one a user attached first; a user may attach to it afterwards.
func (socket *AttachSocket) Open(request AttachRequest) (Terminal, error) {
	terminal, err := socket.terminalFor(request)
	if err != nil {
		return Terminal{}, err
	}

	return Terminal{Reader: terminal.reader, Gate: terminal.gate}, nil
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
			_ = terminal.reader.Feed(buffer[:count])
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
