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

// RequestReporter sends one request report to the journal.
type RequestReporter interface {
	ReportRequest(ctx context.Context, report client.RequestReport) error
}

// RequestReports keeps the request reports the journal has not acknowledged in one owner-only file, so a report
// made during an outage, or just before a restart, is sent again in its order once the journal answers.
type RequestReports struct {
	Folder string
	mutex  sync.Mutex
}

const pendingRequestReportsName = "pending-request-reports.json"

// Report saves the report, then sends every saved report in order; those the journal did not acknowledge stay for
// the next round, while one it refused is dropped, since sending it again would be refused again.
func (reports *RequestReports) Report(ctx context.Context, reporter RequestReporter, report client.RequestReport) error {
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()
	if err != nil {
		return err
	}
	return reports.sendAll(ctx, reporter, append(pending, report))
}

// Replay sends the reports kept from before, such as those a restart left unsent.
func (reports *RequestReports) Replay(ctx context.Context, reporter RequestReporter) error {
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()
	if err != nil {
		return err
	}
	return reports.sendAll(ctx, reporter, pending)
}

func (reports *RequestReports) sendAll(
	ctx context.Context,
	reporter RequestReporter,
	pending []client.RequestReport,
) error {
	var kept []client.RequestReport
	var failure error
	for index, report := range pending {
		if err := reporter.ReportRequest(ctx, report); isRetried(err) {
			kept, failure = pending[index:], err
			break
		}
	}
	return errors.Join(failure, reports.save(kept))
}

func (reports *RequestReports) pending() ([]client.RequestReport, error) {
	content, err := os.ReadFile(filepath.Join(reports.Folder, pendingRequestReportsName))
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var pending []client.RequestReport
	return pending, json.Unmarshal(content, &pending)
}

func (reports *RequestReports) save(pending []client.RequestReport) error {
	return writePrivateJSON(filepath.Join(reports.Folder, pendingRequestReportsName), pending)
}
