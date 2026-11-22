package drivers

import (
	"context"
	"strings"
	"testing"
	"time"

	"journal-agent/drivers/contracts"
)

func TestABrowserWriterTakesTypesOneLineAndGivesBack(t *testing.T) {
	driver, _, program := recordedTurn(t, 11*time.Second)
	ctx := context.Background()
	before := program.Len()

	taken, err := driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("take"),
		Operation: "take_control",
		TakeID:    "take-1",
	})
	if err != nil || taken.Progress != contracts.ProgressApplied || taken.ActualBinding == "" {
		t.Fatalf("the take ended %+v, %v", taken, err)
	}
	typed, _ := driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("input"),
		Operation: "terminal_input",
		GrantID:   taken.ActualBinding,
		Sequence:  1,
		Text:      "hello",
		Enter:     true,
	})
	released, _ := driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("release"),
		Operation: "release_control",
		GrantID:   taken.ActualBinding,
	})
	late, _ := driver.ControlFromBrowser(ctx, contracts.BrowserControl{
		Request:   request("late"),
		Operation: "terminal_input",
		GrantID:   taken.ActualBinding,
		Sequence:  2,
		Text:      "again",
	})

	if typed.Progress != contracts.ProgressApplied || released.Progress != contracts.ProgressApplied {
		t.Fatalf("the input ended %s and the release %s", typed.Progress, released.Progress)
	}
	if late.Progress != contracts.ProgressFailed {
		t.Fatalf("an input after give back ended %s", late.Progress)
	}
	if written := program.String()[before:]; written != "hello\r" || strings.Count(written, "\r") != 1 {
		t.Fatalf("the program got %q", written)
	}
}

func TestATakeForAnotherProcessGenerationIsRefused(t *testing.T) {
	driver, _, _ := recordedTurn(t, 11*time.Second)

	taken, _ := driver.ControlFromBrowser(context.Background(), contracts.BrowserControl{
		Request:    request("take"),
		Operation:  "take_control",
		TakeID:     "take-1",
		Generation: 9,
	})

	if taken.Progress != contracts.ProgressFailed || taken.ActualBinding != "" {
		t.Fatalf("a take for another generation ended %+v", taken)
	}
}
