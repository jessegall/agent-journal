package main

import (
	"fmt"
	"io"
	"strconv"
	"syscall"
	"time"
)

// Follower reads a run's folder as the shell fills it: it shows what the agent sees as each part ends, reports each
// part and the end through the journal client, and moves the run to the background past its limit.
type Follower struct {
	Options  Options
	Client   Client
	Folder   Folder
	Parts    int
	Reported map[int]bool
	Shown    int
}

func (follower *Follower) Run(stdout io.Writer) int {
	started := time.Now()
	if follower.Options.Background {
		return follower.move(stdout)
	}
	for {
		follower.reportParts(stdout)
		if code, ended := follower.Folder.End(); ended {
			return follower.finish(stdout, code)
		}
		limit := time.Duration(follower.Options.LimitSeconds) * time.Second
		if limit > 0 && time.Since(started) >= limit {
			return follower.move(stdout)
		}
		time.Sleep(pollInterval)
	}
}

// Watch follows a run that moved until it ends, as a program of its own.
func (follower *Follower) Watch() {
	for position := 1; position <= follower.Parts; position++ {
		if _, ended := follower.Folder.Status(position); ended {
			follower.Reported[position] = true
		}
	}
	for {
		follower.reportParts(io.Discard)
		if code, ended := follower.Folder.End(); ended {
			follower.finish(io.Discard, code)
			return
		}
		if pid, known := follower.Folder.Pid(); known && syscall.Kill(pid, 0) != nil {
			_ = follower.Folder.WriteEnd(1)
		}
		time.Sleep(pollInterval)
	}
}

func (follower *Follower) reportParts(stdout io.Writer) {
	for position := 1; position <= follower.Parts; position++ {
		if code, ended := follower.Folder.Status(position); ended && !follower.Reported[position] {
			follower.partEnded(stdout, position, code)
		}
	}
}

func (follower *Follower) partEnded(stdout io.Writer, position, code int) {
	follower.Reported[position] = true
	whole := follower.Options.LimitSeconds == 0
	io.WriteString(stdout, Shown(follower.Folder.Output(position), follower.Options.Process, follower.Options.CapCharacters, whole))
	_ = follower.Client.Run("process", "part-end", strconv.Itoa(follower.Options.Process), "--position", strconv.Itoa(position), "--exit-code", strconv.Itoa(code))
}

// finish reports a part the shell ended before it could write its status, then the end of the chain.
func (follower *Follower) finish(stdout io.Writer, code int) int {
	follower.reportParts(stdout)
	for position := follower.Parts; position >= 1; position-- {
		if follower.Reported[position] {
			break
		}
		if _, started := follower.startedOutput(position); started {
			follower.partEnded(stdout, position, code)
			break
		}
	}
	bytes, lines := follower.Folder.Sizes(follower.Parts)
	_ = follower.Client.Run("process", "end", strconv.Itoa(follower.Options.Process), "--exit-code", strconv.Itoa(code), "--bytes", strconv.Itoa(bytes), "--lines", strconv.Itoa(lines))
	return code
}

func (follower *Follower) startedOutput(position int) (string, bool) {
	text := follower.Folder.Output(position)
	return text, text != ""
}

// move leaves the shell running, tells the agent where its output will be and goes on in the background.
func (follower *Follower) move(stdout io.Writer) int {
	process := strconv.Itoa(follower.Options.Process)
	for position := 1; position <= follower.Parts; position++ {
		if _, ended := follower.Folder.Status(position); !ended && !follower.Reported[position] {
			if text, started := follower.startedOutput(position); started {
				io.WriteString(stdout, Shown(text, follower.Options.Process, follower.Options.CapCharacters, false))
			}
			break
		}
	}
	fmt.Fprintf(stdout, "moved to the background: journal output read %s --summary when it ends\n", process)
	_ = follower.Client.Run("process", "background", process)
	if follower.Options.Detach != nil {
		follower.Options.Detach(follower.Options)
		return 0
	}
	go follower.Watch()
	return 0
}
