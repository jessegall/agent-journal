package main

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"journal-runner/client"
)

func TestTheTerminalForwardsItsHookWithTheStartGrant(t *testing.T) {
	const token = "the-start-token"
	received := make(chan *http.Request, 1)
	journal := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		received <- request
		writer.WriteHeader(http.StatusServiceUnavailable)
	}))
	t.Cleanup(journal.Close)

	grant, ok := client.StartGrantFrom(environmentOf([]string{
		"JOURNAL_URL=" + journal.URL,
		"JOURNAL_START_TOKEN=" + token,
		"JOURNAL_PROFILE=main-agent",
		"JOURNAL_PROFILE_REVISION=1",
	}))
	if !ok {
		t.Fatal("the start environment did not provide a grant")
	}
	_, err := forwardHooks(grant)(t.Context(), "claude-code", []byte("{}"))
	if !errors.Is(err, client.ErrRefused) {
		t.Fatalf("the journal's refusal was returned as %v", err)
	}
	request := <-received
	if request.Header.Get("Authorization") != "Bearer "+token || request.URL.RequestURI() != "/hooks/claude-code?generation=1" {
		t.Fatalf("the start grant did not sign the expected hook: %s", request.URL)
	}
}
