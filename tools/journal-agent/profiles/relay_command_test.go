package profiles

import "testing"

func TestTheRelayIsToldWhichProgramCallsIt(t *testing.T) {
	if got := relayCommand("/bin/journal-hook", claudeCodeJournalName); got != "/bin/journal-hook claude-code" {
		t.Fatalf("got %q", got)
	}
	if got := relayCommand("/bin/journal-hook codex", codexJournalName); got != "/bin/journal-hook codex" {
		t.Fatalf("a command that names its program got %q", got)
	}
}
