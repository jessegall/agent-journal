package host

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sync"

	"journal-agent/client"
)

// StartReport is one lifecycle report the journal must hear about an account start: running with its execution,
// stopped once its whole group is gone, or failed with a named failure.
type StartReport struct {
	StartKey  string `json:"start_key"`
	Kind      string `json:"kind"`
	Execution string `json:"execution,omitempty"`
	Failure   string `json:"failure,omitempty"`
}

const (
	NotifyRunning = "running"
	NotifyStopped = "stopped"
	ReportFailed  = "failed"
)

// StartReporter sends start reports to the journal.
type StartReporter interface {
	NotifyRunning(ctx context.Context, startKey, executionID string) error
	NotifyStopped(ctx context.Context, startKey string) error
	NotifyFailure(ctx context.Context, startKey, failure string) error
}

// StartReports keeps the start reports not yet acknowledged in one owner-only file, so an outage or a restart never
// loses the journal's account-use obligations; a report leaves the file only once the journal acknowledged it.
type StartReports struct {
	Folder string
	mutex  sync.Mutex
}

const pendingReportsName = "pending-start-reports.json"

// Queue saves the report before anything tries to send it.
func (reports *StartReports) Queue(report StartReport) error {
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()
	if err != nil {
		return err
	}
	return reports.save(append(pending, report))
}

// Send sends every queued report in order and keeps those the journal did not acknowledge; a report the journal
// refused outright is dropped, since sending it again would be refused again.
func (reports *StartReports) Send(ctx context.Context, reporter StartReporter) error {
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()
	if err != nil {
		return err
	}
	var kept []StartReport
	var failures []error
	for index, report := range pending {
		if err := send(ctx, reporter, report); isRetried(err) {
			kept = append(kept, pending[index:]...)
			failures = append(failures, err)
			break
		}
	}
	return errors.Join(append(failures, reports.save(kept))...)
}

// Count is how many reports the journal has not acknowledged yet.
func (reports *StartReports) Count() (int, error) {
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()

	return len(pending), err
}

// isRetried is whether a report's failure keeps it for the next round: a refusal and a grant the journal already
// holds are settled answers, every other failure is not.
func isRetried(err error) bool {
	return err != nil && !errors.Is(err, client.ErrRefused) && !errors.Is(err, client.ErrAlreadyGranted)
}

func send(ctx context.Context, reporter StartReporter, report StartReport) error {
	switch report.Kind {
	case NotifyRunning:
		return reporter.NotifyRunning(ctx, report.StartKey, report.Execution)
	case NotifyStopped:
		return reporter.NotifyStopped(ctx, report.StartKey)
	default:
		return reporter.NotifyFailure(ctx, report.StartKey, report.Failure)
	}
}

func (reports *StartReports) pending() ([]StartReport, error) {
	content, err := os.ReadFile(filepath.Join(reports.Folder, pendingReportsName))
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var pending []StartReport
	return pending, json.Unmarshal(content, &pending)
}

func (reports *StartReports) save(pending []StartReport) error {
	return writePrivateJSON(filepath.Join(reports.Folder, pendingReportsName), pending)
}
