package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"syscall"
	"time"
)

const (
	reportAttempts      = 60
	reportRetryInterval = time.Second
	keepCuttingInterval = time.Second
	// lateOutputWait gives a part with & that ends the line a moment to print before the agent is answered.
	lateOutputWait = 100 * time.Millisecond
)

// Tracker reads a run's folder as the shell fills it: it shows what the agent sees as each part ends, reports each
// part and the end through the journal client, and moves the run to the background past its limit.
type Tracker struct {
	Options  Options
	Client   Client
	Folder   Folder
	Parts    int
	Reported map[int]bool
	Started  map[int]bool
	Shown    int
	// Positions are the positions of the line's parts; the others are commands inside a pipe.
	Positions map[int]bool
	// Background holds the parts that ended with &, which go on writing after their status, and ShownBytes how much
	// of each part the agent has seen.
	Background []int
	ShownBytes map[int]int
	Now        func() time.Time
	Wait       func()
	// Waited is the time spent telling the journal of an end while its server was away, which no limit counts: a command that ends while
	// the server restarts is not moved to the background for the time the restart took.
	Waited time.Duration
}

func (tracker *Tracker) Run(stdout io.Writer) int {
	started := tracker.now()
	queueStarted := started
	for {
		tracker.reportParts(stdout)
		if code, ended := tracker.Folder.End(); ended {
			return tracker.finish(stdout, code)
		}
		if !tracker.Options.ShellAlive() {
			return tracker.orphan(stdout)
		}
		if tracker.waitsForSlot() {
			if tracker.now().Sub(queueStarted)-tracker.Waited >= tracker.Options.QueueWait {
				return tracker.move(stdout)
			}
			tracker.wait()
			started = tracker.now()
			tracker.Waited = 0
			continue
		}
		if tracker.mayMove(started) {
			return tracker.move(stdout)
		}
		tracker.wait()
	}
}

func (tracker *Tracker) waitsForSlot() bool {
	if !tracker.Options.Queue {
		return false
	}
	_, err := os.Stat(filepath.Join(tracker.Folder.Path, "slot"))
	return os.IsNotExist(err)
}

// mayMove says whether the run reached its foreground limit or was asked to move.
func (tracker *Tracker) mayMove(started time.Time) bool {
	limit := time.Duration(tracker.Options.LimitSeconds) * time.Second
	return tracker.Options.Background || tracker.Folder.MoveAsked() || (limit > 0 && tracker.now().Sub(started)-tracker.Waited >= limit)
}

func (tracker *Tracker) now() time.Time {
	if tracker.Now != nil {
		return tracker.Now()
	}
	return time.Now()
}

func (tracker *Tracker) wait() {
	if tracker.Wait != nil {
		tracker.Wait()
	} else {
		time.Sleep(pollInterval)
	}
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
		tracker.Folder.WriteHeartbeat()
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
	hasStarted := tracker.Started[position]
	tracker.Started[position] = true
	return hasStarted
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
		tracker.showLateOutput(stdout)
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
	if readFlag, hasFlag := tracker.Options.ReadFlags[position]; hasFlag {
		text, size := tracker.Folder.OutputEnd(position, mostReadBytes)
		if tracker.ShownBytes != nil {
			tracker.ShownBytes[position] = size.Bytes
		}
		io.WriteString(stdout, Shown(readLines(text, readFlag), size, tracker.Options.Process, ReadCapCharacters, false, "--summary"))
		return
	}
	text, size := tracker.Folder.OutputEnd(position, mostBytes)
	if tracker.ShownBytes != nil {
		tracker.ShownBytes[position] = size.Bytes
	}
	io.WriteString(stdout, Shown(text, size, tracker.Options.Process, tracker.Options.CapCharacters, uncapped, "--summary"))
}

// report tells the journal of an end, and tells it again while the server is away, as during a restart.
func (tracker *Tracker) report(arguments ...string) {
	began := tracker.now()
	retried := false
	defer func() {
		if retried {
			tracker.Waited += tracker.now().Sub(began)
		}
	}()
	for attempt := 0; attempt < reportAttempts; attempt++ {
		if tracker.Client.Run(arguments...) == nil || (tracker.Client.Reachable() && !tracker.Client.Restarting()) {
			return
		}
		retried = true
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
	if len(tracker.Background) > 0 {
		time.Sleep(lateOutputWait)
	}
	tracker.showLateOutput(stdout)
	bytes, lines := tracker.Folder.Sizes(tracker.Parts)
	tracker.report("process", "end", strconv.Itoa(tracker.Options.Process), "--exit-code", strconv.Itoa(code), "--bytes", strconv.Itoa(bytes), "--lines", strconv.Itoa(lines))
	if len(tracker.Background) > 0 && tracker.Options.Detach != nil {
		StartCutting(tracker.Options, tracker.Parts)
	}
	if !tracker.Options.OnlyReads && tracker.Options.ScanFiles != nil {
		tracker.Options.ScanFiles(tracker.Options)
	}
	return code
}

// KeepCutting keeps the outputs of a run under the limit for as long as anything of its process group lives, since a
// part with & may write long after its line ended.
func (tracker *Tracker) KeepCutting() {
	pid, recorded := tracker.Folder.Pid()
	for recorded && tracker.Folder.Exists() && syscall.Kill(-pid, 0) == nil {
		for position := 1; position <= tracker.Parts; position++ {
			tracker.Folder.CutOutput(position, tracker.Options.MostOutputBytes)
		}
		time.Sleep(keepCuttingInterval)
	}
}

// showLateOutput shows what a part with & wrote since it was shown, since it goes on past its own status: before the
// next part's output, so the order stays that of the line, and once more at the end.
func (tracker *Tracker) showLateOutput(stdout io.Writer) {
	for _, position := range tracker.Background {
		shown, isShown := tracker.ShownBytes[position]
		text, size := tracker.Folder.OutputEnd(position, mostReadBytes)
		if isShown && size.Bytes > shown && size.Bytes <= len(text) {
			io.WriteString(stdout, Shown(text[shown:], size, tracker.Options.Process, tracker.Options.CapCharacters, false, "--summary"))
			tracker.ShownBytes[position] = size.Bytes
		}
	}
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
		if _, ended := tracker.Folder.Status(position); tracker.Positions[position] && !ended && !tracker.Reported[position] {
			if _, started := tracker.startedOutput(position); started {
				text, size := tracker.Folder.OutputEnd(position, mostReadBytes)
				io.WriteString(stdout, Shown(text, size, tracker.Options.Process, tracker.Options.CapCharacters, false, "--summary"))
			}
			break
		}
	}
	if tracker.waitsForSlot() {
		fmt.Fprintf(stdout, "queued as output %s; you will be told when it ends; work on or wait\n", process)
	} else {
		fmt.Fprintf(stdout, "moved to the background: output %s\n", process)
	}
	_ = tracker.Client.Run("process", "background", process)
	if tracker.Options.Detach != nil {
		tracker.Options.Detach(tracker.Options)
		return 0
	}
	go tracker.Watch()
	return 0
}
