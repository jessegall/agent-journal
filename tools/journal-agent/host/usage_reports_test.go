package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"journal-agent/client"
)

type recordingUsage struct {
	folder   string
	failWith error
	sent     []client.UsageReport
	onDisk   []bool
}

func (usage *recordingUsage) ReportUsage(_ context.Context, report client.UsageReport) error {
	content, _ := os.ReadFile(filepath.Join(usage.folder, pendingUsageName))
	usage.onDisk = append(usage.onDisk, strings.Contains(string(content), report.SourceID))
	if usage.failWith != nil {
		return usage.failWith
	}
	usage.sent = append(usage.sent, report)
	return nil
}

func sinkFor(reports *UsageReports) *UsageSink {
	prepared := PreparedStart{
		Grant: client.Grant{Runtime: client.RuntimeStart{ProcessGeneration: 7}},
		Claim: client.ClaimedStart{StartKey: "start-1", Generation: 3, SignInMethod: "oauth"},
	}
	sink := NewUsageSink(prepared, reports)
	sink.now = func() time.Time { return time.Date(2026, 11, 21, 10, 0, 0, 250, time.UTC) }
	return sink
}

func TestAnObservationIsInTheFileBeforeItsFirstSendAndALostAnswerReplaysIt(t *testing.T) {
	folder := t.TempDir()
	reports := NewUsageReports(folder)
	usage := &recordingUsage{folder: folder, failWith: errors.Join(client.ErrUncertain, errors.New("journal away"))}
	sinkFor(reports).ResultCost("result-1", "0.0128")

	if err := reports.Send(context.Background(), usage); err == nil {
		t.Fatal("an unheard report was taken as sent")
	}
	usage.failWith = nil
	if err := reports.Send(context.Background(), usage); err != nil {
		t.Fatal(err)
	}
	if err := reports.Send(context.Background(), usage); err != nil {
		t.Fatal(err)
	}

	if len(usage.onDisk) != 2 || !usage.onDisk[0] || !usage.onDisk[1] {
		t.Fatalf("the report was not on disk before each send: %v", usage.onDisk)
	}
	sent := usage.sent[0]
	if len(usage.sent) != 1 || sent.SourceID != "start-1:7:result-1" || sent.ObservedAt != "2026-11-21T10:00:00Z" ||
		sent.Generation != 3 || sent.Measurement.USD != "0.0128" {
		t.Fatalf("sent %+v", usage.sent)
	}
}

func TestARefusedReportIsDropped(t *testing.T) {
	folder := t.TempDir()
	reports := NewUsageReports(folder)
	usage := &recordingUsage{folder: folder, failWith: errors.Join(client.ErrRefused, errors.New("account removed"))}
	sinkFor(reports).ResultCost("result-1", "1")

	if err := reports.Send(context.Background(), usage); err != nil {
		t.Fatal(err)
	}
	usage.failWith = nil
	if err := reports.Send(context.Background(), usage); err != nil {
		t.Fatal(err)
	}

	if len(usage.onDisk) != 1 || len(usage.sent) != 0 {
		t.Fatalf("a refused report was sent again: %d tries, %v", len(usage.onDisk), usage.sent)
	}
}

func TestANewerWindowReplacesAWaitingOneWhileEveryCostWaits(t *testing.T) {
	folder := t.TempDir()
	reports := NewUsageReports(folder)
	sink := sinkFor(reports)
	forty, fortyTwo := 40.0, 42.0
	sink.Window(WindowReading{LimitID: "claude", Slot: client.WindowSevenDay, UsedPercent: &forty})
	sink.ResultCost("result-1", "0.25")
	sink.Window(WindowReading{LimitID: "claude", Slot: client.WindowFiveHour, UsedPercent: &forty})
	sink.Window(WindowReading{LimitID: "claude", Slot: client.WindowSevenDay, UsedPercent: &fortyTwo})
	sink.ResultCost("result-2", "0.5")
	usage := &recordingUsage{folder: folder}

	if err := reports.Send(context.Background(), usage); err != nil {
		t.Fatal(err)
	}

	var shown []string
	for _, report := range usage.sent {
		measurement := report.Measurement
		shown = append(shown, measurement.Type+" "+measurement.Slot+measurement.USD)
	}
	if strings.Join(shown, ", ") != "result_cost 0.25, window five_hour, window seven_day, result_cost 0.5" {
		t.Fatalf("sent %v", shown)
	}
	if *usage.sent[2].Measurement.UsedPercent != 42 || usage.sent[2].SourceOrder != 4 {
		t.Fatalf("the newer window was not kept: %+v", usage.sent[2])
	}
}

type stuckUsage struct{}

func (stuckUsage) ReportUsage(ctx context.Context, _ client.UsageReport) error {
	<-ctx.Done()
	return errors.Join(client.ErrUncertain, ctx.Err())
}

func TestAStuckUsageEndpointNeverDelaysAStartReport(t *testing.T) {
	folder := t.TempDir()
	usage := NewUsageReports(folder)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	sinkFor(usage).ResultCost("result-1", "1")
	go usage.Run(ctx, stuckUsage{})
	starts := &StartReports{Folder: folder}
	reporter := &recordingReporter{}
	done := make(chan error, 1)

	go func() {
		if err := starts.Queue(StartReport{StartKey: "s1", Kind: ReportRunning, Execution: "e1"}); err != nil {
			done <- err
			return
		}
		done <- starts.Send(ctx, reporter)
	}()

	select {
	case err := <-done:
		if err != nil || len(reporter.sent) != 1 {
			t.Fatalf("the start report was not sent: %v %v", err, reporter.sent)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("a stuck usage endpoint delayed the start report")
	}
}
