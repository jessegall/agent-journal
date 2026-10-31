package main

import (
	"bytes"
	"net/http"
	"reflect"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/trail"
)

func noVariables(string) (string, bool) { return "", false }

func cliServer(t *testing.T, status int, body string, exitCode string) *http.Client {
	t.Helper()
	home := shortHome(t)
	listening(t, SocketPath(home), http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if status != http.StatusOK {
			writer.WriteHeader(status)
			writer.Write([]byte(body))
			return
		}
		writer.Header().Set("Trailer", ExitCodeTrailer)
		writer.WriteHeader(http.StatusOK)
		writer.Write([]byte(body))
		writer.(http.Flusher).Flush()
		writer.Header().Set(ExitCodeTrailer, exitCode)
	}))
	return SocketClient(SocketPath(home))
}

func TestAnAnswerIsPrintedAsItStreamsAndEndsWithItsExitCode(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code, status := SendCli(cliServer(t, 200, "1  First  open  normal\n", "1"), NewCliRequest([]string{"task", "list"}, noVariables, "/"), trail.Started(), "go_sent", &stdout, &stderr)
	if code != 1 || status != 200 || stdout.String() != "1  First  open  normal\n" {
		t.Fatalf("code %d status %d output %q", code, status, stdout.String())
	}
}

func TestANewerCodeAnswerIsReturnedAsAConflictForTheOneResend(t *testing.T) {
	var stdout, stderr bytes.Buffer
	_, status := SendCli(cliServer(t, 409, `{"error": "newer code"}`, ""), NewCliRequest(nil, noVariables, ""), trail.Started(), "go_sent", &stdout, &stderr)
	if status != http.StatusConflict {
		t.Fatalf("status %d", status)
	}
}

func TestABadRequestIsAUsageErrorAndAServerErrorIsAnErrorWithItsOneLine(t *testing.T) {
	var stdout, stderr bytes.Buffer
	code, _ := SendCli(cliServer(t, 400, `{"error": "argv is the list of the command line's words"}`, ""), NewCliRequest(nil, noVariables, ""), trail.Started(), "go_sent", &stdout, &stderr)
	if code != UsageCode || stderr.String() != "argv is the list of the command line's words\n" {
		t.Fatalf("code %d stderr %q", code, stderr.String())
	}
	stderr.Reset()
	code, _ = SendCli(cliServer(t, 500, `{"error": "ValueError: many"}`, ""), NewCliRequest(nil, noVariables, ""), trail.Started(), "go_sent", &stdout, &stderr)
	if code != ErrorCode || stderr.String() != "ValueError: many\n" {
		t.Fatalf("code %d stderr %q", code, stderr.String())
	}
}

func trailNames(header string) []string {
	var names []string
	for _, pair := range strings.Split(header, ";") {
		name, _, _ := strings.Cut(pair, "=")
		names = append(names, name)
	}
	return names
}

func trailServer(t *testing.T, status int, headers *[]string) *http.Client {
	t.Helper()
	home := shortHome(t)
	listening(t, SocketPath(home), http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		*headers = append(*headers, request.Header.Get(trail.Header))
		writer.Header().Set("Trailer", ExitCodeTrailer)
		writer.WriteHeader(status)
		writer.Header().Set(ExitCodeTrailer, "0")
	}))
	return SocketClient(SocketPath(home))
}

func TestTheRequestCarriesItsTrailAndAResendAfterNewerCodeAddsGoResent(t *testing.T) {
	var stdout, stderr bytes.Buffer
	var headers []string
	requestTrail := trail.Started()
	SendCli(trailServer(t, http.StatusConflict, &headers), NewCliRequest([]string{"task", "list"}, noVariables, "/"), requestTrail, "go_sent", &stdout, &stderr)
	SendCli(trailServer(t, http.StatusOK, &headers), NewCliRequest([]string{"task", "list"}, noVariables, "/"), requestTrail, "go_resent", &stdout, &stderr)
	want := [][]string{{"go_start", "go_sent"}, {"go_start", "go_sent", "go_resent"}}
	if got := [][]string{trailNames(headers[0]), trailNames(headers[1])}; !reflect.DeepEqual(got, want) {
		t.Fatalf("trail names %v, want %v", got, want)
	}
}
