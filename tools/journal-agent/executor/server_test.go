package executor

import (
	"bytes"
	"context"
	"errors"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"
)

// startTestServer serves a temporary workspace on a socket in a short temporary folder, since a socket path is
// limited to about a hundred bytes, as the given connected user.
func startTestServer(t *testing.T, connectedUser int) (string, string) {
	workspace := t.TempDir()
	socketFolder, err := os.MkdirTemp("/tmp", "exec")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(socketFolder) })
	socket := filepath.Join(socketFolder, "exec.sock")
	listener, err := net.ListenUnix("unix", &net.UnixAddr{Name: socket, Net: "unix"})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = listener.Close() })

	server := Server{AllowedUID: 10001, Workspace: workspace, Shell: "/bin/bash", Home: workspace,
		peerUID: func(*net.UnixConn) (int, error) { return connectedUser, nil }}
	go func() { _ = server.Serve(listener) }()

	return workspace, socket
}

func runCommand(t *testing.T, socket string, request Request, streams Streams) (Exit, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	client, err := Dial(ctx, socket)
	if err != nil {
		t.Fatal(err)
	}

	return client.Run(ctx, request, streams)
}

func TestTheProgramsUserRunsACommandWhoseOutputExitAndFolderArriveIntact(t *testing.T) {
	workspace, socket := startTestServer(t, 10001)
	if err := os.Mkdir(filepath.Join(workspace, "src"), 0o755); err != nil {
		t.Fatal(err)
	}

	var stdout, stderr bytes.Buffer
	exit, err := runCommand(t, socket, Request{Command: `read line; echo "got $line"; pwd; echo oops >&2; exit 3`,
		Cwd: filepath.Join(workspace, "src")}, Streams{Stdin: strings.NewReader("hello\n"), Stdout: &stdout,
		Stderr: &stderr})
	if err != nil {
		t.Fatal(err)
	}

	if exit.Code != 3 || !strings.Contains(stdout.String(), "got hello") ||
		!strings.HasSuffix(strings.TrimSpace(stdout.String()), "/src") || strings.TrimSpace(stderr.String()) != "oops" {
		t.Fatalf("exit %+v, stdout %q, stderr %q", exit, stdout.String(), stderr.String())
	}
}

func TestACommandGetsOnlyTheFixedEnvironment(t *testing.T) {
	workspace, socket := startTestServer(t, 10001)
	t.Setenv("JOURNAL_SECRET", "leaked")

	var stdout bytes.Buffer
	if _, err := runCommand(t, socket, Request{Command: "env", Cwd: workspace}, Streams{Stdout: &stdout,
		Stderr: &bytes.Buffer{}}); err != nil {
		t.Fatal(err)
	}

	if strings.Contains(stdout.String(), "JOURNAL_SECRET") || !strings.Contains(stdout.String(), "LANG=C.UTF-8") {
		t.Fatalf("the environment was %q", stdout.String())
	}
}

func TestARequestFromAnotherUserOrOutsideTheWorkspaceIsRefusedAndStartsNothing(t *testing.T) {
	for name, test := range map[string]struct {
		connectedUser int
		cwd           func(workspace string) string
	}{
		"another user":            {4242, func(workspace string) string { return workspace }},
		"a folder outside":        {10001, func(string) string { return os.TempDir() }},
		"a link leading outside":  {10001, func(workspace string) string { return filepath.Join(workspace, "out") }},
		"a folder that is absent": {10001, func(workspace string) string { return filepath.Join(workspace, "gone") }},
	} {
		workspace, socket := startTestServer(t, test.connectedUser)
		if err := os.Symlink(os.TempDir(), filepath.Join(workspace, "out")); err != nil {
			t.Fatal(err)
		}
		marker := filepath.Join(workspace, "ran")

		_, err := runCommand(t, socket, Request{Command: "touch " + marker, Cwd: test.cwd(workspace)},
			Streams{Stdout: &bytes.Buffer{}, Stderr: &bytes.Buffer{}})
		if !errors.Is(err, ErrRefused) {
			t.Fatalf("%s gave %v", name, err)
		}
		if _, statErr := os.Stat(marker); statErr == nil {
			t.Fatalf("%s started the command", name)
		}
	}
}

func TestAMalformedFrameIsRefused(t *testing.T) {
	_, socket := startTestServer(t, 10001)
	conn, err := net.Dial("unix", socket)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()

	if _, err := conn.Write([]byte{0, 0, 0, 5, 'h', 'e', 'l', 'l', 'o'}); err != nil {
		t.Fatal(err)
	}

	frame, err := ReadFrame(conn)
	if err != nil || frame.Type != FrameRefused {
		t.Fatalf("got %+v, %v", frame, err)
	}
}

func TestASignalReachesTheCommandAndItsEndIsReported(t *testing.T) {
	workspace, socket := startTestServer(t, 10001)
	signals := make(chan string, 1)
	signals <- "TERM"

	exit, err := runCommand(t, socket, Request{Command: "sleep 30", Cwd: workspace},
		Streams{Stdout: &bytes.Buffer{}, Stderr: &bytes.Buffer{}, Signals: signals})
	if err != nil || exit.Signal != "TERM" {
		t.Fatalf("exit %+v, %v", exit, err)
	}
}

func TestADisconnectLeavesNoProcessOfTheRequestAlive(t *testing.T) {
	workspace, socket := startTestServer(t, 10001)
	ctx, cancel := context.WithCancel(context.Background())
	client, err := Dial(ctx, socket)
	if err != nil {
		t.Fatal(err)
	}

	printed := &lockedBuffer{}
	done := make(chan struct{})
	go func() {
		_, _ = client.Run(ctx, Request{Command: "sleep 60 & echo $!; sleep 60", Cwd: workspace},
			Streams{Stdout: printed, Stderr: &bytes.Buffer{}})
		close(done)
	}()

	background := firstProcessID(t, printed)
	cancel()
	<-done

	deadline := time.Now().Add(8 * time.Second)
	for syscall.Kill(background, 0) == nil {
		if time.Now().After(deadline) {
			t.Fatalf("process %d outlived its request", background)
		}
		time.Sleep(100 * time.Millisecond)
	}
}

func TestATerminalRequestRunsOnATerminalOfItsSize(t *testing.T) {
	workspace, socket := startTestServer(t, 10001)

	var stdout bytes.Buffer
	exit, err := runCommand(t, socket, Request{Command: "stty size", Cwd: workspace, Tty: true, Rows: 33, Cols: 101},
		Streams{Stdout: &stdout, Stderr: &bytes.Buffer{}})
	if err != nil || exit.Code != 0 || !strings.Contains(stdout.String(), "33 101") {
		t.Fatalf("exit %+v, %v, output %q", exit, err, stdout.String())
	}
}

// firstProcessID reads the first number the command printed.
func firstProcessID(t *testing.T, printed *lockedBuffer) int {
	deadline := time.Now().Add(10 * time.Second)
	for time.Now().Before(deadline) {
		if line, _, found := strings.Cut(printed.String(), "\n"); found {
			processID, err := strconv.Atoi(strings.TrimSpace(line))
			if err != nil {
				t.Fatal(err)
			}

			return processID
		}
		time.Sleep(50 * time.Millisecond)
	}
	t.Fatal("the command printed no process id")

	return 0
}
