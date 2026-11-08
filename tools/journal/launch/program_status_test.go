package launch

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

const assistantLine = `{"type":"assistant","parent_tool_use_id":null,"session_id":"s-1","message":{"model":"small","usage":{"input_tokens":2,"cache_creation_input_tokens":98,"cache_read_input_tokens":200000,"output_tokens":700}}}` + "\n"
const subagentLine = `{"type":"assistant","parent_tool_use_id":"tool-1","session_id":"s-1","message":{"model":"small","usage":{"input_tokens":900000}}}` + "\n"
const resultLine = `{"type":"result","session_id":"s-1","total_cost_usd":1.5,"modelUsage":{"small":{"contextWindow":400000}}}` + "\n"

func keptStatus(t *testing.T, home, folder string) statusReport {
	t.Helper()
	text, err := os.ReadFile(filepath.Join(home, "runtime", "status", folder, "s-1.json"))
	if err != nil {
		t.Fatal(err)
	}
	var report statusReport
	if err := json.Unmarshal(text, &report); err != nil {
		t.Fatal(err)
	}
	return report
}

func TestAnAssistantLineKeepsTheContextInUseAndSkipsItsChildrensLines(t *testing.T) {
	home := t.TempDir()
	status := NewProgramStatus(home)
	fmt.Fprint(status, "not a json line\n"+assistantLine+subagentLine)
	report := keptStatus(t, home, "")
	if report.Context.UsedPercentage != 20 || report.Cost != nil {
		t.Fatalf("kept %+v", report)
	}
}

func TestAnAssistantLineKeepsTheTokensInUseForTheContextLimit(t *testing.T) {
	home := t.TempDir()
	status := NewProgramStatus(home)
	fmt.Fprint(status, assistantLine)
	if report := keptStatus(t, home, ""); report.Context.TotalInputTokens != 200100 {
		t.Fatalf("kept %+v", report.Context)
	}
}

func TestAResultLineKeepsTheCostAndTheModelsContextWindow(t *testing.T) {
	home := t.TempDir()
	status := NewProgramStatus(home)
	fmt.Fprint(status, assistantLine+resultLine)
	report := keptStatus(t, home, "")
	if report.Context.UsedPercentage != 50 || report.Cost.TotalCostUSD != 1.5 {
		t.Fatalf("kept %+v", report)
	}
}

func TestALineInTwoWritesIsReadWhenItEnds(t *testing.T) {
	home := t.TempDir()
	status := NewProgramStatus(home)
	fmt.Fprint(status, assistantLine[:20])
	fmt.Fprint(status, assistantLine[20:])
	if keptStatus(t, home, "").Context.UsedPercentage != 20 {
		t.Fatal("the line was not read")
	}
}

func TestALineAfterTheFileMovedToEndedFollowsIt(t *testing.T) {
	home := t.TempDir()
	status := NewProgramStatus(home)
	fmt.Fprint(status, assistantLine)
	folder := filepath.Join(home, "runtime", "status")
	if err := os.MkdirAll(filepath.Join(folder, "ended"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Rename(filepath.Join(folder, "s-1.json"), filepath.Join(folder, "ended", "s-1.json")); err != nil {
		t.Fatal(err)
	}
	fmt.Fprint(status, resultLine)
	if _, err := os.Stat(filepath.Join(folder, "s-1.json")); err == nil {
		t.Fatal("the late line wrote the file back to the live folder")
	}
	if keptStatus(t, home, "ended").Cost.TotalCostUSD != 1.5 {
		t.Fatal("the late line did not reach the ended file")
	}
}

func TestAResumedSessionKeepsTheCostOfItsEndedFile(t *testing.T) {
	home := t.TempDir()
	ended := filepath.Join(home, "runtime", "status", "ended")
	if err := os.MkdirAll(ended, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(ended, "s-1.json"), []byte(`{"session_id":"s-1","cost":{"total_cost_usd":7.25}}`), 0o644); err != nil {
		t.Fatal(err)
	}
	fmt.Fprint(NewProgramStatus(home), assistantLine)
	report := keptStatus(t, home, "")
	if report.Cost == nil || report.Cost.TotalCostUSD != 7.25 {
		t.Fatalf("kept %+v", report)
	}
}
