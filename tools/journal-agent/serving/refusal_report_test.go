package serving

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"journal-agent/client"
	"journal-agent/drivers/contracts"
)

func boundWake() client.ClaimedRequest {
	start := "start-1"
	request := claimed("wake-1", 1, "wake", "Check your work.")
	request.Attempt = 3
	request.SessionID = "session-1"
	request.SessionProcessID = &start
	request.ProcessGeneration = 2

	return request
}

func TestAContainerRefusalReportsItsReasonAndThatNoProcessWasMade(t *testing.T) {
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, nil)
	refusal := contracts.RefuseStart(contracts.RefusalContainerUnavailable, errors.New("docker create failed"))

	loop.notifyResult(context.Background(), boundWake(), contracts.OperationResult{}, fmt.Errorf("the wake failed: %w", refusal))

	report := journal.reports[0]
	if report.RefusalReason == nil || *report.RefusalReason != "container-unavailable" || !report.HasCreatedNoProcess {
		t.Fatalf("the refusal was reported as %+v", report)
	}
	if report.Progress != "failed" || report.Outcome == nil || *report.Outcome != "refused" {
		t.Fatalf("the refusal was reported with progress %s", report.Progress)
	}
	if report.SessionID != "session-1" || report.SessionProcessID == nil || *report.SessionProcessID != "start-1" ||
		report.ProcessGeneration != 2 || report.Attempt != 3 {
		t.Fatalf("the report was not bound to its claim: %+v", report)
	}
}

func TestAnOrdinaryDriverErrorStaysAGenericRefusal(t *testing.T) {
	journal := &fakeJournal{}
	loop := NewLoop(journal, grantedPreparer{journal}, nil)

	loop.notifyResult(context.Background(), boundWake(), contracts.OperationResult{}, errors.New("the program crashed"))

	report := journal.reports[0]
	if report.RefusalReason != nil || report.HasCreatedNoProcess {
		t.Fatalf("an ordinary error named a reason: %+v", report)
	}
	if report.Progress != "failed" || report.Outcome == nil || *report.Outcome != "refused" {
		t.Fatalf("an ordinary error was reported with progress %s", report.Progress)
	}
}
