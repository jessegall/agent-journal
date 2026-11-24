package host

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	"journal-agent/client"
)

// UsageReporter sends usage reports to the journal.
type UsageReporter interface {
	NotifyUsage(ctx context.Context, report client.UsageReport) error
}

// UsageReports keeps the usage reports not yet acknowledged in their own owner-only file, apart from the start
// reports, and sends them on their own worker, so a usage retry never delays a lifecycle report. A newer window or
// thread count replaces a waiting one of the same window or thread; every cost waits until it is acknowledged.
type UsageReports struct {
	folder string
	mutex  sync.Mutex
	wake   chan struct{}
}

// pendingUsage is one queued report with the queue's own id, which is never sent.
type pendingUsage struct {
	ID     string             `json:"id"`
	Report client.UsageReport `json:"report"`
}

const (
	pendingUsageName = "pending-usage-reports.json"
	// mostPendingUsage bounds the file: a report past it is lost coverage, never a failed turn.
	mostPendingUsage    = 2000
	firstUsageBackoff   = time.Second
	longestUsageBackoff = 5 * time.Minute
	idleUsageCheck      = time.Minute
)

// ErrUsageQueueFull is returned when the queue holds as many reports as it may: the new one is not kept.
var ErrUsageQueueFull = errors.New("the usage report queue is full")

func NewUsageReports(folder string) *UsageReports {
	return &UsageReports{folder: folder, wake: make(chan struct{}, 1)}
}

// Queue saves the report before anything tries to send it, in place of a waiting report it supersedes.
func (reports *UsageReports) Queue(report client.UsageReport) error {
	id, err := newPendingID()
	if err != nil {
		return err
	}
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()
	if err != nil {
		return err
	}
	kept := make([]pendingUsage, 0, len(pending)+1)
	for _, waiting := range pending {
		if supersedes(report, waiting.Report) {
			continue
		}
		kept = append(kept, waiting)
	}
	if len(kept) >= mostPendingUsage {
		return ErrUsageQueueFull
	}
	if err := reports.save(append(kept, pendingUsage{ID: id, Report: report})); err != nil {
		return err
	}
	select {
	case reports.wake <- struct{}{}:
	default:
	}
	return nil
}

// Send sends every waiting report in order, outside the queue's lock, and forgets those the journal acknowledged or
// refused outright; the first failure that may pass on a retry stops the round and keeps the rest.
func (reports *UsageReports) Send(ctx context.Context, reporter UsageReporter) error {
	reports.mutex.Lock()
	pending, err := reports.pending()
	reports.mutex.Unlock()
	if err != nil {
		return err
	}
	var settled []string
	var failure error
	for _, waiting := range pending {
		err := reporter.NotifyUsage(ctx, waiting.Report)
		if isRetried(err) {
			failure = err
			break
		}
		if err != nil {
			log.Printf("the journal refused a usage report of start %s, so it is dropped: %v", waiting.Report.StartKey, err)
		}
		settled = append(settled, waiting.ID)
	}
	return errors.Join(failure, reports.forget(settled))
}

// Run sends the waiting reports whenever one is queued, and again after a failure with a backoff that doubles up to
// five minutes, until the context ends.
func (reports *UsageReports) Run(ctx context.Context, reporter UsageReporter) {
	backoff := firstUsageBackoff
	for {
		err := reports.Send(ctx, reporter)
		if err == nil {
			backoff = firstUsageBackoff
			if !reports.waitForWork(ctx) {
				return
			}
			continue
		}
		log.Printf("usage reports wait for the journal: %v", err)
		if !sleepFor(ctx, backoff) {
			return
		}
		backoff = min(backoff*2, longestUsageBackoff)
	}
}

// waitForWork waits for a new report, or a minute for reports left from before a restart; false once the context
// ended.
func (reports *UsageReports) waitForWork(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return false
	case <-reports.wake:
		return true
	case <-time.After(idleUsageCheck):
		return true
	}
}

func sleepFor(ctx context.Context, delay time.Duration) bool {
	select {
	case <-ctx.Done():
		return false
	case <-time.After(delay):
		return true
	}
}

// supersedes is whether a newer report makes a waiting one pointless: a reading of the same window, or a count of
// the same thread, of the same start and generation. A cost never supersedes anything.
func supersedes(newer, waiting client.UsageReport) bool {
	if newer.StartKey != waiting.StartKey || newer.Generation != waiting.Generation {
		return false
	}
	if newer.Measurement.Type != waiting.Measurement.Type {
		return false
	}
	switch newer.Measurement.Type {
	case client.UsageWindow:
		return newer.Measurement.LimitID == waiting.Measurement.LimitID &&
			newer.Measurement.Slot == waiting.Measurement.Slot
	case client.UsageThreadTokens:
		return newer.Measurement.ThreadID == waiting.Measurement.ThreadID
	default:
		return false
	}
}

func (reports *UsageReports) forget(settled []string) error {
	if len(settled) == 0 {
		return nil
	}
	gone := make(map[string]bool, len(settled))
	for _, id := range settled {
		gone[id] = true
	}
	reports.mutex.Lock()
	defer reports.mutex.Unlock()
	pending, err := reports.pending()
	if err != nil {
		return err
	}
	kept := make([]pendingUsage, 0, len(pending))
	for _, waiting := range pending {
		if gone[waiting.ID] {
			continue
		}
		kept = append(kept, waiting)
	}
	return reports.save(kept)
}

func (reports *UsageReports) pending() ([]pendingUsage, error) {
	content, err := os.ReadFile(filepath.Join(reports.folder, pendingUsageName))
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var pending []pendingUsage
	return pending, json.Unmarshal(content, &pending)
}

func (reports *UsageReports) save(pending []pendingUsage) error {
	return writePrivateJSON(filepath.Join(reports.folder, pendingUsageName), pending)
}

func newPendingID() (string, error) {
	random := make([]byte, 8)
	if _, err := rand.Read(random); err != nil {
		return "", err
	}
	return hex.EncodeToString(random), nil
}
