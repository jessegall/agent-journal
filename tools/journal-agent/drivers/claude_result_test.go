package drivers

import (
	"context"
	"errors"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// The host judges nothing of a result: it tells the last result's subtype and error flag, or that none came.
func TestTheLastResultIsToldAsItWasWritten(t *testing.T) {
	outputs := map[string]contracts.TurnEnd{
		`{"type":"system"}` + "\n" + `{"type":"result","subtype":"success","is_error":false}`: {ResultRead: true, ResultSubtype: "success"},
		`{"type":"result","subtype":"success","is_error":true,"result":"Not logged in"}`:      {ResultRead: true, ResultSubtype: "success", ResultIsError: true},
		`{"type":"result","subtype":"error_during_execution","is_error":false}`:               {ResultRead: true, ResultSubtype: "error_during_execution"},
		`{"type":"assistant"}`: {},
	}
	outputs[`{"type":"system","subtype":"init","model":"claude-opus-4-5"}`+"\n"+`{"type":"result","subtype":"success"}`] =
		contracts.TurnEnd{ResultRead: true, ResultSubtype: "success", Model: "claude-opus-4-5"}
	for output, told := range outputs {
		if end := readClaudeResult(strings.NewReader(output), ignoredUsage{}, 1); end != told {
			t.Fatalf("output %s: told %+v", output, end)
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

		err := CheckClaudeSignIn(context.Background(), executable, nil, nil, "/accounts/a", journalSignInMethods)

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

	err := CheckClaudeSignIn(context.Background(), executable, nil, []string{token}, "/accounts/a", journalSignInMethods)

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

func readUsage(t *testing.T, lines ...string) (*recordedUsage, contracts.TurnEnd) {
	t.Helper()
	usage := &recordedUsage{}
	end := readClaudeResult(strings.NewReader(strings.Join(lines, "\n")), usage, 4)
	return usage, end
}

const successResult = `{"type":"result","subtype":"success","is_error":false}`

func TestBothWindowsOfARateLimitEventAreReadAsPercentsWithTheirResets(t *testing.T) {
	usage, end := readUsage(t,
		`{"type":"rate_limit_event","rate_limit_info":{"status":"allowed","unifiedWindows":{`+
			`"five_hour":{"utilization":0.25,"resetsAt":1764000000},"seven_day":{"utilization":0,"resetsAt":1764500000}}}}`,
		`{"type":"rate_limit_event","rate_limit_info":{"status":"allowed"}}`,
		`{"type":"rate_limit_event","rate_limit_info":{"unifiedWindows":{"five_hour":{"utilization":1.5},`+
			`"seven_day":{"utilization":0.5}}}}`,
		successResult)
	if end.ResultIsError || end.Problem != "" {
		t.Fatalf("the result was told as %+v", end)
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
	usage, end := readUsage(t,
		`{"type":"result","subtype":"success","uuid":"r1","total_cost_usd":4,`+
			`"model_usage_since_last_result":{"opus":{"costUSD":3.5},"haiku":{"costUSD":0.5}}}`,
		`{"type":"result","subtype":"success","total_cost_usd":7,"model_usage_since_last_result":{"opus":{"costUSD":3}}}`,
		`{"type":"result","subtype":"success","total_cost_usd":9}`,
		`{"type":"result","subtype":"success","model_usage_since_last_result":{}}`,
		`{"type":"result","subtype":"success","model_usage_since_last_result":{"opus":{"costUSD":-1}}}`,
		successResult)
	if end.ResultIsError || end.Problem != "" {
		t.Fatalf("the result was told as %+v", end)
	}

	if strings.Join(usage.costs, " ") != "4.000000000000 3.000000000000" {
		t.Fatalf("costs %v", usage.costs)
	}
	if strings.Join(usage.results, " ") != "r1 process-4-result-2" {
		t.Fatalf("result ids %v", usage.results)
	}
}

func TestAnErrorResultIsToldAndStillGivesItsCost(t *testing.T) {
	usage, end := readUsage(t, `{"type":"result","subtype":"error_during_execution","is_error":true,`+
		`"model_usage_since_last_result":{"opus":{"costUSD":0.0128}}}`)

	if !end.ResultIsError || end.ResultSubtype != "error_during_execution" {
		t.Fatalf("the error result was told as %+v", end)
	}
	if len(usage.costs) != 1 || usage.costs[0] != "0.012800000000" {
		t.Fatalf("costs %v", usage.costs)
	}
}
