package main

import (
	"fmt"
	"io"
	"strconv"
	"syscall"
	"time"
)

// Tracker reads a run's folder as the shell fills it: it shows what the agent sees as each part ends, reports each
// part and the end through the journal client, and moves the run to the background past its limit.
type Tracker struct {
	Options  Options
	Client   Client
	Folder   Folder
	Parts    int
	Reported map[int]bool
	Shown    int
}

func (tracker *Tracker) Run(stdout io.Writer) int {
	started := time.Now()
	if tracker.Options.Background {
		return tracker.move(stdout)
	}
	for {
		tracker.reportParts(stdout)
		if code, ended := tracker.Folder.End(); ended {
			return tracker.finish(stdout, code)
		}
		if !tracker.Options.ShellAlive() {
			return tracker.orphan(stdout)
		}
		limit := time.Duration(tracker.Options.LimitSeconds) * time.Second
		if limit > 0 && time.Since(started) >= limit {
			return tracker.move(stdout)
		}
		time.Sleep(pollInterval)
	}
}

// Watch follows a run that moved until it ends, as a program of its own.
func (tracker *Tracker) Watch() {
	for position := 1; position <= tracker.Parts; position++ {
		if _, ended := tracker.Folder.Status(position); ended {
			tracker.Reported[position] = true
		}
	}
	for {
		tracker.reportParts(io.Discard)
		if code, ended := tracker.Folder.End(); ended {
			tracker.finish(io.Discard, code)
			return
		}
		if pid, recorded := tracker.Folder.Pid(); recorded && syscall.Kill(pid, 0) != nil {
			_ = tracker.Folder.WriteEnd(1)
		}
		time.Sleep(pollInterval)
	}
}

func (tracker *Tracker) reportParts(stdout io.Writer) {
	for position := 1; position <= tracker.Parts; position++ {
		if code, ended := tracker.Folder.Status(position); ended && !tracker.Reported[position] {
			tracker.partEnded(stdout, position, code)
		}
	}
}

func (tracker *Tracker) partEnded(stdout io.Writer, position, code int) {
	tracker.Reported[position] = true
	uncapped := tracker.Options.LimitSeconds == 0
	io.WriteString(stdout, Shown(tracker.Folder.Output(position), tracker.Options.Process, tracker.Options.CapCharacters, uncapped))
	_ = tracker.Client.Run("process", "part-end", strconv.Itoa(tracker.Options.Process), "--position", strconv.Itoa(position), "--exit-code", strconv.Itoa(code))
}

// finish reports a part the shell ended before it could write its status, then the end of the chain.
func (tracker *Tracker) finish(stdout io.Writer, code int) int {
	tracker.reportParts(stdout)
	for position := tracker.Parts; position >= 1; position-- {
		if tracker.Reported[position] {
			break
		}
		if _, started := tracker.startedOutput(position); started {
			tracker.partEnded(stdout, position, code)
			break
		}
	}
	bytes, lines := tracker.Folder.Sizes(tracker.Parts)
	_ = tracker.Client.Run("process", "end", strconv.Itoa(tracker.Options.Process), "--exit-code", strconv.Itoa(code), "--bytes", strconv.Itoa(bytes), "--lines", strconv.Itoa(lines))
	return code
}

func (tracker *Tracker) startedOutput(position int) (string, bool) {
	text := tracker.Folder.Output(position)
	return text, text != ""
}

// orphan ends a run in the foreground whose own shell has died: its group is stopped and the process is lost, so nothing is
// left running with no one to read it; the tick that finds a lost run late is only the backstop.
func (tracker *Tracker) orphan(stdout io.Writer) int {
	if pid, recorded := tracker.Folder.Pid(); recorded {
		_ = syscall.Kill(-pid, syscall.SIGTERM)
	}
	for waited := time.Duration(0); waited < 2*time.Second; waited += pollInterval {
		if _, ended := tracker.Folder.End(); ended {
			break
		}
		time.Sleep(pollInterval)
	}
	_ = tracker.Client.Run("process", "orphan", strconv.Itoa(tracker.Options.Process))
	fmt.Fprintf(stdout, "the shell of process %d is dead, so the run was stopped\n", tracker.Options.Process)
	return 1
}

// move leaves the shell running, tells the agent where its output will be and goes on in the background.
func (tracker *Tracker) move(stdout io.Writer) int {
	process := strconv.Itoa(tracker.Options.Process)
	for position := 1; position <= tracker.Parts; position++ {
		if _, ended := tracker.Folder.Status(position); !ended && !tracker.Reported[position] {
			if text, started := tracker.startedOutput(position); started {
				io.WriteString(stdout, Shown(text, tracker.Options.Process, tracker.Options.CapCharacters, false))
			}
			break
		}
	}
	fmt.Fprintf(stdout, "moved to the background: journal output read %s --summary when it ends\n", process)
	_ = tracker.Client.Run("process", "background", process)
	if tracker.Options.Detach != nil {
		tracker.Options.Detach(tracker.Options)
		return 0
	}
	go tracker.Watch()
	return 0
}
