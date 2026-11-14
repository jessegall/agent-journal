package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"syscall"
	"time"
)

const pollInterval = 20 * time.Millisecond

// Options are what one run is told: its process, its foreground limit and whether it moves at once, the line, the
// journal folder, the shell and how often the heartbeat is written. Detach continues a moved run without the
// runner; when it is nil the run goes on in this program.
type Options struct {
	Count                string
	ProgressCount        string
	ProgressPosition     int
	ProgressPattern      string
	Listing              ListingOptions
	Process              int
	LimitSeconds         int
	Background           bool
	Queue                bool
	QueueWait            time.Duration
	CountedQueue         bool
	SlotWaitLimitSeconds int
	OnlyReads            bool
	ReadOnlyShell        bool
	WriteFolder          string
	ReadFolders          []string
	WriteFolders         []string
	Sandbox              shellSandbox
	Aliases              []string
	Line                 string
	Home                 string
	Shell                string
	HeartbeatEvery       time.Duration
	CapCharacters        int
	// MostOutputBytes is how much of one part's output stays on disk.
	MostOutputBytes int
	// ReadFlags say what the agent reads of a saved command, by position; the whole output stays on disk.
	ReadFlags map[int]string
	Detach    func(options Options)
	// ScanFiles looks for what the line changed once it has ended; when it is nil nothing looks.
	ScanFiles func(options Options)
	// ShellAlive says whether the shell that started the runner still lives; when it is nil the runner watches its parent.
	ShellAlive func() bool
}

// Run runs the line through the folder and returns the chain's exit code; a run that moves to the background
// returns 0 and goes on without it. With no server it runs the line as it is.
func Run(options Options, client Client, stdout io.Writer) int {
	if options.ReadOnlyShell {
		sandbox, err := runSandbox(options, NewFolder(options.Home, options.Process))
		if err != nil {
			fmt.Fprintln(stdout, "read-only shell sandbox:", err)
			return 125
		}
		options.Sandbox = sandbox
		if err := client.Run("process", "sandbox", strconv.Itoa(options.Process), "--level", sandbox.Level); err != nil {
			fmt.Fprintln(stdout, "could not record the read-only shell sandbox:", err)
			return 125
		}
	}
	if !client.Reachable() {
		return Bypass(options, stdout)
	}
	if options.CapCharacters == 0 {
		options.CapCharacters = DefaultCapCharacters
		if options.OnlyReads {
			options.CapCharacters = ReadCapCharacters
		}
	}
	if options.MostOutputBytes == 0 {
		options.MostOutputBytes = DefaultMostOutputBytes
	}
	folder, parts := NewFolder(options.Home, options.Process), Parts(options.Line)
	listing := options.Listing
	listing.Shell = options.Shell
	if err := folder.Start(options.Line, parts, LockWait(options.Home, options.Process, parts, options.Aliases, options.OnlyReads)+SlotWait(options.Home, options.Process, options.Queue, options.SlotWaitLimitSeconds)+CountWait(folder.Path, options.Count, listing)+Script(parts, folder.Path, ProgressListing{Line: options.ProgressCount, Position: options.ProgressPosition, Pattern: options.ProgressPattern, Options: listing})); err != nil {
		fmt.Fprintf(stdout, "the journal could not keep process %d: %v\n", options.Process, err)
		return Bypass(options, stdout)
	}
	leader, err := start(options, folder, PartCount(parts))
	if err != nil {
		fmt.Fprintf(stdout, "the shell of process %d did not start: %v\n", options.Process, err)
		return 127
	}
	go waitForLeader(leader, folder)
	folder.WriteHeartbeat()
	go writeHeartbeats(folder, leader.Process.Pid, options.HeartbeatEvery)
	if options.ShellAlive == nil {
		parent := os.Getppid()
		options.ShellAlive = func() bool { return os.Getppid() == parent }
	}
	tracker := Tracker{Options: options, Client: client, Folder: folder, Parts: PartCount(parts), Reported: map[int]bool{}, Positions: map[int]bool{}, ShownBytes: map[int]int{}}
	for _, part := range parts {
		tracker.Positions[part.Position] = true
		if part.JoinedBy == "&" {
			tracker.Background = append(tracker.Background, part.Position)
		}
	}
	return tracker.Run(stdout)
}

// start runs the script in a shell of its own group; the outer shell writes the end when the inner one is dead, even
// when the line execs. What the shell itself prints, as a line it cannot read, goes into the last part's output.
func start(options Options, folder Folder, lastPosition int) (*exec.Cmd, error) {
	arguments := []string{options.Shell, folder.Script()}
	if options.ReadOnlyShell {
		inner := options.Sandbox.command(options.Shell, folder.Script())
		arguments = inner.Args
	}
	command := exec.Command("/bin/sh", append([]string{"-c", `folder=$1; output=$2; shift 2; "$@" >> "$output" 2>&1; printf '%s' "$?" > "$folder/end"`, "journal-run", folder.Path, folder.outputPath(lastPosition)}, arguments...)...)
	command.Env = journalEnvironment(options.Home)
	if options.ReadOnlyShell {
		command.Env = append(command.Env, "TMPDIR="+filepath.Join(folder.Path, "tmp"), "TMP="+filepath.Join(folder.Path, "tmp"), "TEMP="+filepath.Join(folder.Path, "tmp"), "TMPPREFIX="+filepath.Join(folder.Path, "tmp", "zsh"))
	}
	command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := command.Start(); err != nil {
		return nil, err
	}
	return command, folder.WritePid(command.Process.Pid)
}

// waitForLeader reaps the group leader and, when it was killed before it wrote the end, writes the end for it.
func waitForLeader(leader *exec.Cmd, folder Folder) {
	err := leader.Wait()
	if _, ended := folder.End(); ended || err == nil {
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

func writeHeartbeats(folder Folder, pid int, interval time.Duration) {
	for {
		time.Sleep(interval)
		if _, ended := folder.End(); ended || syscall.Kill(pid, 0) != nil {
			return
		}
		folder.WriteHeartbeat()
	}
}

// StartCutting leaves a program behind that keeps a line's outputs under the limit once the line has ended.
func StartCutting(options Options, parts int) {
	command := exec.Command(os.Args[0], "--keep-cutting", "--process", strconv.Itoa(options.Process), "--folder", options.Home, "--parts", strconv.Itoa(parts), "--most-output", strconv.Itoa(options.MostOutputBytes))
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	_ = command.Start()
}

// ScanFiles leaves the hook program behind to look for the files the line changed, which no tool call waits for; a
// first scan of the project counts each file modified since the line's script was written.
func ScanFiles(options Options) {
	folder, err := os.Getwd()
	if err != nil {
		return
	}
	arguments := []string{"--file-scan", options.Home, "--process", strconv.Itoa(options.Process), folder}
	if facts, err := os.Stat(NewFolder(options.Home, options.Process).Script()); err == nil {
		arguments = append(arguments, strconv.FormatInt(facts.ModTime().UnixNano(), 10))
	}
	command := exec.Command(filepath.Join(options.Home, "bin", "journal-hook"), arguments...)
	command.Env = journalEnvironment(options.Home)
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	_ = command.Start()
}

// Detach continues a moved run in a program of its own that no tool call waits for.
func Detach(options Options) {
	command := exec.Command(os.Args[0], "--follow", "--process", strconv.Itoa(options.Process), "--folder", options.Home, "--parts", strconv.Itoa(PartCount(Parts(options.Line))), "--most-output", strconv.Itoa(options.MostOutputBytes))
	command.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	_ = command.Start()
}
