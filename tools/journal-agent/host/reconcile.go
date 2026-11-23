package host

import (
	"context"
	"log"
	"slices"
)

// ReconcileJournal is what a restarted host asks the journal: its starts that may still run, and which of those
// it proved gone.
type ReconcileJournal interface {
	StartReporter
	UnresolvedStarts(ctx context.Context) ([]string, error)
	ReconcileStarts(ctx context.Context, stopped []string) (int, error)
}

// ReconcileOutcome is what reconciliation concluded about one start the journal still counted as possibly running.
type ReconcileOutcome struct {
	StartKey string
	Outcome  Reconciliation
}

// ReconcileOnBoot sends the reports queued before the restart, then compares each start the journal counts as
// possibly running with the host's own records: only a start whose whole process group is proven gone is reported
// stopped; a start with no record, no known execution or a process the host cannot prove is left needing attention,
// and nothing is started again.
func ReconcileOnBoot(
	ctx context.Context,
	journal ReconcileJournal,
	states StartStates,
	reports *StartReports,
	sessions ContainerSessions,
) ([]ReconcileOutcome, error) {
	if err := reports.Send(ctx, journal); err != nil {
		log.Printf("start reports from before the restart wait for the journal: %v", err)
	}
	unresolved, err := journal.UnresolvedStarts(ctx)
	if err != nil {
		return nil, err
	}
	records, err := states.All()
	if err != nil {
		return nil, err
	}
	var outcomes []ReconcileOutcome
	var stopped []string
	for _, startKey := range unresolved {
		outcome := reconcileStart(startKey, records, sessions)
		outcomes = append(outcomes, ReconcileOutcome{StartKey: startKey, Outcome: outcome})
		if outcome == Exited {
			stopped = append(stopped, startKey)
		}
	}
	if len(stopped) > 0 {
		if _, err := journal.ReconcileStarts(ctx, stopped); err != nil {
			return outcomes, err
		}
	}
	return outcomes, nil
}

// ContainerSessions are the containers of this installation the agent daemon holds, by the session each runs; a
// local host has none.
type ContainerSessions map[string]LabelledContainer

// ContainerSessionsOf lists the installation's containers on the agent daemon, by session, as a host finds them when
// it starts. One still running lost the host that drove its program, and its terminal and conversation went with
// that host, so it is removed here: no session is left looking alive while nothing serves it.
func ContainerSessionsOf(ctx context.Context, containers Containers, installation string) (ContainerSessions, error) {
	found, err := containers.Labelled(ctx, installation)
	if err != nil {
		return nil, err
	}

	sessions := ContainerSessions{}
	for _, container := range found {
		if container.Running {
			container.Running = containers.removeRunning(ctx, container.ID) != nil
		}

		sessions[container.Session] = container
	}

	return sessions, nil
}

// reconcileContainer proves a contained start by its container: one stopped, removed when the host started or gone
// from the daemon, which lists stopped containers too, has exited; one that could not be removed still runs with
// nothing serving it and needs attention.
func (sessions ContainerSessions) reconcileContainer(record StartRecord) Reconciliation {
	container, found := sessions[record.SessionID]
	if found && container.Running {
		return NeedsAttention
	}

	return Exited
}

func reconcileStart(startKey string, records []StartRecord, sessions ContainerSessions) Reconciliation {
	index := slices.IndexFunc(records, func(record StartRecord) bool {
		return record.Claim != nil && record.Claim.StartKey == startKey
	})
	if index < 0 {
		return NeedsAttention
	}
	record := records[index]
	switch {
	case record.Stage == ExitKnown || record.Stage == ReportAcknowledged:
		return Exited
	case record.RunsInContainer():
		return sessions.reconcileContainer(record)
	case record.Execution == nil:
		return NeedsAttention
	case (OwnedGroup{Pid: record.Execution.ProcessID}).Members() == NoMembers:
		return Exited
	case (OwnedGroup{Pid: record.Execution.ProcessID, StartIdentity: record.Execution.StartIdentity}).IsOwned():
		return Adopted
	default:
		return NeedsAttention
	}
}
