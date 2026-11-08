package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

func TestTheMainAgentGoesAroundTheJournalWhileThePanicFileExists(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".journal", "runtime"), 0o755); err != nil {
		t.Fatal(err)
	}
	if Panicking(root, "") {
		t.Fatal("no panic file, yet the hook went around the journal")
	}
	if err := os.WriteFile(filepath.Join(root, ".journal", PanicFile), []byte("who: main agent\nwhy: the journal does not answer\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if !Panicking(root, "") || !Panicking(root, "main") {
		t.Fatal("the main agent's hook should go around the journal while the panic file exists")
	}
	if Panicking(root, "worker") || Panicking(root, "helper") {
		t.Fatal("a worker or helper must stay checked during a panic")
	}
	NotePanicBypass(root, "claude")
	text, err := os.ReadFile(filepath.Join(root, ".journal", "runtime", "bypass.log"))
	if err != nil || len(text) == 0 {
		t.Fatal("the bypass was not recorded")
	}
}

func TestAPanicFileWithNoReasonGoesNowhere(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".journal"), 0o755); err != nil {
		t.Fatal(err)
	}
	for _, text := range []string{"", "who: main agent\n", "who: main agent\nwhy:   \n"} {
		if err := os.WriteFile(filepath.Join(root, ".journal", PanicFile), []byte(text), 0o644); err != nil {
			t.Fatal(err)
		}
		if Panicking(root, "main") {
			t.Fatalf("a panic file with no reason let a hook go around the journal: %q", text)
		}
	}
	if err := os.WriteFile(filepath.Join(root, ".journal", PanicFile), []byte("who: main agent\nwhy: no answer for a minute\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if PanicReason(root) != "no answer for a minute" {
		t.Fatalf("the reason was read as %q", PanicReason(root))
	}
}

func TestEachPanicCheckCountsDownFromTenAndTheEleventhMakesTheAgentResume(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".journal", "runtime"), 0o755); err != nil {
		t.Fatal(err)
	}
	claude := programs.LoadTable("").Programs["claude"]
	for round := 0; round < 2; round++ {
		for left := PanicCountFrom; left >= 0; left-- {
			if got := NextPanicCount(root); got != left {
				t.Fatalf("round %d: the check counted %d left, not %d", round, got, left)
			}
		}
	}
	ClearPanicCount(root)
	if got := NextPanicCount(root); got != PanicCountFrom {
		t.Fatalf("a new panic counted %d, not %d", got, PanicCountFrom)
	}
	counting := PanicReply(claude, "pre_tool_use", 7)
	if counting.Refusal != "" || len(counting.Lines) != 1 || !strings.Contains(counting.Lines[0], "panic mode is on: 7 checks left") {
		t.Fatalf("a check with 7 left said %+v", counting)
	}
	forced := PanicReply(claude, "pre_tool_use", 0)
	if !strings.Contains(forced.Refusal, "take up your panic work again before anything else") {
		t.Fatalf("the check at 0 said %+v", forced)
	}
	if line := PanicReply(claude, "session_start", 0); line.Refusal != "" || len(line.Lines) != 1 {
		t.Fatalf("an event that cannot refuse should get the words as a line: %+v", line)
	}
}

func TestAPanickingHookAnswersWithTheCountdownAndNothingOnceItIsOff(t *testing.T) {
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, ".journal", "runtime"), 0o755); err != nil {
		t.Fatal(err)
	}
	claude := programs.LoadTable("").Programs["claude"]
	var stdout, stderr strings.Builder
	code := panicAnswered(strings.NewReader(`{"hook_event_name":"UserPromptSubmit"}`), &stdout, &stderr, claude, root)
	if code != 0 || !strings.Contains(stdout.String(), "panic mode is on: 10 checks left") {
		t.Fatalf("the first check answered %d %q %q", code, stdout.String(), stderr.String())
	}
	ClearPanicCount(root)
	if _, err := os.Stat(filepath.Join(root, ".journal", "runtime", "panic-count")); err == nil {
		t.Fatal("the count stayed after panic mode went off")
	}
}
