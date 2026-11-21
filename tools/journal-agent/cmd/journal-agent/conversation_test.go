package main

import (
	"errors"
	"testing"

	"journal-agent/client"
	"journal-agent/host"
)

func TestAnExplicitResumeWithoutItsTranscriptFailsInsteadOfStartingFresh(t *testing.T) {
	prepared := host.PreparedStart{Claim: client.ClaimedStart{
		Directory:            t.TempDir(),
		ConversationTarget:   "0b5c2a3e-1f00-4a7a-9c1d-6e2f0a4b8c11",
		ConversationRequired: true,
	}}

	_, _, err := conversationOf(prepared, t.TempDir())

	if !errors.Is(err, ErrResumeFailed) {
		t.Fatalf("an explicit resume without its transcript gave %v, want ErrResumeFailed", err)
	}
}

func TestAnImplicitResumeWithoutItsTranscriptStartsFresh(t *testing.T) {
	prepared := host.PreparedStart{Claim: client.ClaimedStart{
		Directory:          t.TempDir(),
		ConversationTarget: "0b5c2a3e-1f00-4a7a-9c1d-6e2f0a4b8c11",
	}}

	conversationID, resumes, err := conversationOf(prepared, t.TempDir())

	if err != nil || resumes || conversationID == "" {
		t.Fatalf("an implicit resume gave %q, %v, %v; want a fresh conversation", conversationID, resumes, err)
	}
}
