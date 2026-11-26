package executor

import (
	"errors"
	"io"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/creack/pty"
)

// stopGrace is how long a request's process group has after it is told to stop before it is killed.
const stopGrace = 5 * time.Second

// signals are the signals a peer may send to its command's process group, by name.
var signals = map[string]syscall.Signal{
	"INT": syscall.SIGINT, "TERM": syscall.SIGTERM, "HUP": syscall.SIGHUP, "QUIT": syscall.SIGQUIT,
	"KILL": syscall.SIGKILL, "WINCH": syscall.SIGWINCH,
}

// Server runs each request of the allowed user as `bash -c <command>` in a folder of the workspace, with a fixed
// environment and only its standard streams, in a process group of its own.
type Server struct {
	AllowedUID int
	Workspace  string
	Shell      string
	Home       string
	// peerUID reads the connected user; the kernel's peer credentials unless a test sets it.
	peerUID func(*net.UnixConn) (int, error)
}

// NewServer is the executor of the tools user: it serves uid 10001 alone, in /workspace, with HOME the tools home.
func NewServer() Server {
	return Server{AllowedUID: 10001, Workspace: "/workspace", Shell: "/bin/bash", Home: "/home/journal-tools",
		peerUID: connectedUID}
}

// Serve answers each connection of the listener until it closes. Files the commands make stay group-writable.
func (server Server) Serve(listener *net.UnixListener) error {
	syscall.Umask(0o007)
	for {
		conn, err := listener.AcceptUnix()
		if err != nil {
			return err
		}

		go server.serve(conn)
	}
}

// serve runs one connection's request, or refuses it with a reason and starts nothing.
func (server Server) serve(conn *net.UnixConn) {
	defer conn.Close()
	peer := &peerConn{conn: conn}

	uid, err := server.peerUID(conn)
	if err != nil || uid != server.AllowedUID {
		peer.refuse("only the program's user may run commands")
		return
	}

	request, err := ReadFrame(conn)
	if err != nil || request.Type != FrameRequest || request.Command == "" {
		peer.refuse("the first frame is not a command request")
		return
	}

	folder, err := server.workingFolder(request.Cwd)
	if err != nil {
		peer.refuse(err.Error())
		return
	}

	server.run(peer, conn, request, folder)
}

// workingFolder is the request's folder with its links followed, refused unless it lies in the workspace.
func (server Server) workingFolder(cwd string) (string, error) {
	workspace, err := filepath.EvalSymlinks(server.Workspace)
	if err != nil {
		return "", errors.New("the workspace is missing")
	}

	folder, err := filepath.EvalSymlinks(cwd)
	if err != nil || !filepath.IsAbs(cwd) {
		return "", errors.New("the working folder does not exist")
	}

	if folder != workspace && !strings.HasPrefix(folder, workspace+string(filepath.Separator)) {
		return "", errors.New("the working folder is outside the workspace")
	}

	return folder, nil
}

// environment is the fixed environment every command gets; nothing of the peer's is passed on.
func (server Server) environment(tty bool) []string {
	environment := []string{"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
		"HOME=" + server.Home, "LANG=C.UTF-8"}
	if tty {
		environment = append(environment, "TERM=xterm-256color")
	}

	return environment
}

// run starts the command, streams it both ways and answers its exit; a peer that leaves stops the whole group.
func (server Server) run(peer *peerConn, conn *net.UnixConn, request Frame, folder string) {
	command := exec.Command(server.Shell, "-c", request.Command)
	command.Dir = folder
	command.Env = server.environment(request.Tty)
	command.WaitDelay = time.Second

	input, streams, err := server.start(command, request, peer)
	if err != nil {
		peer.refuse("the command could not start")
		return
	}

	group := command.Process.Pid
	finished := make(chan struct{})
	go func() {
		peer.follow(conn, input, group, finished)
	}()

	waitErr := command.Wait()
	close(finished)
	_ = syscall.Kill(-group, syscall.SIGKILL)
	streams.Wait()
	if peer.terminal != nil {
		_ = peer.terminal.Close()
	}

	peer.send(exitFrame(command, waitErr))
}

