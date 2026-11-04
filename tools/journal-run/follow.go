package main

import (
	"fmt"
	"io"
	"strconv"
	"syscall"
	"time"
)

const (
	reportAttempts      = 60
	reportRetryInterval = time.Second
)

// Tracker reads a run's folder as the shell fills it: it shows what the agent sees as each part ends, reports each
// part and the end through the journal client, and moves the run to the background past its limit.
type Tracker struct {
	Options     Options
	Client      Client
	Folder      Folder
	Parts       int
	LastJournal int
	Reported    map[int]bool
	Started     map[int]bool
	Shown       int
	// Stripped holds the parts that reach the agent only through their pipes.
	Stripped map[int]bool
}

func (tracker *Tracker) Run(stdout io.Writer) int {
	started := time.Now()
	for {
		tracker.reportParts(stdout)
		if code, ended := tracker.Folder.End(); ended {
			return tracker.finish(stdout, code)
		}
		if !tracker.Options.ShellAlive() {
			return tracker.orphan(stdout)
		}
		if tracker.mayMove(started) {
			return tracker.move(stdout)
		}
		time.Sleep(pollInterval)
	}
}

// mayMove says whether the run may go to the background: never before the line's last journal command has finished.
func (tracker *Tracker) mayMove(started time.Time) bool {
	for position := 1; position <= tracker.LastJournal; position++ {
		if _, isPart := tracker.Stripped[position]; !isPart {
			continue
		}
		if _, ended := tracker.Folder.Status(position); !ended {
			return false
		}
	}
	limit := time.Duration(tracker.Options.LimitSeconds) * time.Second
	return tracker.Options.Background || tracker.Folder.MoveAsked() || (limit > 0 && time.Since(started) >= limit)
}

// Watch follows a moved run as a program of its own until the run ends or its folder has been pruned.
func (tracker *Tracker) Watch() {
	for position := 1; position <= tracker.Parts; position++ {
		if _, ended := tracker.Folder.Status(position); ended {
			tracker.Reported[position] = true
		}
		if tracker.Folder.Started(position) {
			tracker.markStarted(position)
		}
	}
	if pid, recorded := tracker.Folder.Pid(); recorded {
		go writeHeartbeats(tracker.Folder, pid, HeartbeatInterval)
	}
	for tracker.Folder.Exists() {
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

// lastEnded is the last part with a status: every part before it has ended too or was skipped, so reading from the
// end first keeps the parts in the order of the line while the shell races ahead.
func (tracker *Tracker) lastEnded() int {
	for position := tracker.Parts; position >= 1; position-- {
		if _, ended := tracker.Folder.Status(position); ended {
			return position
		}
	}
	return 0
}

// reportParts reports each part that began and then each that ended, in the order of the line, so a part's start is
// always told before its end.
func (tracker *Tracker) reportParts(stdout io.Writer) {
	last := tracker.lastEnded()
	for position := 1; position <= tracker.Parts; position++ {
		code, ended := tracker.Folder.Status(position)
		ended = ended && position <= last
		if tracker.Folder.Started(position) {
			tracker.Folder.CutOutput(position, tracker.Options.MostOutputBytes)
		}
		if (ended || tracker.Folder.Started(position)) && !tracker.Reported[position] {
			tracker.partStarted(position)
		}
		if ended && !tracker.Reported[position] {
			tracker.partEnded(stdout, position, code)
		}
	}
}

// markStarted notes that a part's start is told, and says whether it was told before.
func (tracker *Tracker) markStarted(position int) bool {
	if tracker.Started == nil {
		tracker.Started = map[int]bool{}
	}
	told := tracker.Started[position]
	tracker.Started[position] = true
	return told
}

func (tracker *Tracker) partStarted(position int) {
	if tracker.markStarted(position) {
		return
	}
	tracker.report("process", "part-start", strconv.Itoa(tracker.Options.Process), "--position", strconv.Itoa(position))
}

func (tracker *Tracker) partEnded(stdout io.Writer, position, code int) {
	tracker.partStarted(position)
	tracker.Reported[position] = true
	if stdout != io.Discard {
		tracker.showPart(stdout, position)
	}
	tracker.report("process", "part-end", strconv.Itoa(tracker.Options.Process), "--position", strconv.Itoa(position), "--exit-code", strconv.Itoa(code))
}

func (tracker *Tracker) showPart(stdout io.Writer, position int) {
	uncapped := tracker.Options.LimitSeconds == 0
	mostBytes := mostReadBytes
	if uncapped {
		mostBytes = tracker.Options.MostOutputBytes
	}
	text, size := tracker.Folder.Result(position, mostBytes)
	io.WriteString(stdout, Shown(text, size, tracker.Options.Process, tracker.Options.CapCharacters, uncapped))
	if text == "" && tracker.Folder.CommandFailed(position) {
		fmt.Fprintf(stdout, "the command failed and its pipes printed nothing: journal output read %d --summary\n", tracker.Options.Process)
	}
}

// report tells the journal of an end, and tells it again while the server is away, as during a restart.
func (tracker *Tracker) report(arguments ...string) {
	for attempt := 0; attempt < reportAttempts; attempt++ {
		if tracker.Client.Run(arguments...) == nil || (tracker.Client.Reachable() && !tracker.Client.Restarting()) {
			return
		}
		time.Sleep(reportRetryInterval)
	}
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
	tracker.report("process", "end", strconv.Itoa(tracker.Options.Process), "--exit-code", strconv.Itoa(code), "--bytes", strconv.Itoa(bytes), "--lines", strconv.Itoa(lines))
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
	tracker.reportParts(stdout)
	process := strconv.Itoa(tracker.Options.Process)
	for position := 1; position <= tracker.Parts; position++ {
		stripped, isPart := tracker.Stripped[position]
		if _, ended := tracker.Folder.Status(position); isPart && !ended && !tracker.Reported[position] {
			if _, started := tracker.startedOutput(position); started && !stripped {
				text, size := tracker.Folder.Result(position, mostReadBytes)
				io.WriteString(stdout, Shown(text, size, tracker.Options.Process, tracker.Options.CapCharacters, false))
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
