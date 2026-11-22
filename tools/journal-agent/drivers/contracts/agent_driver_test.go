package contracts

import (
	"errors"
	"fmt"
	"testing"
)

func TestAStartRefusalIsFoundThroughTheErrorsThatWrapIt(t *testing.T) {
	err := fmt.Errorf("the turn could not start: %w", RefuseStart(RefusalImageUnverified, errors.New("digest differs")))

	refused, found := StartRefusalOf(err)

	if !found || refused.Reason != RefusalImageUnverified {
		t.Fatalf("the refusal was not found in %v", err)
	}
}

func TestAnOrdinaryErrorCarriesNoStartRefusal(t *testing.T) {
	if _, found := StartRefusalOf(errors.New("the program crashed")); found {
		t.Fatal("an ordinary error carried a start refusal")
	}
}

func TestAWakeCarriesTheServersPromptOrFallsBackToTheGenericOne(t *testing.T) {
	if got := (WakeRequest{}).PromptOr("Check your pending journal work."); got != "Check your pending journal work." {
		t.Fatalf("an empty wake should fall back, got %q", got)
	}
	if got := (WakeRequest{Prompt: "New messages in the chat Design."}).PromptOr("fallback"); got != "New messages in the chat Design." {
		t.Fatalf("a wake with a prompt should present it, got %q", got)
	}
}
