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
	// StopProven means no process of the group is left: the leader and every tool child it started are gone.
	StopProven StopOutcome = iota
	// StopUnconfirmed means the signals were sent but the group could not be proven empty within the bounds, or its
	// processes could not be observed: the obligation to end it stays.
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

// stopPoll is how often a stop looks whether the group has ended.
const stopPoll = 50 * time.Millisecond

// StopStagesOf bounds a stop by the grace and force waits the journal sent.
func StopStagesOf(grace, force time.Duration) StopStages {
	return StopStages{Grace: grace, Force: force, Poll: stopPoll}
}

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

// Membership is what the system says of a process group: some process is still in it, none is, or it could not
// be asked.
type Membership int

const (
	MembersRemain Membership = iota
	NoMembers
	Unobservable
)

// Members asks the system whether any process is still in the group: the leader or a tool child it started. A
// failed question is never taken for an empty group.
func (group OwnedGroup) Members() Membership {
	err := syscall.Kill(-group.Pid, 0)
	switch {
	case errors.Is(err, syscall.ESRCH):
		return NoMembers
	case err == nil || errors.Is(err, syscall.EPERM):
		return MembersRemain
	default:
		return Unobservable
	}
}

// Stop ends the group in two bounded stages, the graceful signal and then the force signal, and answers proven only
// when no process of the group is left, tool children included; a signal sent or a leader gone is never taken as
// proof. A leader whose process id now names another program is not signalled at all.
func (group OwnedGroup) Stop(stages StopStages) StopOutcome {
	if group.Members() == NoMembers {
		return StopProven
	}
	if group.leaderReused() {
		return StopNotOwned
	}
	_ = syscall.Kill(-group.Pid, syscall.SIGTERM)
	if outcome := group.emptiesWithin(stages.Grace, stages.Poll); outcome != StopUnconfirmed {
		return outcome
	}
	_ = syscall.Kill(-group.Pid, syscall.SIGKILL)

	return group.emptiesWithin(stages.Force, stages.Poll)
}

// leaderReused answers whether the group's process id runs a program the host did not start: alive, with another
// start identity.
func (group OwnedGroup) leaderReused() bool {
	identity, err := startIdentityOf(group.Pid)
	return err == nil && identity != group.StartIdentity
}

// emptiesWithin waits up to the bound for the group to have no process left.
func (group OwnedGroup) emptiesWithin(bound time.Duration, poll time.Duration) StopOutcome {
	deadline := time.Now().Add(bound)
	for {
		if group.Members() == NoMembers {
			return StopProven
		}
		if time.Now().After(deadline) {
			return StopUnconfirmed
		}
		time.Sleep(poll)
	}
}
