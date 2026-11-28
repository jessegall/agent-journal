package recording_test

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"slices"
	"strings"
	"testing"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// liveOrderID is an order id as the journal makes them, standing where the recording holds its fake.
const liveOrderID = "01m8e43aw61nwtv446cw9v0cty"

// recordedClaim is the first recorded answer to the host's claim of its orders, and the call it was asked by.
func recordedClaim(t *testing.T) (recording.Call, []byte) {
	t.Helper()
	calls, err := recorded.MustLoad(t, "folders").Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		if call.Answered.Path == "/host/instructions/claim" {
			body, _ := base64.StdEncoding.DecodeString(call.Answered.Body)
			return call.Answered, body
		}
	}
	t.Fatal("the recording holds no claim")
	return recording.Call{}, nil
}

func TestAFakeIDIsBoundToTheFirstLiveIDAndReplacedThereafter(t *testing.T) {
	_, body := recordedClaim(t)
	var claim struct {
		Instructions []struct {
			ID string `json:"id"`
		} `json:"instructions"`
	}
	if err := json.Unmarshal(body, &claim); err != nil || len(claim.Instructions) == 0 {
		t.Fatalf("the recorded claim holds %s", body)
	}
	fake := claim.Instructions[0].ID
	heard := strings.Replace(string(body), fake, liveOrderID, 1)
	values := recording.NewValues()

	if err := values.Hear(recording.Place{Exchange: "claim", Field: "body"}, body, []byte(heard)); err != nil {
		t.Fatal(err)
	}

	if live := values.Live(`{"id":"` + fake + `"}`); live != `{"id":"`+liveOrderID+`"}` {
		t.Fatalf("the fake %s is answered as %s", fake, live)
	}
}

func TestAnEmptyLiveAddressIsRefusedNamingItsPlace(t *testing.T) {
	call, _ := recordedClaim(t)
	recordedCall, _ := json.Marshal(call)
	call.Path = ""
	heardCall, _ := json.Marshal(call)

	err := recording.NewValues().Hear(recording.Place{Exchange: "claim", Event: 3}, recordedCall, heardCall)

	if !errors.Is(err, recording.ErrValueRefused) || !strings.Contains(err.Error(), "exchange claim, event 3, field path") {
		t.Fatalf("an empty path gave %v", err)
	}
}

func TestAnAddressOfAnotherShapeIsRefused(t *testing.T) {
	call, _ := recordedClaim(t)
	recordedCall, _ := json.Marshal(call)
	call.Path = "http://journal.test" + call.Path
	heardCall, _ := json.Marshal(call)

	err := recording.NewValues().Hear(recording.Place{Exchange: "claim"}, recordedCall, heardCall)

	if !errors.Is(err, recording.ErrValueRefused) {
		t.Fatalf("a URL where a path was recorded gave %v", err)
	}
}

// recordedOutputPaths are the paths of two recorded processes' output calls of the terminal turn, each
// naming its own fake process.
func recordedOutputPaths(t *testing.T) (string, string) {
	t.Helper()
	calls, err := recorded.MustLoad(t, "terminal-turn").Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	paths := []string{}
	for _, call := range calls {
		if strings.HasSuffix(call.Answered.Path, "/output") && !slices.Contains(paths, call.Answered.Path) {
			paths = append(paths, call.Answered.Path)
		}
	}
	if len(paths) < 2 {
		t.Fatal("the recording holds fewer than two processes' output")
	}
	return paths[0], paths[1]
}

func TestALiveValueOneFakeStandsForIsRefusedToAnother(t *testing.T) {
	first, second := recordedOutputPaths(t)
	values := recording.NewValues()
	place := recording.Place{Exchange: "host", Field: "path"}
	if err := values.Hear(place, quoted(first), quoted(first)); err != nil {
		t.Fatal(err)
	}

	err := values.Hear(place, quoted(second), quoted(first))

	if !errors.Is(err, recording.ErrValueRefused) || !strings.Contains(err.Error(), "already stands for") {
		t.Fatalf("a second fake took the live value of the first: %v", err)
	}
}

func TestAFakeInsideALongerFakeIsNotReplaced(t *testing.T) {
	first, _ := recordedOutputPaths(t)
	process := strings.Split(first, "/")[3]
	digest := "sha256:" + strings.Repeat("0", 64-len(process)-1) + process + "0"
	values := recording.NewValues()
	if err := values.Hear(recording.Place{Exchange: "host"}, quoted(process), quoted(liveOrderID)); err != nil {
		t.Fatal(err)
	}

	if live := values.Live(digest); live != digest {
		t.Fatalf("the digest %s holding the fake %s is answered as %s", digest, process, live)
	}
}

func quoted(text string) []byte {
	encoded, _ := json.Marshal(text)
	return encoded
}
