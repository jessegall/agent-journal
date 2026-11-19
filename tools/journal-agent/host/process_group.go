package host

import (
	"errors"
	"syscall"
	"time"
)

// ErrNotOwned is returned when a process group's leader is no longer the child the host started: its process id was
// reused by another program, so nothing is signalled.
var ErrNotOwned = errors.New("the process is not the child the host started")

// StopOutcome is how a bounded stop of an owned process group ended.
type StopOutcome int

const (
	// StopProven means the group leader is gone.
	StopProven StopOutcome = iota
	// StopUnconfirmed means the signals were sent but the leader could not be proven gone within the bounds.
	StopUnconfirmed
	// StopNotOwned means the process id now belongs to another program, so nothing was signalled.
	StopNotOwned
)

// StopStages bounds a stop: how long the group has to end after the graceful signal, and after the force signal.
type StopStages struct {
	Grace time.Duration
	Force time.Duration
	Poll  time.Duration
}

// DefaultStopStages are the bounds a driver's stop uses.
var DefaultStopStages = StopStages{Grace: 5 * time.Second, Force: 2 * time.Second, Poll: 50 * time.Millisecond}

// OwnedGroup is a child the host started, known by its process id and the start time the system recorded for it, so a
// reused process id is never taken for the child.
type OwnedGroup struct {
	Pid           int
	StartIdentity string
}

// OwnedGroupOf records the child that was just started.
func OwnedGroupOf(pid int) OwnedGroup {
	identity, _ := startIdentityOf(pid)

	return OwnedGroup{Pid: pid, StartIdentity: identity}
}

// IsOwned answers whether the process id still names the child the host started.
func (group OwnedGroup) IsOwned() bool {
	if group.Pid <= 0 || group.StartIdentity == "" {
		return false
	}
	identity, err := startIdentityOf(group.Pid)

	return err == nil && identity == group.StartIdentity
}

// Signal sends the signal to the whole group, only while it is still the child the host started.
func (group OwnedGroup) Signal(signal syscall.Signal) error {
	if !group.IsOwned() {
		return ErrNotOwned
	}

	return syscall.Kill(-group.Pid, signal)
}

// Stop ends the group in two bounded stages, the graceful signal and then the force signal, and answers proven only
// when the leader is gone; a signal sent is never taken as proof of exit.
func (group OwnedGroup) Stop(stages StopStages) StopOutcome {
	if !group.IsOwned() {
		return StopNotOwned
	}
	if group.Signal(syscall.SIGTERM) == nil && group.endsWithin(stages.Grace, stages.Poll) {
		return StopProven
	}
	if !group.IsOwned() {
		return StopProven
	}
	if group.Signal(syscall.SIGKILL) == nil && group.endsWithin(stages.Force, stages.Poll) {
		return StopProven
	}

	return StopUnconfirmed
}

// endsWithin waits up to the bound for the leader to be gone, or to be no longer the child the host started.
func (group OwnedGroup) endsWithin(bound time.Duration, poll time.Duration) bool {
	deadline := time.Now().Add(bound)
	for {
		if !group.IsOwned() {
			return true
		}
		if time.Now().After(deadline) {
			return false
		}
		time.Sleep(poll)
	}
}
