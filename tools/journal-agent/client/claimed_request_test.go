package client

import (
	"encoding/json"
	"strings"
	"testing"
)

// claimAnswer is a claim as App\Agents\Support\ClaimedRequest writes it: a key script stopped at step 2, then a
// message with no script and no parameters.
const claimAnswer = `{"requests":[
{"runtimeId":"r1","requestId":"q1","sequence":2,"attempt":2,"operation":"key_script","message":null,"model":null,
"effort":null,"script":"LoginMcp","scriptVersion":1,"scriptParameters":[{"name":"server","value":"journal"}],
"scriptStep":2},
{"runtimeId":"r1","requestId":"q2","sequence":3,"attempt":1,"operation":"deliver","message":"hi","model":null,
"effort":null,"script":null,"scriptVersion":null,"scriptParameters":[],"scriptStep":null}]}`

func TestAClaimedKeyScriptDecodesWithItsNameVersionParametersAndStep(t *testing.T) {
	var answer struct {
		Requests []ClaimedRequest `json:"requests"`
	}
	if err := json.Unmarshal([]byte(claimAnswer), &answer); err != nil {
		t.Fatal(err)
	}

	script, message := answer.Requests[0], answer.Requests[1]
	server := ScriptParameter{Name: "server", Value: "journal"}
	if *script.Script != "LoginMcp" || *script.ScriptVersion != 1 || len(script.ScriptParameters) != 1 ||
		script.ScriptParameters[0] != server || *script.ScriptStep != 2 {
		t.Fatalf("the key script decoded as %+v", script)
	}
	if message.Script != nil || message.ScriptStep != nil || len(message.ScriptParameters) != 0 {
		t.Fatalf("a message decoded with a script: %+v", message)
	}
}

func TestAReportCarriesItsScriptOnlyWhenItHasOne(t *testing.T) {
	plain, _ := json.Marshal(RequestReport{RequestID: "q2", Attempt: 1, Progress: "applied"})
	if strings.Contains(string(plain), "script") || strings.Contains(string(plain), "operation_key") {
		t.Fatalf("a report with no script wrote %s", plain)
	}

	scripted, _ := json.Marshal(RequestReport{
		RequestID:    "q1",
		Attempt:      2,
		Progress:     "applying",
		Script:       &ScriptReport{Step: 2, Generation: 7, Evidence: "menu login-method, stable"},
		OperationKey: "raise-1",
	})
	want := `"script":{"step":2,"generation":7,"evidence":"menu login-method, stable"},"operation_key":"raise-1"`
	if !strings.Contains(string(scripted), want) {
		t.Fatalf("a report with a script wrote %s", scripted)
	}
}

func TestARaiseIsSentAsTheJournalReadsItAndItsAnswerIsRead(t *testing.T) {
	raise, _ := json.Marshal(NavigationRaise{OperationKey: "q1:2:1", RequestID: "q1", Attempt: 2, Step: 1,
		Reason: "no-entry", Fingerprint: "fp1:a", Rows: []string{"Pick"}, Highlight: -1, Generation: 7})
	want := `{"operation_key":"q1:2:1","request_id":"q1","attempt":2,"step":1,"reason":"no-entry",` +
		`"fingerprint":"fp1:a","rows":["Pick"],"highlight":-1,"generation":7}`
	if string(raise) != want {
		t.Fatalf("the raise was sent as %s", raise)
	}

	var answer NavigationAnswer
	if err := json.Unmarshal([]byte(`{"answer":"wait","requestId":null,"retryAfterSeconds":30}`), &answer); err != nil {
		t.Fatal(err)
	}
	if answer.Answer != NavigationWait || answer.RequestID != nil || *answer.RetryAfterSeconds != 30 {
		t.Fatalf("the answer was read as %+v", answer)
	}
}
