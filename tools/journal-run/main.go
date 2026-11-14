// Command journal-run runs the shell line an agent's tool was rewritten to: part by part in a shell of its own, the
// output of each part in the process's folder, what the agent sees within the caps, and the line moved to the
// background past its limit.
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
)

// version is set at build time, as the other programs' is.
var version = "dev"

func main() {
	if len(os.Args) == 2 && os.Args[1] == "--sandbox-check" {
		os.Exit(sandboxCheck())
	}
	if len(os.Args) == 3 && os.Args[1] == "--sandbox-probe" {
		os.Exit(sandboxProbe(os.Args[2]))
	}
	if len(os.Args) > 2 && os.Args[1] == "--sandbox-exec" {
		os.Exit(sandboxExec(os.Args[2:]))
	}
	if len(os.Args) == 4 && os.Args[1] == "--has-progress-count" {
		if hasProgressCount(os.Args[2], os.Args[3]) {
			os.Exit(0)
		}
		os.Exit(1)
	}
	if len(os.Args) > 1 && os.Args[1] == "--count-listing" {
		os.Exit(countListingMain(os.Args[2:]))
	}
	if len(os.Args) == 2 && os.Args[1] == "--version" {
		fmt.Println(version)
		return
	}
	flags, err := ParseFlags(os.Args[1:])
	if err != nil {
		fmt.Fprintln(os.Stderr, "journal-run:", err)
		os.Exit(2)
	}
	home := flags.Home()
	client := JournalClient{Home: home}
	if flags.Follow || flags.KeepCutting {
		tracker := Tracker{Options: Options{Process: flags.Process, Home: home, MostOutputBytes: flags.MostOutput, ScanFiles: ScanFiles}, Client: client, Folder: NewFolder(home, flags.Process), Parts: flags.Parts, Reported: map[int]bool{}}
		if flags.KeepCutting {
			tracker.KeepCutting()
			return
		}
		tracker.Watch()
		tracker.KeepCutting()
		return
	}
	os.Exit(Run(flags.runOptions(home, userShell()), client, os.Stdout))
}

// runOptions are the options of a run from its flags.
func (flags Flags) runOptions(home, shell string) Options {
	position, _ := strconv.Atoi(os.Getenv("JOURNAL_RUN_PROGRESS_POSITION"))
	_ = os.Unsetenv("JOURNAL_RUN_FILE_COMMANDS")
	return Options{WriteFolder: flags.WriteFolder, ReadOnlyShell: flags.ReadOnlyShell, Count: flags.Count, ProgressCount: os.Getenv("JOURNAL_RUN_PROGRESS_LISTING"), ProgressPosition: position, ProgressPattern: os.Getenv("JOURNAL_RUN_PROGRESS_PATTERN"), Process: flags.Process, LimitSeconds: flags.Limit, Background: flags.Background, Queue: flags.Queue, OnlyReads: flags.OnlyReads, Line: flags.Line, Aliases: flags.Aliases, Home: home, Shell: shell,
		MostOutputBytes: mostOutputBytes(), ReadFolders: readFolders(), WriteFolders: writeFolders(), ReadFlags: outputReading(), QueueWait: queueWait(), CountedQueue: countedQueue(), HeartbeatEvery: HeartbeatInterval, Detach: Detach, ScanFiles: ScanFiles}
}

// HeartbeatInterval is how often a run's heartbeat is written while its shell lives.
const HeartbeatInterval = 10 * 1e9

func userShell() string {
	if shell := os.Getenv("SHELL"); shell != "" {
		if path, err := exec.LookPath(shell); err == nil {
			return path
		}
	}
	return filepath.Join("/bin", "sh")
}
