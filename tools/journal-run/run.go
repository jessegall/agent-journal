package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"strconv"
	"syscall"
	"time"
)

const pollInterval = 20 * time.Millisecond

// Options are what one run is told: its process, its foreground limit and whether it moves at once, the line, the
// journal folder, the shell and how often the heartbeat is written. Detach continues a moved run without the
// runner; when it is nil the run goes on in this program.
type Options struct {
	Process        int
	LimitSeconds   int
	Background     bool
	Line           string
	Home           string
	Shell          string
	HeartbeatEvery time.Duration
	CapCharacters  int
	Detach         func(options Options)
	// ShellAlive says whether the shell that started the runner still lives; when it is nil the runner watches its parent.
	ShellAlive func() bool
}

// Run runs the line through the folder and returns the chain's exit code; a run that moves to the background
// returns 0 and goes on without it. With no server it runs the line as it is.
func Run(options Options, client Client, stdout io.Writer) int {
	if !client.Reachable() {
		return Bypass(options, stdout)
	}
	if options.CapCharacters == 0 {
		options.CapCharacters = DefaultCapCharacters
	}
	folder, parts := NewFolder(options.Home, options.Process), Parts(options.Line)
	if err := folder.Start(options.Line, parts, Script(parts, folder.Path)); err != nil {
		fmt.Fprintf(stdout, "the journal could not keep process %d: %v\n", options.Process, err)
		return Bypass(options, stdout)
	}
	leader, err := start(options, folder)
	if err != nil {
		fmt.Fprintf(stdout, "the shell of process %d did not start: %v\n", options.Process, err)
		return 127
	}
	go waitForLeader(leader, folder)
	go beat(folder, leader.Process.Pid, options.HeartbeatEvery)
	if options.ShellAlive == nil {
		parent := os.Getppid()
		options.ShellAlive = func() bool { return os.Getppid() == parent }
	}
	follower := Follower{Options: options, Client: client, Folder: folder, Parts: len(parts), Reported: map[int]bool{}}
	return follower.Run(stdout)
}

// start runs the script in a shell of its own group; the outer shell writes the end when the inner one is gone, even
// when the line execs.
func start(options Options, folder Folder) (*exec.Cmd, error) {
	command := exec.Command("/bin/sh", "-c", `"$1" "$2"; printf '%s' "$?" > "$3/end"`, "journal-run", options.Shell, folder.Script(), folder.Path)
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := command.Start(); err != nil {
		return nil, err
	}
	return command, folder.WritePid(command.Process.Pid)
}

// waitForLeader reaps the group leader and, when it was killed before it wrote the end, writes the end for it.
func waitForLeader(leader *exec.Cmd, folder Folder) {
	err := leader.Wait()
	if _, ended := folder.End(); ended {
		return
	}
	code := 1
	if exit, isExit := err.(*exec.ExitError); isExit {
		code = exit.ExitCode()
		if code < 0 {
			code = 143
		}
	}
	_ = folder.WriteEnd(code)
}

func beat(folder Folder, pid int, every time.Duration) {
	for {
		if _, ended := folder.End(); ended || syscall.Kill(pid, 0) != nil {
			return
		}
		folder.Beat()
		time.Sleep(every)
	}
}

// Detach continues a moved run in a program of its own that no tool call waits for.
func Detach(options Options) {
	command := exec.Command(os.Args[0], "--follow", "--process", strconv.Itoa(options.Process), "--folder", options.Home, "--parts", strconv.Itoa(len(Parts(options.Line))))
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	_ = command.Start()
}
