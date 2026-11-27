package hostapi

import (
	"encoding/json"
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// ReportsBackoffLimit is the longest the queue waits before it sends again after a failure.
const ReportsBackoffLimit = 15 * time.Second

// ReportQueue keeps process reports on disk in the order they happened and sends them one at a time, so a report
// made while the journal is away is sent once it is back, in order per process. A failed send waits twice as long
// each time, at most ReportsBackoffLimit, and Retry sends at once, as after a heartbeat that went through.
type ReportQueue struct {
	path  string
	send  func(ProcessReport) error
	mutex sync.Mutex
	queue []ProcessReport
	wake  chan struct{}
	first time.Duration
}

// OpenReportQueue reads the reports the host had not sent yet from its state folder.
func OpenReportQueue(stateFolder string, send func(ProcessReport) error) (*ReportQueue, error) {
	queue := &ReportQueue{
		path:  filepath.Join(stateFolder, "orders", "reports.json"),
		send:  send,
		wake:  make(chan struct{}, 1),
		first: time.Second,
	}
	content, err := os.ReadFile(queue.path)
	if errors.Is(err, fs.ErrNotExist) {
		return queue, nil
	}
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(content, &queue.queue); err != nil {
		return nil, err
	}
	return queue, nil
}

// Add keeps the report on disk and wakes the sender.
func (queue *ReportQueue) Add(report ProcessReport) error {
	queue.mutex.Lock()
	queue.queue = append(queue.queue, report)
	err := queue.save()
	queue.mutex.Unlock()
	queue.Retry()
	return err
}

// Retry makes the sender try again now.
func (queue *ReportQueue) Retry() {
	select {
	case queue.wake <- struct{}{}:
	default:
	}
}

// Pending are the reports not sent yet, oldest first.
func (queue *ReportQueue) Pending() []ProcessReport {
	queue.mutex.Lock()
	defer queue.mutex.Unlock()
	return append([]ProcessReport(nil), queue.queue...)
}

// Run sends the reports until stopped is closed.
func (queue *ReportQueue) Run(stopped <-chan struct{}) {
	wait := queue.first
	for {
		if queue.sendFirst() {
			wait = queue.first
			continue
		}
		timer := time.NewTimer(wait)
		select {
		case <-stopped:
			timer.Stop()
			return
		case <-queue.wake:
			timer.Stop()
		case <-timer.C:
			if len(queue.Pending()) > 0 {
				wait = min(wait*2, ReportsBackoffLimit)
			}
		}
	}
}

// sendFirst sends the oldest report and drops it once sent; it answers whether one was sent.
func (queue *ReportQueue) sendFirst() bool {
	pending := queue.Pending()
	if len(pending) == 0 || queue.send(pending[0]) != nil {
		return false
	}
	queue.mutex.Lock()
	defer queue.mutex.Unlock()
	queue.queue = queue.queue[1:]
	_ = queue.save()
	return true
}

func (queue *ReportQueue) save() error {
	content, err := json.Marshal(queue.queue)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(queue.path), 0o700); err != nil {
		return err
	}
	temporary := queue.path + ".new"
	if err := os.WriteFile(temporary, content, 0o600); err != nil {
		return err
	}
	return os.Rename(temporary, queue.path)
}
