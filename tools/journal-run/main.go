// Command journal-run runs the shell line an agent's tool was rewritten to: part by part in a shell of its own, the
// output of each part in the process's folder, what the agent sees within the caps, and the line moved to the
// background past its limit.
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// version is set at build time, as the other programs' is.
var version = "dev"

func main() {
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
	if flags.Follow {
		tracker := Tracker{Options: Options{Process: flags.Process, Home: home}, Client: client, Folder: NewFolder(home, flags.Process), Parts: flags.Parts, Reported: map[int]bool{}}
		tracker.Watch()
		return
	}
	os.Exit(Run(Options{Process: flags.Process, LimitSeconds: flags.Limit, Background: flags.Background, Line: flags.Line, Home: home, Shell: userShell(),
		HeartbeatEvery: HeartbeatInterval, Detach: Detach}, client, os.Stdout))
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
