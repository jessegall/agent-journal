package client

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestTheCallsThatFailedAreReportedOnTheNextCallTheJournalAnswersAndThenForgotten(t *testing.T) {
	answers := []int{http.StatusInternalServerError, http.StatusInternalServerError, http.StatusOK, http.StatusOK}
	var carried []string
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		carried = append(carried, request.Header.Get(failedCallsHeader))
		writer.WriteHeader(answers[len(carried)-1])
		_, _ = writer.Write([]byte("{}"))
	}))
	defer server.Close()
	journal := New(Enrollment{JournalURL: server.URL, HostID: "host", Secret: "secret"})

	for range answers {
		_ = journal.call(context.Background(), "/host/claim?limit=10", nil, nil)
	}

	var reported []FailedCall
	if err := json.Unmarshal([]byte(carried[2]), &reported); err != nil {
		t.Fatalf("the answered call carried %q: %v", carried[2], err)
	}
	if len(reported) != 1 || reported[0].Route != "/host/claim" || reported[0].Status != http.StatusInternalServerError ||
		reported[0].Since.IsZero() {
		t.Fatalf("the host reported %+v; want one failed claim since its first failure", reported)
	}
	if carried[0] != "" || carried[3] != "" {
		t.Fatalf("a call carried failures it should not: first %q, after the report %q", carried[0], carried[3])
	}
}
