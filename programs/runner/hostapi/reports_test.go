package hostapi

import (
	"errors"
	"sync"
	"testing"
	"time"

	"journal-runner/client"
)

// A report about a process the journal no longer knows is answered as gone: the queue drops it and sends the reports
// behind it, instead of sending it again forever while they wait.
func TestReportQueueDropsAReportOfAGoneProcessAndSendsTheOnesAfterIt(t *testing.T) {
	var mutex sync.Mutex
	var sent []string
	queue, err := OpenReportQueue(t.TempDir(), func(report ProcessReport) error {
		mutex.Lock()
		defer mutex.Unlock()
		if report.ProcessID == "removed" {
			return client.ErrGone
		}
		sent = append(sent, report.ProcessID)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	for _, process := range []string{"removed", "probe-1", "probe-2"} {
		if err := queue.Add(ProcessReport{ProcessID: process, Report: ProcessReportExited}); err != nil {
			t.Fatal(err)
		}
	}

	runQueue(t, queue)

	waitFor(t, func() bool { return len(queue.Pending()) == 0 })
	mutex.Lock()
	defer mutex.Unlock()
	if len(sent) != 2 || sent[0] != "probe-1" || sent[1] != "probe-2" {
		t.Fatalf("the reports after the gone one were not sent in order: %v", sent)
	}
}

// Any other failure keeps the report, in order, to be sent again once the journal takes it.
func TestReportQueueKeepsAReportTheJournalCouldNotTake(t *testing.T) {
	queue, err := OpenReportQueue(t.TempDir(), func(ProcessReport) error {
		return errors.Join(client.ErrUncertain, errors.New("the journal is away"))
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := queue.Add(ProcessReport{ProcessID: "probe-1", Report: ProcessReportRunning}); err != nil {
		t.Fatal(err)
	}

	runQueue(t, queue)
	time.Sleep(50 * time.Millisecond)

	if pending := queue.Pending(); len(pending) != 1 || pending[0].ProcessID != "probe-1" {
		t.Fatalf("the report the journal could not take was not kept: %v", pending)
	}
}

func waitFor(t *testing.T, done func() bool) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	for !done() {
		if time.Now().After(deadline) {
			t.Fatal("the queue did not move on in time")
		}
		time.Sleep(10 * time.Millisecond)
	}
}
