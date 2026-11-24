package host

import (
	"context"
	"errors"
	"testing"

	"journal-agent/client"
)

type recordingReporter struct {
	failWith error
	sent     []string
	stopped  []string
	keys     []string
}

func (reporter *recordingReporter) NotifyRunning(_ context.Context, startKey, executionID string) error {
	return reporter.record("running " + startKey + " " + executionID)
}

func (reporter *recordingReporter) NotifyStopped(_ context.Context, startKey string) error {
	return reporter.record("stopped " + startKey)
}

func (reporter *recordingReporter) NotifyFailure(_ context.Context, startKey, failure string) error {
	return reporter.record("failed " + startKey + " " + failure)
}

func (reporter *recordingReporter) UnresolvedStarts(context.Context) ([]string, error) {
	return reporter.keys, nil
}

func (reporter *recordingReporter) ReconcileStarts(_ context.Context, stopped []string) (int, error) {
	reporter.stopped = stopped
	return len(stopped), nil
}

func (reporter *recordingReporter) record(report string) error {
	if reporter.failWith != nil {
		return reporter.failWith
	}
	reporter.sent = append(reporter.sent, report)
	return nil
}

func TestAReportTheJournalCouldNotHearIsKeptAndSentLater(t *testing.T) {
	reports := &StartReports{Folder: t.TempDir()}
	reporter := &recordingReporter{failWith: errors.Join(client.ErrUncertain, errors.New("journal away"))}
	if err := reports.Queue(StartReport{StartKey: "s1", Kind: NotifyRunning, Execution: "e1"}); err != nil {
		t.Fatal(err)
	}

	if err := reports.Send(context.Background(), reporter); err == nil {
		t.Fatal("an unheard report was taken as sent")
	}
	reporter.failWith = nil
	if err := reports.Send(context.Background(), reporter); err != nil {
		t.Fatal(err)
	}
	if err := reports.Send(context.Background(), reporter); err != nil {
		t.Fatal(err)
	}

	if len(reporter.sent) != 1 || reporter.sent[0] != "running s1 e1" {
		t.Fatalf("sent %v", reporter.sent)
	}
}

func TestARestartReportsOnlyStartsWhoseProcessIsProvenGone(t *testing.T) {
	states := StartStates{Folder: t.TempDir()}
	running := startGroup(t, "sleep 30")
	saved := []StartRecord{
		{RuntimeID: "r1", Stage: ExitKnown, Claim: &client.ClaimedStart{StartKey: "ended"}},
		{RuntimeID: "r2", Stage: ExecutionKnown, Claim: &client.ClaimedStart{StartKey: "running"},
			Execution: &ExecutionIdentity{ProcessID: running.Pid, StartIdentity: running.StartIdentity}},
		{RuntimeID: "r3", Stage: ReleasePending, Claim: &client.ClaimedStart{StartKey: "unknown"}},
	}
	for _, record := range saved {
		if err := states.Save(record); err != nil {
			t.Fatal(err)
		}
	}
	journal := &recordingReporter{keys: []string{"ended", "running", "unknown", "never-recorded"}}

	outcomes, err := ReconcileOnBoot(context.Background(), journal, states, &StartReports{Folder: t.TempDir()}, ContainerSessions{})
	if err != nil {
		t.Fatal(err)
	}

	want := map[string]Reconciliation{
		"ended": Exited, "running": Adopted, "unknown": NeedsAttention, "never-recorded": NeedsAttention,
	}
	for _, outcome := range outcomes {
		if want[outcome.StartKey] != outcome.Outcome {
			t.Fatalf("start %s is %s, want %s", outcome.StartKey, outcome.Outcome, want[outcome.StartKey])
		}
	}
	if len(journal.stopped) != 1 || journal.stopped[0] != "ended" {
		t.Fatalf("reported stopped %v", journal.stopped)
	}
}