// start starts the command on a terminal of its own size, or on pipes, as its own process group, and answers where
// its input goes and the copying of its output.
func (server Server) start(command *exec.Cmd, request Frame, peer *peerConn) (io.WriteCloser, *sync.WaitGroup, error) {
	streams := &sync.WaitGroup{}
	if request.Tty {
		terminal, err := pty.StartWithSize(command, &pty.Winsize{Rows: request.Rows, Cols: request.Cols})
		if err != nil {
			return nil, nil, err
		}

		peer.terminal = terminal
		streams.Go(func() { peer.copyOut(FrameStdout, terminal) })

		return terminal, streams, nil
	}

	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	input, err := command.StdinPipe()
	if err != nil {
		return nil, nil, err
	}

	stdout, err := command.StdoutPipe()
	if err != nil {
		return nil, nil, err
	}

	stderr, err := command.StderrPipe()
	if err != nil {
		return nil, nil, err
	}

	if err := command.Start(); err != nil {
		return nil, nil, err
	}

	streams.Go(func() { peer.copyOut(FrameStdout, stdout) })
	streams.Go(func() { peer.copyOut(FrameStderr, stderr) })

	return input, streams, nil
}

// exitFrame is the command's exit code, or the signal that ended it.
func exitFrame(command *exec.Cmd, waitErr error) Frame {
	if command.ProcessState == nil {
		return Frame{Type: FrameExit, Code: -1, Reason: waitErr.Error()}
	}

	status, _ := command.ProcessState.Sys().(syscall.WaitStatus)
	if status.Signaled() {
		return Frame{Type: FrameExit, Code: -1, Signal: signalName(status.Signal())}
	}

	return Frame{Type: FrameExit, Code: command.ProcessState.ExitCode()}
}

// signalName is the short name a signal frame uses for the signal.
func signalName(signal syscall.Signal) string {
	for name, known := range signals {
		if known == signal {
			return name
		}
	}

	return signal.String()
}

// peerConn writes frames to the peer from every stream, one frame at a time.
type peerConn struct {
	conn     *net.UnixConn
	lock     sync.Mutex
	terminal *os.File
}

func (peer *peerConn) send(frame Frame) {
	peer.lock.Lock()
	defer peer.lock.Unlock()
	_ = WriteFrame(peer.conn, frame)
}

func (peer *peerConn) refuse(reason string) {
	peer.send(Frame{Type: FrameRefused, Reason: reason})
}

// copyOut sends what the stream prints as frames of its type until it ends.
func (peer *peerConn) copyOut(frameType string, stream io.Reader) {
	buffer := make([]byte, 32*1024)
	for {
		read, err := stream.Read(buffer)
		if read > 0 {
			peer.send(Frame{Type: frameType, Data: append([]byte(nil), buffer[:read]...)})
		}
		if err != nil {
			return
		}
	}
}

// follow passes the peer's input, resizes and signals to the command until it ends; when the peer leaves first, the
// whole group is told to stop and killed after the grace.
func (peer *peerConn) follow(conn *net.UnixConn, input io.WriteCloser, group int, finished <-chan struct{}) {
	for {
		frame, err := ReadFrame(conn)
		if err != nil {
			stopGroup(group, finished)
			return
		}

		switch frame.Type {
		case FrameStdin:
			_, _ = input.Write(frame.Data)
		case FrameEOF:
			_ = input.Close()
		case FrameResize:
			if peer.terminal != nil {
				_ = pty.Setsize(peer.terminal, &pty.Winsize{Rows: frame.Rows, Cols: frame.Cols})
			}
		case FrameSignal:
			if signal, known := signals[frame.Signal]; known {
				_ = syscall.Kill(-group, signal)
			}
		}
	}
}

// stopGroup asks the group to stop and kills it when it has not ended within the grace.
func stopGroup(group int, finished <-chan struct{}) {
	_ = syscall.Kill(-group, syscall.SIGTERM)
	select {
	case <-finished:
	case <-time.After(stopGrace):
		_ = syscall.Kill(-group, syscall.SIGKILL)
	}
}
