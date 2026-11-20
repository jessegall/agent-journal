package host

import (
	"net"
	"os"
	"testing"
	"time"

	"github.com/creack/pty"

	"journal-agent/screen"
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
		Start: func(AttachRequest) (*os.File, error) {
			program, terminal, err := pty.Open()
			if err != nil {
				return nil, err
			}
			t.Cleanup(func() { program.Close(); terminal.Close() })
			programs <- terminal
			return program, nil
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

func TestAnEndedProgramLeavesNoReaderAndARelaunchGetsANewOne(t *testing.T) {
	socket, programs := listeningSocket(t)
	if _, found := socket.ReaderFor("runtime-1"); found {
		t.Fatal("a reader before the runtime was started")
	}
	attached(t, socket, "runtime-1", 24, 80)
	waitForSize(t, socket, "runtime-1", 24, 80)
	first, _ := socket.ReaderFor("runtime-1")

	(<-programs).Close()
	waitUntilTerminalGone(t, socket, "runtime-1")

	attached(t, socket, "runtime-1", 24, 80)
	waitForSize(t, socket, "runtime-1", 24, 80)
	if second, _ := socket.ReaderFor("runtime-1"); second == first {
		t.Fatal("the relaunch reuses the ended program's reader")
	}
}

// waitUntilTerminalGone waits up to a second for the runtime's terminal to leave the socket.
func waitUntilTerminalGone(t *testing.T, socket *AttachSocket, runtimeID string) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if _, found := socket.ReaderFor(runtimeID); !found {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatal("the ended program's terminal stayed")
}
