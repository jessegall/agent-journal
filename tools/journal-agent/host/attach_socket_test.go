package host

import (
	"errors"
	"io"
	"net"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/creack/pty"

	"journal-agent/recording"
	"journal-agent/screen"
	inputs "journal-agent/terminal"
)

// listeningSocket serves an attach socket whose programs are bare PTYs with nothing running behind them; closing a
// program's end of its PTY, sent on the channel as each starts, ends it.
func listeningSocket(t *testing.T) (*AttachSocket, chan *os.File) {
	t.Helper()
	folder, err := os.MkdirTemp("/tmp", "attach")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.RemoveAll(folder) })
	programs := make(chan *os.File, 4)

	socket := &AttachSocket{
		Folder: folder,
		Start: func(AttachRequest) (TerminalStream, error) {
			program, terminal, err := pty.Open()
			if err != nil {
				return nil, err
			}
			t.Cleanup(func() { program.Close(); terminal.Close() })
			programs <- terminal
			return PtyTerminal(program), nil
		},
		Layout: func(AttachRequest) (screen.Layout, error) {
			return screen.Layout{Composer: screen.FencedRow{Label: "composer", Marker: ">"}}, nil
		},
	}
	listener, err := socket.Listen()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { listener.Close() })

	return socket, programs
}

// attached connects a client that asks for the runtime at the given size.
func attached(t *testing.T, socket *AttachSocket, runtimeID string, rows, columns uint16) net.Conn {
	t.Helper()
	connection, err := net.Dial("unix", socket.Path())
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { connection.Close() })
	if err := WriteAttachRequest(connection, AttachRequest{RuntimeID: runtimeID, Rows: rows, Columns: columns}); err != nil {
		t.Fatal(err)
	}

	return connection
}

// waitForSize waits until the runtime's screen has the size, failing after a second.
func waitForSize(t *testing.T, socket *AttachSocket, runtimeID string, rows, columns int) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		socket.mutex.Lock()
		terminal := socket.terminals[runtimeID]
		socket.mutex.Unlock()
		if terminal != nil {
			frame := terminal.reader.Frame("epoch", 1, time.Now())
			if frame.Columns == columns && len(frame.Rows) == rows {
				return
			}
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("the screen of %s never took the size %dx%d", runtimeID, columns, rows)
}

func TestAResizeOfTheAttachedWindowResizesTheScreen(t *testing.T) {
	socket, _ := listeningSocket(t)
	connection := attached(t, socket, "runtime-1", 24, 80)
	waitForSize(t, socket, "runtime-1", 24, 80)

	if err := WriteResize(connection, 30, 100); err != nil {
		t.Fatal(err)
	}

	waitForSize(t, socket, "runtime-1", 30, 100)
}

func TestAReattachAtAnotherSizeResizesTheScreen(t *testing.T) {
	socket, _ := listeningSocket(t)
	first := attached(t, socket, "runtime-1", 24, 80)
	waitForSize(t, socket, "runtime-1", 24, 80)
	first.Close()

	attached(t, socket, "runtime-1", 50, 160)

	waitForSize(t, socket, "runtime-1", 50, 160)
}

func TestAnEndedProgramLeavesNoReaderAndARestartGetsANewOne(t *testing.T) {
	socket, programs := listeningSocket(t)
	if _, found := socket.ScreenFor("runtime-1"); found {
		t.Fatal("a reader before the runtime was started")
	}
	attached(t, socket, "runtime-1", 24, 80)
	waitForSize(t, socket, "runtime-1", 24, 80)
	first, _ := socket.ScreenFor("runtime-1")

	(<-programs).Close()
	waitUntilTerminalGone(t, socket, "runtime-1")

	attached(t, socket, "runtime-1", 24, 80)
	waitForSize(t, socket, "runtime-1", 24, 80)
	if second, _ := socket.ScreenFor("runtime-1"); second.Reader == first.Reader {
		t.Fatal("the restart reuses the ended program's reader")
	}
}

