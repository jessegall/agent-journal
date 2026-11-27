package recording_test

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"testing"

	"journal-agent/recorded"
	"journal-agent/recording"
)

// liveOrderID is an order id as the journal makes them, standing where the recording holds its fake.
const liveOrderID = "01m8e43aw61nwtv446cw9v0cty"

// recordedClaim is the first recorded answer to the host's claim of its orders, and the call it was asked by.
func recordedClaim(t *testing.T) (recording.Call, []byte) {
	t.Helper()
	calls, err := recorded.MustLoad(t, "host", "folders").Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		if call.Answered.Path == "/host/orders/claim" {
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
		Orders []struct {
			ID string `json:"id"`
		} `json:"orders"`
	}
	if err := json.Unmarshal(body, &claim); err != nil || len(claim.Orders) == 0 {
		t.Fatalf("the recorded claim holds %s", body)
	}
	fake := claim.Orders[0].ID
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
