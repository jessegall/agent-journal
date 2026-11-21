package drivers

import (
	"context"
	"os/exec"
	"strconv"
	"testing"
	"time"

	"journal-agent/drivers/contracts"
	"journal-agent/profiles"
	profilecontracts "journal-agent/profiles/contracts"
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

// printingContainer is a session container whose turn process prints the given stream-json and exits as given.
type printingContainer struct {
	output string
	exit   int
}

func (container printingContainer) TurnCommand(profilecontracts.Start, int) (*exec.Cmd, error) {
	script := "printf '%s' \"$OUTPUT\"; echo noise >&2; exit " + strconv.Itoa(container.exit)
	command := exec.Command("sh", "-c", script)
	command.Env = []string{"OUTPUT=" + container.output}
	return command, nil
}

func containedTurn(t *testing.T, container printingContainer) (*recordedUsage, error) {
	t.Helper()
	usage := &recordedUsage{}
	driver := NewHeadlessDriver(HeadlessRuntime{ConversationID: "conversation", Profile: profiles.ClaudeCode{},
		Container: container, Usage: usage}, 1)
	if _, err := driver.Deliver(context.Background(), contracts.Delivery{Request: request("one"), Message: "hi"}); err != nil {
		t.Fatal(err)
	}
	select {
	case err := <-driver.Finished():
		return usage, err
	case <-time.After(5 * time.Second):
		t.Fatal("the contained turn never ended")
		return nil, nil
	}
}

const containedStream = `{"type":"rate_limit_event","rate_limit_info":{"unifiedWindows":{"seven_day":{"utilization":0.42}}}}
{"type":"result","subtype":"error_during_execution","is_error":true,"uuid":"r1","model_usage_since_last_result":{"opus":{"costUSD":0.5}}}
`

func TestAContainedClaudeTurnReportsItsUsageFromTheContainerOutputAndEndsWithItsExit(t *testing.T) {
	usage, err := containedTurn(t, printingContainer{output: containedStream})

	if err != nil {
		t.Fatalf("an error result changed the contained turn's end: %v", err)
	}
	if len(usage.windows) != 1 || *usage.windows[0].UsedPercent != 42 {
		t.Fatalf("windows %+v", usage.windows)
	}
	if len(usage.costs) != 1 || usage.costs[0] != "0.500000000000" || usage.results[0] != "r1" {
		t.Fatalf("costs %v %v", usage.costs, usage.results)
	}

	if _, err := containedTurn(t, printingContainer{output: containedStream, exit: 3}); err == nil {
		t.Fatal("a failed container process ended its turn well")
	}
}
