package programs

import (
	"os"
	"path/filepath"
	"testing"
)

func TestTheShippedTableReadsAndNamesBothPrograms(t *testing.T) {
	table := LoadTable("")
	for _, name := range []string{"claude", "codex"} {
		if _, listed := table.Programs[name]; !listed {
			t.Fatalf("the shipped program table has no row for %s", name)
		}
	}
}

func TestAProjectTablesRowReplacesTheShippedOne(t *testing.T) {
	project := filepath.Join(t.TempDir(), "programs.json")
	os.WriteFile(project, []byte(`{"programs": {"claude": {"events": {"Stop": "stop"}, "decoder": "common"}, "sample": {"events": {"End": "stop"}, "decoder": "common"}}}`), 0o644)
	table := LoadTable(project)
	if len(table.Programs["claude"].Events) != 1 || table.Programs["sample"].Events["End"] != "stop" || table.Programs["codex"].Decoder != "codex" {
		t.Fatalf("the project table was not laid over the shipped one: %+v", table.Programs)
	}
}

func TestAProgramNamingAnUnknownDecoderIsRefused(t *testing.T) {
	context := testContext
	context.Programs = Table{Programs: map[string]Program{"odd": {Events: map[string]string{"Stop": "stop"}, Decoder: "odd"}}}
	if _, _, err := Prepared("odd", []byte(`{"hook_event_name": "Stop", "session_id": "s"}`), context); err == nil {
		t.Fatal("a program naming a decoder this journal-hook does not have was not refused")
	}
}

func TestEveryDecoderHasAShippedRowUsingIt(t *testing.T) {
	used := map[string]bool{}
	for _, program := range LoadTable("").Programs {
		used[program.Decoder] = true
	}
	for name := range decoders {
		if !used[name] {
			t.Errorf("no shipped program uses the decoder %s", name)
		}
	}
}
