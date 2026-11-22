package drivers

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"journal-agent/drivers/contracts"
	"journal-agent/terminal"
)

func TestStopFencesABrowserWriterAndHangsUpWithoutSendingTheLine(t *testing.T) {
	driver, _, program := recordedTurn(t, 11*time.Second)
	hungUp := 0
	driver.runtime.Hangup = func() error { hungUp++; return nil }
	ctx := context.Background()
	taken, _ := driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("take"),
		Operation: "take_control",
		TakeID:    "take-1",
	})
	driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("input"),
		Operation: "terminal_input",
		GrantID:   taken.ActualBinding,
		Sequence:  1,
		Text:      "half a line",
	})
	before := program.Len()

	stopped, err := driver.Stop(ctx, contracts.StopRequest{Request: request("stop")})

	if err != nil || stopped.Progress != contracts.ProgressApplying || hungUp != 1 {
		t.Fatalf("the stop ended %+v, %v, after %d hangups", stopped, err, hungUp)
	}
	if written := program.String()[before:]; strings.Contains(written, "\r") || written != "" {
		t.Fatalf("the stop wrote %q to the program", written)
	}
	if late, _ := driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("late"),
		Operation: "terminal_input",
		GrantID:   taken.ActualBinding,
		Sequence:  2,
		Text:      "x",
	}); late.Progress != contracts.ProgressFailed {
		t.Fatalf("input after the stop ended %s", late.Progress)
	}
}

func TestAFailedHangupFailsTheStopAndKeepsTheInputFenced(t *testing.T) {
	driver, _, _ := recordedTurn(t, 11*time.Second)
	driver.runtime.Hangup = func() error { return errors.New("the PTY would not close") }

	stopped, err := driver.Stop(context.Background(), contracts.StopRequest{Request: request("stop")})

	if err == nil || stopped.Progress != contracts.ProgressFailed {
		t.Fatalf("a failed hangup ended %+v, %v", stopped, err)
	}
	if _, err := driver.runtime.Gate.Take("take-1", terminal.GrantScope{}); !errors.Is(err, terminal.ErrTakeCancelled) {
		t.Fatalf("a take after a failed stop was granted: %v", err)
	}
}
