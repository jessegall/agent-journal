package programs

import "testing"

func expectSubagentEvents(t *testing.T, program string) {
	t.Helper()
	cases := map[string]string{
		`{"hook_event_name":"SubagentStart","session_id":"s","agent_id":"a1"}`: "session_start",
		`{"hook_event_name":"SubagentStop","session_id":"s","agent_id":"a1"}`:  "stop",
	}
	for body, event := range cases {
		prepared, skip, err := Prepared(program, []byte(body), testContext)
		if err != nil {
			t.Fatalf("%s: %v", body, err)
		}
		if skip || prepared.Event != event || prepared.Subagent != "a1" {
			t.Errorf("%s: event %q, subagent %q, skipped %v; want %s from subagent a1", body, prepared.Event, prepared.Subagent, skip, event)
		}
	}
}
