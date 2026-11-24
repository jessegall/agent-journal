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
	"strings"
	"sync"
	"time"

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
	// ConversationID is the conversation the host started the program on, which its bootstrap proves to the journal.
	ConversationID string `json:"conversation_id,omitempty"`
	// Driver is the profile name of the driver the runtime runs, which its screen layout belongs to. A contained
	// session has no command here: its terminal is its container's own, named by ContainerInstance.
	Driver    string   `json:"driver"`
	Command   []string `json:"command"`
	Folder    string   `json:"folder"`
	Env       []string `json:"env"`
	ReadFiles []string `json:"read_files"`
	Rows      uint16   `json:"rows"`
	Columns   uint16   `json:"columns"`
	// ContainerInstance is the verified id of the session container the command attaches to; empty for a program
	// the host runs itself.
	ContainerInstance string `json:"container_instance"`
}

// TerminalStarter starts the program of a runtime the host does not run yet, or attaches to the session container
// that runs it; it returns the program's terminal.
type TerminalStarter func(request AttachRequest) (TerminalStream, error)

// AttachSocket lets a user's terminal attach to the programs the host runs: an owner-only Unix socket in the
// host's private folder. The host owns each program; a client that detaches leaves it running.
type AttachSocket struct {
	Folder    string
	Start     TerminalStarter
	Layout    LayoutFinder
	mutex     sync.Mutex
	terminals map[string]*hostTerminal
	// InstanceRuns says whether a container instance still runs; with it, a contained attachment that ended while its
	// container runs is a lost connection rather than an end. Nil on a host that runs no containers.
	InstanceRuns func(instance string) bool
	// lost names the container instance of each runtime whose attachment ended, until the runtime opens again.
	lost map[string]string
}

// LayoutFinder gives the screen layout of the program a request starts, from its profile.
type LayoutFinder func(request AttachRequest) (screen.Layout, error)

// hostTerminal is one program the host runs: its terminal, the screen read from its output, and the one gate every key
// passes through on its way in.
type hostTerminal struct {
	stream   TerminalStream
	reader   *screen.EmulatorReader
	layout   screen.Layout
	gate     *inputs.InputGate
	mutex    sync.Mutex
	attached io.Writer
	// connection is the identity of the local connection attached now; only it writes and resizes, and only its own
	// close detaches it.
	connection     uint64
	lastConnection uint64
	// barrier closes every output sink of this program before private entry; the local mirror is one of them.
	barrier        *inputs.CaptureBarrier
	mirrorSilenced bool
	// private is the isolated fresh parser that reads the program's output while the barrier is closed, with no
	// export, mirror or recording; endConfirmed and cleared say the driver ended the private operation and the
	// program has since cleared the whole screen, which together allow a verified public redraw.
	private      *screen.EmulatorReader
	endConfirmed bool
	cleared      bool
	// incarnation rises each time the fresh parser is promoted, so the watcher starts a new stream.
	incarnation uint64
	// attachment names this attachment of the runtime, new for every one, and containerInstance the verified
	// container it attaches to; a grant is scoped to both.
	attachment        string
	containerInstance string
}

// privateNotice is what a local terminal is told when its keys, resize or attach meet private entry; it carries no
// payload.
const privateNotice = "\r\n[journal-agent: a private entry is in progress; nothing you typed was sent]\r\n"

