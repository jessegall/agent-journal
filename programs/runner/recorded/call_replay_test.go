package recorded

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/http/httptest"
	"slices"
	"strings"
	"testing"
	"time"

	"journal-runner/recording"
)

// failures keeps what a replay failed the test with, so a test can show a replay fails.
type failures struct {
	testing.TB
	said []string
}

func (failed *failures) Helper() {}

func (failed *failures) Error(arguments ...any) {
	failed.said = append(failed.said, fmt.Sprint(arguments...))
}

func (failed *failures) Errorf(format string, arguments ...any) {
	failed.said = append(failed.said, fmt.Sprintf(format, arguments...))
}

// ask sends the recorded call to the replay as the host sent it.
func ask(t *testing.T, server *httptest.Server, call Call) int {
	t.Helper()
	body, _ := base64.StdEncoding.DecodeString(call.Asked.Body)
	request, _ := http.NewRequest(call.Answered.Method, server.URL+call.Answered.Path, strings.NewReader(string(body)))
	response, err := http.DefaultClient.Do(request)
	if err != nil {
		t.Fatal(err)
	}
	_ = response.Body.Close()
	return response.StatusCode
}

func TestTheRecordedCallsPlayInOrderAndWhole(t *testing.T) {
	scenario := MustLoad(t, "folders")
	replay := MustCallReplay(t, scenario, recording.WireHost)
	replay.IsLongPoll = isInstructionClaim
	server := httptest.NewServer(replay)
	defer server.Close()

	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		if status := ask(t, server, call); status != *call.Answered.Status {
			t.Fatalf("%s %s was answered %d", call.Answered.Method, call.Answered.Path, status)
		}
	}

	replay.AssertPlayedWhole(t)
}

func TestACallOutOfTheRecordedOrderFailsNamingTheNextOne(t *testing.T) {
	failed := &failures{TB: t}
	replay := MustCallReplay(failed, MustLoad(t, "folders"), recording.WireHost)
	server := httptest.NewServer(replay)
	defer server.Close()
	first := replay.calls[0]

	ask(t, server, Call{Answered: recording.Call{Method: "GET", Path: "/host/never-recorded"}})

	hasNamed := len(failed.said) == 1 && strings.Contains(failed.said[0], "GET /host/never-recorded")
	if !hasNamed || !strings.Contains(failed.said[0], first.Answered.Path) {
		t.Fatalf("an unrecorded call failed with %v", failed.said)
	}
}

func TestACallNeverAskedFailsThePlay(t *testing.T) {
	failed := &failures{TB: t}
	scenario := MustLoad(t, "folders")
	replay := MustCallReplay(t, scenario, recording.WireHost)
	replay.IsLongPoll = isInstructionClaim
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}

	replay.AssertPlayedWhole(failed)

	if len(failed.said) != len(calls) || !strings.Contains(failed.said[0], "was never asked") {
		t.Fatalf("a play with no call asked failed with %v", failed.said)
	}
}

func TestAClaimDoesNotWaitForAnOverlappingClaimFromTheRecording(t *testing.T) {
	replay := MustCallReplay(t, MustLoad(t, "terminal-turn"), recording.WireHost)
	replay.IsLongPoll = isInstructionClaim
	replay.OrderGroup = func(Call) string { return "host" }

	for index := range replay.calls {
		if replay.isOrdered(index) {
			if !replay.isEarlierPlayed(index) {
				t.Fatal("the first instruction claim waits for the next claim")
			}
			return
		}
		replay.played[index] = true
	}

	t.Fatal("the recorded terminal turn contains no instruction claim")
}

func TestReplayWaitsForARequestWhenTheRecordingEndsBeforeItsReply(t *testing.T) {
	scenario := MustLoad(t, "terminal-turn")
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	index := slices.IndexFunc(calls, func(call Call) bool {
		return call.AskedAt != 0 && strings.HasPrefix(call.Asked.Path, "/host/instructions/") && !isInstructionClaim(call)
	})
	if index < 0 {
		t.Fatal("the terminal turn has no instruction answer request")
	}
	call := calls[index]
	exchange, _ := scenario.Exchange(call.Exchange)
	index = slices.IndexFunc(exchange.Events, func(event recording.Event) bool {
		return event.Type == "asked" && event.At == call.AskedAt
	})
	if index < 0 {
		t.Fatal("the exchange has no event for the instruction answer request")
	}
	exchange.Events = exchange.Events[index : index+1]
	scenario.Exchanges = []Exchange{exchange}
	replay := MustCallReplay(t, scenario, recording.WireHost)
	if replay.IsPlayedWhole() {
		t.Fatal("replay finished before the recorded request arrived")
	}
	heard := make(chan struct{}, 1)
	replay.Heard = func(Call, []byte) { heard <- struct{}{} }
	server := httptest.NewServer(replay)
	defer server.Close()
	defer replay.Close()
	ctx, cancel := context.WithTimeout(t.Context(), 2*time.Second)
	defer cancel()
	body, err := base64.StdEncoding.DecodeString(call.Asked.Body)
	if err != nil {
		t.Fatal(err)
	}
	request, err := http.NewRequestWithContext(ctx, call.Asked.Method, server.URL+call.Asked.Path, bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	returned := make(chan *http.Response, 1)
	go func() {
		response, _ := server.Client().Do(request)
		returned <- response
	}()
	select {
	case <-heard:
	case <-ctx.Done():
		t.Fatal("replay did not match the recorded request")
	}
	replay.AssertPlayedWhole(t)
	replay.Close()
	if response := <-returned; response != nil {
		_ = response.Body.Close()
		t.Fatalf("the replay invented a reply with status %d", response.StatusCode)
	}
}

func isInstructionClaim(call Call) bool {
	return call.Request().Path == "/host/instructions/claim"
}
