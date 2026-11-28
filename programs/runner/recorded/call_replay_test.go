package recorded

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

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
	scenario := MustLoad(t, "host", "folders")
	replay := MustCallReplay(t, scenario, recording.WireHost)
	server := httptest.NewServer(replay)
	defer server.Close()

	for _, call := range replay.calls {
		if status := ask(t, server, call); status != *call.Answered.Status {
			t.Fatalf("%s %s was answered %d", call.Answered.Method, call.Answered.Path, status)
		}
	}

	replay.AssertPlayedWhole(t)
}

func TestACallOutOfTheRecordedOrderFailsNamingTheNextOne(t *testing.T) {
	failed := &failures{TB: t}
	replay := MustCallReplay(failed, MustLoad(t, "host", "folders"), recording.WireHost)
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
	replay := MustCallReplay(t, MustLoad(t, "host", "folders"), recording.WireHost)

	replay.AssertPlayedWhole(failed)

	if len(failed.said) != len(replay.calls) || !strings.Contains(failed.said[0], "was never asked") {
		t.Fatalf("a play with no call asked failed with %v", failed.said)
	}
}

func TestAClaimDoesNotWaitForAnOverlappingClaimFromTheRecording(t *testing.T) {
	replay := MustCallReplay(t, MustLoad(t, "claude-code", "terminal-turn"), recording.WireHost)
	const claimPath = "/host/instructions/claim"
	replay.IsLongPoll = func(call Call) bool { return call.Answered.Path == claimPath }
	replay.OrderGroup = func(Call) string { return "host" }

	for index, call := range replay.calls {
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
