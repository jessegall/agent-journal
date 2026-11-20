package host

import (
	"os"
	"path/filepath"
	"testing"

	"journal-agent/client"
)

const conversation = "0b6f1c2e-4d5a-4f6b-9c8d-7e6f5a4b3c2d"

func preparedWith(folder string, target string) PreparedStart {
	return PreparedStart{Claim: client.ClaimedStart{Directory: folder, ConversationTarget: target}}
}

func writeTranscript(t *testing.T, path string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte("{}\n"), 0o600); err != nil {
		t.Fatal(err)
	}
}

func TestATranscriptOfTheStartsOwnWorkspaceIsResumed(t *testing.T) {
	account := t.TempDir()
	writeTranscript(t, filepath.Join(account, "projects", "-work-helper", conversation+".jsonl"))

	resumed, ok := preparedWith(account, conversation).ResumableConversation("/work/helper")

	if !ok || resumed != conversation {
		t.Fatalf("the start's own transcript was not resumed: %q %v", resumed, ok)
	}
}

func TestAMissingOrForeignTranscriptIsNeverAttached(t *testing.T) {
	account := t.TempDir()
	writeTranscript(t, filepath.Join(account, "projects", "-work-other", conversation+".jsonl"))

	for name, prepared := range map[string]PreparedStart{
		"missing":         preparedWith(t.TempDir(), conversation),
		"other workspace": preparedWith(account, conversation),
		"no target":       preparedWith(account, ""),
		"path in the id":  preparedWith(account, "../"+conversation),
	} {
		if resumed, ok := prepared.ResumableConversation("/work/helper"); ok {
			t.Fatalf("%s: %q was attached", name, resumed)
		}
	}
}

func TestACodexRolloutOfTheConversationIsResumed(t *testing.T) {
	account := t.TempDir()
	writeTranscript(t, filepath.Join(account, "sessions", "2026", "11", "20", "rollout-2026-11-20T01-00-00-"+conversation+".jsonl"))

	if _, ok := preparedWith(account, conversation).ResumableConversation("/work/helper"); !ok {
		t.Fatal("the Codex rollout was not found")
	}
}
