package host

import (
	"context"
	"errors"
	"testing"

	"journal-agent/client"
)

type flakyReporter struct {
	down bool
	sent []string
}

func (reporter *flakyReporter) NotifyRequest(_ context.Context, report client.RequestReport) error {
	if reporter.down {
		return errors.New("the journal cannot be reached")
	}
	reporter.sent = append(reporter.sent, report.RequestID)
	return nil
}

func TestARequestReportMadeDuringAnOutageIsReplayedInOrderAfterARestart(t *testing.T) {
	folder := t.TempDir()
	reporter := &flakyReporter{down: true}
	before := &Notify{Folder: folder}
	_ = before.Notify(context.Background(), reporter, client.RequestReport{RequestID: "first"})
	_ = before.Notify(context.Background(), reporter, client.RequestReport{RequestID: "second"})

	reporter.down = false
	restarted := &Notify{Folder: folder}
	if err := restarted.Replay(context.Background(), reporter); err != nil {
		t.Fatal(err)
	}
	if err := restarted.Replay(context.Background(), reporter); err != nil {
		t.Fatal(err)
	}

	if len(reporter.sent) != 2 || reporter.sent[0] != "first" || reporter.sent[1] != "second" {
		t.Fatalf("after the restart the journal heard %v, want first then second, once each", reporter.sent)
	}
}
