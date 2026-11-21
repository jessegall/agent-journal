package client

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
)

const accountClaimAnswer = `{"start_key":"start-1","session_id":"session-1","directory":"/accounts/a","generation":2,"sign_in_method":"api_key",` +
	`"recipe":{"environment":[{"name":"CLAUDE_CONFIG_DIR","value":"/accounts/a"}],"emptyFolderVariables":[],` +
	`"removedVariables":["ANTHROPIC_API_KEY"],"startFlags":["--restricted"],"accountSettings":[],` +
	`"driverVersion":"2.1.323","binaryDigest":"abc","arrangement":"direct","protectionSettings":"{}"}}`

func TestAClaimReadsTheWholeRecipe(t *testing.T) {
	journal, target, body := fakeJournal(t, accountClaimAnswer)

	claimed, err := journal.ClaimStart(context.Background(), "session-1")
	if err != nil {
		t.Fatal(err)
	}

	if *target != "/host/starts/claim" || string(*body) != `{"session_id":"session-1"}` {
		t.Fatalf("claimed at %s with %s", *target, *body)
	}
	if claimed.Generation != 2 || claimed.SignInMethod != "api_key" || claimed.Recipe.Environment[0].Name != "CLAUDE_CONFIG_DIR" ||
		claimed.Recipe.StartFlags[0] != "--restricted" || claimed.Recipe.Arrangement != "direct" {
		t.Fatalf("claimed %+v", claimed)
	}
}

func TestAClaimWithoutItsRecipeIsIncomplete(t *testing.T) {
	journal, _, _ := fakeJournal(t, `{"start_key":"start-1","session_id":"session-1","directory":"/accounts/a"}`)

	if _, err := journal.ClaimStart(context.Background(), "session-1"); !errors.Is(err, ErrIncompleteClaim) {
		t.Fatalf("got %v, want ErrIncompleteClaim", err)
	}
}

func TestEachRefusalOfAClaimIsToldApart(t *testing.T) {
	statuses := map[int]error{
		http.StatusGone:                ErrAlreadyGranted,
		http.StatusConflict:            ErrConflict,
		http.StatusUnauthorized:        ErrUnauthenticated,
		http.StatusForbidden:           ErrRefused,
		http.StatusInternalServerError: ErrUncertain,
	}
	for status, want := range statuses {
		journal := journalAnswering(t, status)

		_, err := journal.ClaimStart(context.Background(), "session-1")

		if !errors.Is(err, want) {
			t.Fatalf("status %d: got %v, want %v", status, err, want)
		}
	}
}

func TestAJournalThatCannotBeReachedLeavesTheClaimUncertain(t *testing.T) {
	journal := New(Enrollment{JournalURL: "http://127.0.0.1:1", HostID: "host", Secret: "secret"})

	if _, err := journal.ClaimStart(context.Background(), "session-1"); !errors.Is(err, ErrUncertain) {
		t.Fatalf("got %v, want ErrUncertain", err)
	}
}

func TestUnresolvedStartsAreReadWithASignedGet(t *testing.T) {
	var method, signed, callID, issuedAt string
	var body []byte
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		method, signed = request.Method, request.Header.Get(signatureHeader)
		callID, issuedAt = request.Header.Get(callIDHeader), request.Header.Get(issuedAtHeader)
		body, _ = io.ReadAll(request.Body)
		io.WriteString(writer, `{"unresolved":["start-1","start-2"]}`)
	}))
	t.Cleanup(server.Close)
	journal := New(Enrollment{JournalURL: server.URL, HostID: "host", Secret: "secret"})

	keys, err := journal.UnresolvedStarts(context.Background())
	if err != nil {
		t.Fatal(err)
	}

	issued, _ := strconv.ParseInt(issuedAt, 10, 64)
	want, _ := signature("secret", http.MethodGet, "/host/starts", callID, issued, nil)
	if method != http.MethodGet || len(body) != 0 || signed != want {
		t.Fatalf("read with %s, body %q, signature %s want %s", method, body, signed, want)
	}
	if len(keys) != 2 || keys[1] != "start-2" {
		t.Fatalf("keys %v", keys)
	}
}

func TestReportsPostToTheirStartRoutes(t *testing.T) {
	journal, target, body := fakeJournal(t, `{}`)

	if err := journal.ReportFailure(context.Background(), "start-1", "rate_limit"); err != nil {
		t.Fatal(err)
	}

	if *target != "/host/starts/start-1/failure" || string(*body) != `{"failure":"rate_limit"}` {
		t.Fatalf("reported at %s with %s", *target, *body)
	}
}

func journalAnswering(t *testing.T, status int) *Client {
	t.Helper()
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
		writer.WriteHeader(status)
	}))
	t.Cleanup(server.Close)
	return New(Enrollment{JournalURL: server.URL, HostID: "host", Secret: "secret"})
}