// fullClear is the sequence that erases the whole screen, which a verified public redraw starts with.
const fullClear = "\x1b[2J"

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
	socket.lost = map[string]string{}
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
	if terminal.barrier.IsClosed() {
		terminal.gate.LocalResized()
		writeFrame(connection, frameData, []byte(privateNotice))

		return
	}
	identity := terminal.attach(connection)
	defer terminal.detach(identity)
	terminal.gate.LocalResized()
	terminal.resize(request.Rows, request.Columns)

	for {
		kind, payload, err := readFrame(connection)
		if err != nil {
			return
		}
		if !terminal.isActive(identity) {
			continue
		}
		if terminal.barrier.IsClosed() {
			terminal.gate.LocalResized()
			writeFrame(connection, frameData, []byte(privateNotice))

			continue
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
	stream, err := socket.Start(request)
	if err != nil {
		return nil, err
	}
	gate := inputs.NewInputGate(stream, reader, layout.Composer, time.Now)
	barrier := inputs.NewCaptureBarrier()
	attachment, err := randomName()
	if err != nil {
		return nil, err
	}
	terminal := &hostTerminal{
		stream:            stream,
		reader:            reader,
		layout:            layout,
		gate:              gate,
		barrier:           barrier,
		attachment:        attachment,
		containerInstance: request.ContainerInstance,
	}
	delete(socket.lost, request.RuntimeID)
	gate.ResizeWith(terminal.resizeForBrowser)
	barrier.Register("local mirror", inputs.CaptureSinkFunc(terminal.silenceMirror))
	// The screen watcher asks the barrier before every capture and exports only the shield while it is closed.
	barrier.Register("screen watcher", inputs.CaptureSinkFunc(func() bool { return true }))
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
	terminal.mutex.Lock()
	incarnation := terminal.incarnation
	terminal.mutex.Unlock()
	runtimeScreen := RuntimeScreen{
		Reader:            terminal.reader,
		Layout:            terminal.layout,
		Gate:              terminal.gate,
		Barrier:           terminal.barrier,
		Incarnation:       incarnation,
		Attachment:        terminal.attachment,
		ContainerInstance: terminal.containerInstance,
	}

	return runtimeScreen, true
}

// forget drops the runtime's terminal once its program ended, unless a relaunch already put a new one in its place;
// a contained attachment that ended is remembered as lost, with its container instance.
func (socket *AttachSocket) forget(runtimeID string, ended *hostTerminal) {
	socket.mutex.Lock()
	defer socket.mutex.Unlock()
	if socket.terminals[runtimeID] != ended {
		return
	}
	delete(socket.terminals, runtimeID)
	if ended.containerInstance != "" {
		socket.lost[runtimeID] = ended.containerInstance
	}
}

// LostConnection is whether the runtime's contained attachment ended while its container instance still runs: a
// lost terminal connection, not the end of the session. It only looks; nothing starts or repairs a container.
func (socket *AttachSocket) LostConnection(runtimeID string) bool {
	socket.mutex.Lock()
	instance, lost := socket.lost[runtimeID]
	runs := socket.InstanceRuns
	socket.mutex.Unlock()

	return lost && runs != nil && runs(instance)
}

// resize gives the program's terminal and the screen read from it the size of the attached window, so the screen
// keeps the grid the program draws on; a size the reader refuses leaves the reader as it was.
func (terminal *hostTerminal) resize(rows, columns uint16) {
	_ = terminal.stream.Resize(rows, columns)
	_ = terminal.reader.Resize(int(columns), int(rows))
}

// resizeForBrowser gives the terminal and the screen a browser writer's size, bounded by the screen's limits, and says
// the size achieved; when either refuses, both go back to the size they had.
func (terminal *hostTerminal) resizeForBrowser(rows, columns int) (int, int, error) {
	limits := screen.DefaultLimits
	rows, columns = min(max(rows, 1), limits.MaxRows), min(max(columns, 1), limits.MaxColumns)
	rowsBefore, columnsBefore, err := terminal.stream.Size()
	if err != nil {
		return 0, 0, err
	}
	if err := terminal.stream.Resize(uint16(rows), uint16(columns)); err != nil {
		return 0, 0, err
	}
	if err := terminal.reader.Resize(columns, rows); err != nil {
		_ = terminal.stream.Resize(rowsBefore, columnsBefore)

		return 0, 0, err
	}

	return rows, columns, nil
}

// Terminal is a program the host runs as a driver sees it: the screen read from its output and the one gate every
// key passes through, the user's included.
type Terminal struct {
	Reader *screen.EmulatorReader
	Gate   *inputs.InputGate
	// Hangup ends the program from outside its input: it closes the terminal the host holds, so no key, draft or Enter is
	// ever sent to stop it.
	Hangup func() error
	// EnterPrivate closes the capture barrier for a private entry and says whether every sink confirmed;
	// ConfirmPrivateEnd is the driver's word that it ended, after which only a verified public redraw reopens it.
	EnterPrivate      func() bool
	ConfirmPrivateEnd func()
	// Attachment names this attachment, which a browser grant is scoped to.
	Attachment string
}

// Open starts the runtime's program on a terminal the host holds, or finds the one it already runs under the runtime's id,
// such as one a user attached first; a user may attach to it afterwards.
func (socket *AttachSocket) Open(request AttachRequest) (Terminal, error) {
	terminal, err := socket.terminalFor(request)
	if err != nil {
		return Terminal{}, err
	}

	return Terminal{
		Reader:            terminal.reader,
		Gate:              terminal.gate,
		Attachment:        terminal.attachment,
		Hangup:            terminal.stream.Close,
		EnterPrivate:      terminal.enterPrivate,
		ConfirmPrivateEnd: terminal.confirmPrivateEnd,
	}, nil
}

// attach makes the client the active local connection and gives its identity; a newer attach replaces it.
func (terminal *hostTerminal) attach(client io.Writer) uint64 {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()
	terminal.lastConnection++
	terminal.attached, terminal.connection = client, terminal.lastConnection

	return terminal.connection
}

// detach clears the attached connection only when it is still the one with this identity, so a retired
// connection's close never clears its successor.
func (terminal *hostTerminal) detach(identity uint64) {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()
	if terminal.connection != identity {
		return
	}
	terminal.attached, terminal.connection = nil, 0
}

// isActive is whether the connection with this identity is the one attached now.
func (terminal *hostTerminal) isActive(identity uint64) bool {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()

	return terminal.connection == identity
}

// copyOut sends the program's output to whoever is attached; with nobody attached it is read and dropped, so the
// program never blocks on a full terminal.
func (terminal *hostTerminal) copyOut() {
	buffer := make([]byte, 32*1024)
	for {
		count, err := terminal.stream.Read(buffer)
		if count > 0 && terminal.feedPrivate(buffer[:count]) {
			continue
		}
		if count > 0 {
			_ = terminal.reader.Feed(buffer[:count])
			terminal.closeOnSecretEcho()
			terminal.mutex.Lock()
			if terminal.attached != nil && !terminal.mirrorSilenced {
				writeFrame(terminal.attached, frameData, buffer[:count])
			}
			terminal.mutex.Unlock()
		}
		if err != nil {
			return
		}
	}
}

// closeOnSecretEcho closes the capture barrier at its source when the screen asks for a secret nobody announced,
// before the chunk that drew it leaves through any sink.
func (terminal *hostTerminal) closeOnSecretEcho() {
	if terminal.barrier.IsClosed() || !terminal.layout.AsksForSecret(terminal.reader.Snapshot()) {
		return
	}
	terminal.enterPrivate()
}

// enterPrivate closes the barrier and starts the isolated fresh parser that reads the program while it is closed;
// it says whether every sink confirmed.
func (terminal *hostTerminal) enterPrivate() bool {
	snapshot := terminal.reader.Snapshot()
	fresh, err := terminal.layout.NewReader(snapshot.Columns, snapshot.Height, screen.DefaultLimits)

	terminal.mutex.Lock()
	terminal.private, terminal.endConfirmed, terminal.cleared = fresh, false, false
	if err != nil {
		terminal.private = nil
	}
	terminal.mutex.Unlock()

	return terminal.barrier.Close() && err == nil
}

// confirmPrivateEnd is the driver's word that the private operation ended; the barrier still waits for a complete
// public redraw after it.
func (terminal *hostTerminal) confirmPrivateEnd() {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()

	terminal.endConfirmed, terminal.cleared = true, false
}

// feedPrivate gives a chunk to the fresh parser while the barrier is closed, and says whether it took it. After the
// driver confirmed the end, a chunk that clears the whole screen and leaves a public screen with its composer drawn
// is a verified redraw: the old screen is discarded, the fresh parser promoted and the barrier reopened.
func (terminal *hostTerminal) feedPrivate(chunk []byte) bool {
	if !terminal.barrier.IsClosed() {
		return false
	}

	terminal.mutex.Lock()
	fresh := terminal.private
	if terminal.endConfirmed && strings.Contains(string(chunk), fullClear) {
		terminal.cleared = true
	}
	ready := terminal.endConfirmed && terminal.cleared
	terminal.mutex.Unlock()

	if fresh == nil {
		return true
	}
	_ = fresh.Feed(chunk)
	if ready && terminal.isCompletePublicRedraw(fresh) {
		terminal.promote(fresh)
	}

	return true
}

// isCompletePublicRedraw is whether the fresh parser shows a public screen whose composer is drawn with the cursor
// shown, as a program that redrew everything does.
func (terminal *hostTerminal) isCompletePublicRedraw(fresh *screen.EmulatorReader) bool {
	snapshot := fresh.Snapshot()
	_, composer := terminal.layout.Composer.Rows(snapshot)

	return composer && snapshot.Cursor.IsVisible && terminal.layout.IsExportable(snapshot)
}

// promote discards the old screen for the fresh parser's, reopens the barrier and lets the mirror forward again; the
// watcher sees a new incarnation and starts a new stream.
func (terminal *hostTerminal) promote(fresh *screen.EmulatorReader) {
	terminal.reader.Adopt(fresh)

	terminal.mutex.Lock()
	terminal.private, terminal.endConfirmed, terminal.cleared = nil, false, false
	terminal.mirrorSilenced = false
	terminal.incarnation++
	terminal.mutex.Unlock()

	terminal.barrier.Reopen()
}

// silenceMirror stops forwarding output to the attached local client; it confirms once no chunk is being written.
func (terminal *hostTerminal) silenceMirror() bool {
	terminal.mutex.Lock()
	defer terminal.mutex.Unlock()

	terminal.mirrorSilenced = true

	return true
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

// attachFrameLimit is the most bytes one frame on the attach socket may declare; a larger declaration is refused
// before anything is allocated for it.
const attachFrameLimit = 1 << 20

// errFrameTooLarge refuses a frame that declares more than the limit.
var errFrameTooLarge = errors.New("the attach frame declares more than the limit")

func readFrame(reader io.Reader) (byte, []byte, error) {
	header := make([]byte, 5)
	if _, err := io.ReadFull(reader, header); err != nil {
		return 0, nil, err
	}
	length := binary.BigEndian.Uint32(header[1:])
	if length > attachFrameLimit {
		return 0, nil, errFrameTooLarge
	}
	payload := make([]byte, length)
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
