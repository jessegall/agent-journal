package drivers

import (
	"context"
	"errors"
	"journal-agent/host"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestATurnSucceedsOnlyOnASuccessfulResult(t *testing.T) {
	outputs := map[string]bool{
		`{"type":"system"}` + "\n" + `{"type":"result","subtype":"success","is_error":false}`:                true,
		`{"type":"result","subtype":"success","is_error":true,"result":"Not logged in · Please run /login"}`: false,
		`{"type":"result","subtype":"error_during_execution","is_error":false}`:                              false,
		`{"type":"assistant"}`: false,
	}
	for output, succeeds := range outputs {
		err := readClaudeResult(strings.NewReader(output), ignoredUsage{}, 1)

		if succeeds != (err == nil) || (!succeeds && !errors.Is(err, ErrProviderTurnFailed)) {
			t.Fatalf("output %s: got %v", output, err)
		}
	}
}

func TestTheSignInMustBeAJournalMethodInTheAccountsOwnFolder(t *testing.T) {
	folder := t.TempDir()
	answers := map[string]error{
		`{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"/accounts/a"}`:       nil,
		`{"loggedIn":true,"authMethod":"oauth_token","configDirectory":"/accounts/a"}`:     nil,
		`{"loggedIn":true,"authMethod":"api_key_helper","configDirectory":"/accounts/a"}`:  nil,
		`{"loggedIn":true,"authMethod":"api_key","configDirectory":"/accounts/a"}`:         ErrNotSignedIn,
		`{"loggedIn":true,"authMethod":"claude.ai","configDirectory":"/Users/me/.claude"}`: ErrNotSignedIn,
		`{"loggedIn":false,"authMethod":"none","configDirectory":"/accounts/a"}`:           ErrNotSignedIn,
	}
	for answer, want := range answers {
		executable := filepath.Join(folder, "claude")
		script := "#!/bin/sh\ncat <<'JSON'\n" + answer + "\nJSON\n"
		if err := os.WriteFile(executable, []byte(script), 0o700); err != nil {
			t.Fatal(err)
		}

		err := CheckClaudeSignIn(context.Background(), executable, nil, nil, "/accounts/a")

		if !errors.Is(err, want) && !(want == nil && err == nil) {
			t.Fatalf("answer %s: got %v, want %v", answer, err, want)
		}
	}
}

func TestTheTokenFileReachesTheCheckOnDescriptorThreeAndNotItsEnvironment(t *testing.T) {
	folder := t.TempDir()
	token := filepath.Join(folder, "provider-token")
	if err := os.WriteFile(token, []byte("valid-token"), 0o600); err != nil {
		t.Fatal(err)
	}
	executable := filepath.Join(folder, "claude")
	script := "#!/bin/sh\n[ \"$(cat <&3)\" = valid-token ] || exit 1\nenv | grep -q valid-token && exit 1\n" +
		"echo '{\"loggedIn\":true,\"authMethod\":\"oauth_token\",\"configDirectory\":\"/accounts/a\"}'\n"
	if err := os.WriteFile(executable, []byte(script), 0o700); err != nil {
		t.Fatal(err)
	}

	err := CheckClaudeSignIn(context.Background(), executable, nil, []string{token}, "/accounts/a")

	if err != nil {
		t.Fatalf("a token read on descriptor 3 was not accepted: %v", err)
	}
}

type recordedUsage struct {
	windows []host.WindowReading
	costs   []string
	results []string
}

func (usage *recordedUsage) Window(reading host.WindowReading) {
	usage.windows = append(usage.windows, reading)
}

func (usage *recordedUsage) ResultCost(resultID, usd string) {
	usage.results = append(usage.results, resultID)
	usage.costs = append(usage.costs, usd)
}

func readUsage(t *testing.T, lines ...string) (*recordedUsage, error) {
	t.Helper()
	usage := &recordedUsage{}
	err := readClaudeResult(strings.NewReader(strings.Join(lines, "\n")), usage, 4)
	return usage, err
}

const successResult = `{"type":"result","subtype":"success","is_error":false}`

func TestBothWindowsOfARateLimitEventAreReadAsPercentsWithTheirResets(t *testing.T) {
	usage, err := readUsage(t,
		`{"type":"rate_limit_event","rate_limit_info":{"status":"allowed","unifiedWindows":{`+
			`"five_hour":{"utilization":0.25,"resetsAt":1764000000},"seven_day":{"utilization":0,"resetsAt":1764500000}}}}`,
		`{"type":"rate_limit_event","rate_limit_info":{"status":"allowed"}}`,
		`{"type":"rate_limit_event","rate_limit_info":{"unifiedWindows":{"five_hour":{"utilization":1.5},`+
			`"seven_day":{"utilization":0.5}}}}`,
		successResult)
	if err != nil {
		t.Fatal(err)
	}

	if len(usage.windows) != 3 {
		t.Fatalf("read %+v", usage.windows)
	}
	five, seven, valid := usage.windows[0], usage.windows[1], usage.windows[2]
	if five.Slot != "five_hour" || *five.UsedPercent != 25 || five.ResetsAt.Unix() != 1764000000 || five.LimitID != "claude" {
		t.Fatalf("five hours %+v", five)
	}
	if seven.Slot != "seven_day" || *seven.UsedPercent != 0 || seven.ResetsAt.Unix() != 1764500000 {
		t.Fatalf("seven days %+v", seven)
	}
	if valid.Slot != "seven_day" || *valid.UsedPercent != 50 || valid.ResetsAt != nil {
		t.Fatalf("the valid sibling of a malformed window %+v", valid)
	}
}

func TestEachResultGivesItsOwnCostAndTheCumulativeTotalIsNeverRead(t *testing.T) {
	usage, err := readUsage(t,
		`{"type":"result","subtype":"success","uuid":"r1","total_cost_usd":4,`+
			`"model_usage_since_last_result":{"opus":{"costUSD":3.5},"haiku":{"costUSD":0.5}}}`,
		`{"type":"result","subtype":"success","total_cost_usd":7,"model_usage_since_last_result":{"opus":{"costUSD":3}}}`,
		`{"type":"result","subtype":"success","total_cost_usd":9}`,
		`{"type":"result","subtype":"success","model_usage_since_last_result":{}}`,
		`{"type":"result","subtype":"success","model_usage_since_last_result":{"opus":{"costUSD":-1}}}`,
		successResult)
	if err != nil {
		t.Fatal(err)
	}

	if strings.Join(usage.costs, " ") != "4.000000000000 3.000000000000" {
		t.Fatalf("costs %v", usage.costs)
	}
	if strings.Join(usage.results, " ") != "r1 process-4-result-2" {
		t.Fatalf("result ids %v", usage.results)
	}
}

func TestAnErrorResultStillFailsTheTurnAndStillGivesItsCost(t *testing.T) {
	usage, err := readUsage(t, `{"type":"result","subtype":"error_during_execution","is_error":true,`+
		`"model_usage_since_last_result":{"opus":{"costUSD":0.0128}}}`)

	if !errors.Is(err, ErrProviderTurnFailed) {
		t.Fatalf("the error result answered %v", err)
	}
	if len(usage.costs) != 1 || usage.costs[0] != "0.012800000000" {
		t.Fatalf("costs %v", usage.costs)
	}
}