// waitUntilTerminalGone waits up to a second for the runtime's terminal to leave the socket.
func waitUntilTerminalGone(t *testing.T, socket *AttachSocket, runtimeID string) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if _, found := socket.ScreenFor(runtimeID); !found {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatal("the ended program's terminal stayed")
}

// terminalOf is the runtime's terminal once the socket has it, failing after a second.
func terminalOf(t *testing.T, socket *AttachSocket, runtimeID string) *hostTerminal {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		socket.mutex.Lock()
		terminal := socket.terminals[runtimeID]
		socket.mutex.Unlock()
		if terminal != nil {
			return terminal
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("the socket never ran %s", runtimeID)

	return nil
}

// waitForActive waits until the terminal's active connection is a newer one than the given identity.
func waitForActive(t *testing.T, terminal *hostTerminal, after uint64) uint64 {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		terminal.mutex.Lock()
		active := terminal.connection
		terminal.mutex.Unlock()
		if active > after {
			return active
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatal("no newer connection became active")

	return 0
}

func TestAClosedEarlierConnectionLeavesItsSuccessorAttachedAndAbleToType(t *testing.T) {
	socket, programs := listeningSocket(t)
	first := attached(t, socket, "runtime-1", 24, 80)
	terminal := terminalOf(t, socket, "runtime-1")
	program := <-programs
	firstIdentity := waitForActive(t, terminal, 0)
	second := attached(t, socket, "runtime-1", 24, 80)
	secondIdentity := waitForActive(t, terminal, firstIdentity)

	first.Close()
	time.Sleep(20 * time.Millisecond)

	if !terminal.isActive(secondIdentity) {
		t.Fatal("the first connection's close detached its successor")
	}
	if err := WriteKeys(second, []byte("ok\n")); err != nil {
		t.Fatal(err)
	}
	read := make([]byte, 3)
	program.SetReadDeadline(time.Now().Add(time.Second))
	if _, err := io.ReadFull(program, read); err != nil || string(read) != "ok\n" {
		t.Fatalf("the program got %q, %v", read, err)
	}
}

func TestALocalKeyRetiresALiveBrowserGrantBeforeItsBytes(t *testing.T) {
	socket, programs := listeningSocket(t)
	connection := attached(t, socket, "runtime-1", 24, 80)
	terminal := terminalOf(t, socket, "runtime-1")
	<-programs
	waitForActive(t, terminal, 0)
	waitForSize(t, socket, "runtime-1", 24, 80)
	if _, err := terminal.gate.Take("take-1", inputs.GrantScope{}); err != nil {
		t.Fatal(err)
	}

	if err := WriteKeys(connection, []byte("x")); err != nil {
		t.Fatal(err)
	}

	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if state := terminal.gate.GrantState(); state.GrantID == "" && state.LocalControl {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("the local key left the browser grant live: %+v", terminal.gate.GrantState())
}

func TestABrowserResizeIsBoundedAndReportsTheAchievedSize(t *testing.T) {
	socket, programs := listeningSocket(t)
	attached(t, socket, "runtime-1", 24, 80)
	terminal := terminalOf(t, socket, "runtime-1")
	<-programs
	waitForSize(t, socket, "runtime-1", 24, 80)
	grant, err := terminal.gate.Take("take-1", inputs.GrantScope{})
	if err != nil {
		t.Fatal(err)
	}

	receipt := terminal.gate.ApplyBrowser(inputs.BrowserOperation{
		GrantID:  grant.ID,
		Sequence: 1,
		Type:     inputs.ResizeOperation,
		Rows:     40,
		Columns:  600,
	}, terminal.layout, "")

	if receipt.Outcome != inputs.Applied || receipt.Rows != 40 || receipt.Columns != screen.DefaultLimits.MaxColumns {
		t.Fatalf("the resize answered %+v", receipt)
	}
	waitForSize(t, socket, "runtime-1", 40, screen.DefaultLimits.MaxColumns)
}

func TestAClosedCaptureBarrierStopsTheLocalMirrorAndTheWatcherShieldsTheScreen(t *testing.T) {
	socket, programs := listeningSocket(t)
	connection := attached(t, socket, "runtime-1", 24, 80)
	terminal := terminalOf(t, socket, "runtime-1")
	program := <-programs
	waitForSize(t, socket, "runtime-1", 24, 80)

	if !terminal.barrier.Close() {
		t.Fatal("the barrier was not ready after every sink confirmed")
	}
	if _, err := program.Write([]byte("hunter2\r\n")); err != nil {
		t.Fatal(err)
	}

	connection.SetReadDeadline(time.Now().Add(200 * time.Millisecond))
	if _, _, err := readFrame(connection); err == nil {
		t.Fatal("output reached the local mirror after the barrier closed")
	}
	runtimeScreen, _ := socket.ScreenFor("runtime-1")
	sender := &screenSender{watcher: &ScreenWatcher{epoch: "epoch"}, runtimeID: "runtime-1"}
	if frame := sender.export(runtimeScreen, time.Now()); !frame.IsShielded || len(frame.Rows) != 0 {
		t.Fatalf("the watcher exported %+v while the barrier was closed", frame)
	}
}

// publicRedraw is a full redraw of a ready composer between rules across the 80-column screen, as the program draws
// it after a private operation.
var publicRedraw = "\x1b[2J\x1b[H" + strings.Repeat("─", 80) + "\r\n> \r\n" + strings.Repeat("─", 80) + "\x1b[2;3H"

// waitForBarrier waits until the barrier's state is the one wanted, failing after a second.
func waitForBarrier(t *testing.T, terminal *hostTerminal, closed bool) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if terminal.barrier.IsClosed() == closed {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("the barrier never became closed=%v", closed)
}

func TestAPrivatePromptThenAFullRedrawReturnsToPublicInANewIncarnation(t *testing.T) {
	socket, programs := listeningSocket(t)
	attached(t, socket, "runtime-1", 24, 80)
	terminal := terminalOf(t, socket, "runtime-1")
	program := <-programs
	waitForSize(t, socket, "runtime-1", 24, 80)

	if !terminal.enterPrivate() {
		t.Fatal("private entry did not close every sink")
	}
	program.Write([]byte("Password: "))
	time.Sleep(50 * time.Millisecond)
	terminal.confirmPrivateEnd()
	program.Write([]byte("> partial"))
	time.Sleep(50 * time.Millisecond)
	if !terminal.barrier.IsClosed() {
		t.Fatal("a partial redraw reopened the barrier")
	}

	program.Write([]byte(publicRedraw))
	waitForBarrier(t, terminal, false)

	snapshot := terminal.reader.Snapshot()
	if strings.Contains(strings.Join(snapshot.Rows, "\n"), "Password") {
		t.Fatalf("the promoted screen kept an old row: %q", snapshot.Rows)
	}
	if runtimeScreen, _ := socket.ScreenFor("runtime-1"); runtimeScreen.Incarnation != 1 {
		t.Fatalf("the screen's incarnation is %d, not 1", runtimeScreen.Incarnation)
	}
}

func TestALocalKeyDuringPrivateEntryIsDiscardedAndRetiresTheBrowserGrant(t *testing.T) {
	socket, programs := listeningSocket(t)
	connection := attached(t, socket, "runtime-1", 24, 80)
	terminal := terminalOf(t, socket, "runtime-1")
	program := <-programs
	waitForSize(t, socket, "runtime-1", 24, 80)
	terminal.gate.Take("take-1", inputs.GrantScope{})
	terminal.enterPrivate()

	if err := WriteKeys(connection, []byte("leak\n")); err != nil {
		t.Fatal(err)
	}

	program.SetReadDeadline(time.Now().Add(200 * time.Millisecond))
	if count, _ := program.Read(make([]byte, 16)); count != 0 {
		t.Fatal("a local key reached the program during private entry")
	}
	if state := terminal.gate.GrantState(); state.GrantID != "" || !state.LocalControl {
		t.Fatalf("the browser grant survived a local key during private entry: %+v", state)
	}
	if !terminal.barrier.IsClosed() {
		t.Fatal("the local key reopened the barrier")
	}
}

func TestALostContainedAttachmentWhoseContainerRunsIsALostConnectionNotAnEnd(t *testing.T) {
	socket, programs := listeningSocket(t)
	running := true
	socket.InstanceRuns = func(instance string) bool { return instance == "container-1" && running }
	connection, err := net.Dial("unix", socket.Path())
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { connection.Close() })
	request := AttachRequest{RuntimeID: "runtime-1", Rows: 24, Columns: 80, ContainerInstance: "container-1"}
	if err := WriteAttachRequest(connection, request); err != nil {
		t.Fatal(err)
	}
	terminalOf(t, socket, "runtime-1")

	(<-programs).Close()
	waitUntilTerminalGone(t, socket, "runtime-1")

	if !socket.LostConnection("runtime-1") {
		t.Fatal("a lost attachment with its container running did not count as a lost connection")
	}
	sender := &screenSender{watcher: &ScreenWatcher{epoch: "epoch", readers: socket}, runtimeID: "runtime-1"}
	if marker, _ := sender.read(time.Now()); !marker.IsConnectionLost || marker.HasNoTerminal {
		t.Fatalf("the watcher reported %+v for a lost connection", marker)
	}
	running = false
	if socket.LostConnection("runtime-1") {
		t.Fatal("a stopped container still counted as a lost connection")
	}
}

func TestARecordingKeepsThePublicOutputBetweenItsStartAndStopAndNothingOfAPrivateEntry(t *testing.T) {
	socket, programs := listeningSocket(t)
	connection, err := net.Dial("unix", socket.Path())
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { connection.Close() })
	state := t.TempDir()
	if err := WriteAttachRequest(connection, AttachRequest{RuntimeID: "runtime-1", Rows: 24, Columns: 80, Folder: state}); err != nil {
		t.Fatal(err)
	}
	terminal := terminalOf(t, socket, "runtime-1")
	program := <-programs
	waitForSize(t, socket, "runtime-1", 24, 80)
	program.Write([]byte("before the recording"))
	time.Sleep(50 * time.Millisecond)

	terminal.startRecording()
	program.Write([]byte("a recorded line"))
	time.Sleep(50 * time.Millisecond)
	if !terminal.enterPrivate() {
		t.Fatal("private entry did not close every sink")
	}
	program.Write([]byte("Password: "))
	time.Sleep(50 * time.Millisecond)
	terminal.confirmPrivateEnd()
	program.Write([]byte(publicRedraw))
	waitForBarrier(t, terminal, false)
	folder, err := terminal.stopRecording()
	if err != nil {
		t.Fatal(err)
	}

	fixture, err := recording.Load(folder)
	if err != nil {
		t.Fatal(err)
	}
	recorded := ""
	for _, chunk := range fixture.Output {
		recorded += string(chunk.Bytes)
	}
	if !strings.Contains(recorded, "a recorded line") || strings.Contains(recorded, "before the recording") ||
		strings.Contains(recorded, "Password") {
		t.Fatalf("the recording kept %q", recorded)
	}
	if fixture.Geometry.Rows != 24 || fixture.Geometry.Columns != 80 || !strings.HasPrefix(folder, state) {
		t.Fatalf("the recording was saved in %s at %+v", folder, fixture.Geometry)
	}
	if _, err := terminal.stopRecording(); !errors.Is(err, ErrNoRecording) {
		t.Fatalf("a second stop answered %v", err)
	}
}
