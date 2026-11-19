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
		outcome := reconcileStart(startKey, records)
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

func reconcileStart(startKey string, records []StartRecord) Reconciliation {
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
