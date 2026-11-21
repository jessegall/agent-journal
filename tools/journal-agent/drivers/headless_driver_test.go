package drivers

import (
	"context"
	"testing"

	"journal-agent/drivers/contracts"
)

func TestAnInterruptWithNoRunningTurnIsAlreadyIdleAndKeepsTheHold(t *testing.T) {
	driver := NewHeadlessDriver(HeadlessRuntime{}, 1)

	interrupt, err := driver.Interrupt(context.Background(), contracts.InterruptRequest{Request: request("late"), Turn: 1})

	if err != nil || interrupt.Outcome != contracts.OutcomeAlreadyIdle || interrupt.Hold != contracts.HoldInterrupted {
		t.Fatalf("the interrupt ended %+v, %v", interrupt, err)
	}
}

func TestAStopWithNoRunningChildIsConfirmedAtOnce(t *testing.T) {
	driver := NewHeadlessDriver(HeadlessRuntime{}, 1)

	stop, err := driver.Stop(context.Background(), contracts.StopRequest{Request: request("stop")})

	if err != nil || stop.Progress != contracts.ProgressApplied || stop.Outcome != contracts.OutcomeConfirmed {
		t.Fatalf("the stop ended %+v, %v", stop, err)
	}
}
