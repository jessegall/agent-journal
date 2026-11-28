package client

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestTheBindingRuntimeAnswerRequiresItsProcessID(t *testing.T) {
	body, err := json.Marshal(OpenedBindingRuntime{SessionID: "session", RuntimeID: "runtime", ProcessID: "process"})
	if err != nil {
		t.Fatal(err)
	}
	var opened OpenedBindingRuntime
	if err := json.Unmarshal(body, &opened); err != nil || opened.ProcessID != "process" {
		t.Fatalf("reading the terminal process id gave %q, %v", opened.ProcessID, err)
	}
	for _, processID := range []string{"", "null", "4"} {
		changed := strings.Replace(string(body), "\"process_id\":\"process\",", "", 1)
		if processID != "" {
			changed = strings.Replace(string(body), "\"process\"", processID, 1)
		}
		if err := json.Unmarshal([]byte(changed), &opened); err == nil || !strings.Contains(err.Error(), "process_id") {
			t.Fatalf("reading %s returned %v", changed, err)
		}
	}
}
