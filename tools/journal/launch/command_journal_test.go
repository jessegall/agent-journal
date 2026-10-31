package launch

import (
	"strings"
	"testing"
)

func TestTheCommandJournalReadsEnvironmentsWithTheirSuiteAndWhetherALiveSessionHoldsThem(t *testing.T) {
	answers := map[string]string{
		"environment list": `{"rows": [{"id": 1, "name": "main", "folder": "/work/shop", "branch": "main"}], "page": 1, "size": 1000, "total": 1}`,
		"agent list":       `{"rows": [{"id": 2, "environment_id": 1, "role": "main", "ended_at": null, "session": "s-1", "program": "claude"}]}`,
		"suite current":    `{"suite": "coding", "drivers": "main: coding.builder"}`,
	}
	journal := CommandJournal{Run: func(argv ...string) (string, error) {
		return answers[strings.Join(argv[:2], " ")], nil
	}}
	environments, err := journal.Environments()
	if err != nil || len(environments) != 1 || environments[0] != (Environment{Name: "main", Folder: "/work/shop", Branch: "main", Suite: "coding", Working: true}) {
		t.Fatalf("the environments read are %+v, %v", environments, err)
	}
}

func TestACodexLaunchNamesTheTrustStepOnlyWhenItsHooksAreUntrustedOrChanged(t *testing.T) {
	for trust, lineWanted := range map[string]bool{"untrusted": true, "changed": true, "ready": false, "unwritten": false} {
		if line := HookTrustLine(trust); (line != "") != lineWanted || (lineWanted && !strings.Contains(line, "/hooks")) {
			t.Fatalf("hook trust %s gave the line %q", trust, line)
		}
	}
}
