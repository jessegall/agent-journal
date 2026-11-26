package hookadapter

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

const testKey = "the-start-key"

// writeReplies writes a sealed reply file and its key into a new folder, the way the journal writes them for a
// driver whose spawn tool is the given one, and answers the reply file's path.
func writeReplies(t *testing.T, spawnTool string, deny string) string {
	t.Helper()
	folder := t.TempDir()
	events := []string{"SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop", "SessionEnd"}
	refusal := Reply{Stdout: deny}
	answers := map[string]map[string]Reply{}
	for _, reason := range []string{reasonAway, reasonUnprepared, reasonSpawn} {
		answers[reason] = map[string]Reply{}
		for _, event := range events {
			answers[reason][event] = Reply{Stdout: "{}"}
		}
		answers[reason]["PreToolUse"] = Reply{Stdout: reason + ":" + refusal.Stdout}
	}
	body, err := json.Marshal(Replies{
		Events:       events,
		ToolEvents:   []string{"PreToolUse", "PostToolUse"},
		SpawnTools:   []string{spawnTool},
		BudgetMs:     200,
		Retries:      1,
		UnknownEvent: Reply{Stderr: "no such event\n", ExitCode: 2},
		Answers:      answers,
	})
	if err != nil {
		t.Fatal(err)
	}
	sealed, _ := json.Marshal(sealedFile{Body: string(body), Seal: sealOf(string(body), []byte(testKey))})
	path := filepath.Join(folder, "hook-replies.json")
	if err := os.WriteFile(path, sealed, 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(folder, "hook-replies.key"), []byte(testKey), 0o600); err != nil {
		t.Fatal(err)
	}

	return path
}

func preparedAdapter(t *testing.T, path string, ask func(context.Context, []byte) (Reply, error)) Adapter {
	t.Helper()
	preparation := filepath.Join(t.TempDir(), "prepared")
	if err := os.WriteFile(preparation, []byte("prepared\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	return Adapter{Ask: ask, RepliesFile: path, PreparationFile: preparation}
}

func journalAway(context.Context, []byte) (Reply, error) {
	return Reply{}, errors.New("unreachable")
}

func TestAJournalAwayIsAnsweredFromTheFileForEachDriversShape(t *testing.T) {
	for driver, spawnTool := range map[string]string{"first-driver": "Task", "second-driver": "spawn_agent"} {
		path := writeReplies(t, spawnTool, driver+"-deny")
		adapter := preparedAdapter(t, path, journalAway)

		tool := adapter.Answer([]byte(`{"hook_event_name":"PreToolUse","tool_name":"Bash"}`))
		stop := adapter.Answer([]byte(`{"hook_event_name":"Stop"}`))

		if tool.Stdout != "away:"+driver+"-deny" || stop.Stdout != "{}" {
			t.Fatalf("%s: got %+v and %+v", driver, tool, stop)
		}
	}
}

func TestASpawnToolIsRefusedWithoutAskingTheJournal(t *testing.T) {
	asked := false
	adapter := preparedAdapter(t, writeReplies(t, "Task", "deny"), func(context.Context, []byte) (Reply, error) {
		asked = true
		return Reply{Stdout: "allowed"}, nil
	})

	reply := adapter.Answer([]byte(`{"hook_event_name":"PreToolUse","tool_name":"Task"}`))

	if reply.Stdout != "spawn:deny" || asked {
		t.Fatalf("got %+v, asked %v", reply, asked)
	}
}

func TestAToolCallBeforeTheStartIsPreparedIsRefused(t *testing.T) {
	adapter := Adapter{Ask: journalAway, RepliesFile: writeReplies(t, "Task", "deny"), PreparationFile: filepath.Join(t.TempDir(), "none")}

	reply := adapter.Answer([]byte(`{"hook_event_name":"PreToolUse","tool_name":"Bash"}`))

	if reply.Stdout != "unprepared:deny" {
		t.Fatalf("got %+v", reply)
	}
}

func TestTheJournalsAnswerPassesAndAnUnknownEventIsRefused(t *testing.T) {
	adapter := preparedAdapter(t, writeReplies(t, "Task", "deny"), func(context.Context, []byte) (Reply, error) {
		return Reply{Stdout: "from the journal"}, nil
	})

	answered := adapter.Answer([]byte(`{"hook_event_name":"PreToolUse","tool_name":"Bash"}`))
	unknown := adapter.Answer([]byte(`{"hook_event_name":"Notification"}`))

	if answered.Stdout != "from the journal" || unknown.ExitCode != 2 {
		t.Fatalf("got %+v and %+v", answered, unknown)
	}
}

func TestATamperedOrMissingFileRefusesEveryCall(t *testing.T) {
	path := writeReplies(t, "Task", "deny")
	content, _ := os.ReadFile(path)
	content[20] ^= 1
	if err := os.WriteFile(path, content, 0o600); err != nil {
		t.Fatal(err)
	}
	allow := func(context.Context, []byte) (Reply, error) { return Reply{Stdout: "allowed"}, nil }

	tampered := preparedAdapter(t, path, allow).Answer([]byte(`{"hook_event_name":"Stop"}`))
	missing := preparedAdapter(t, filepath.Join(t.TempDir(), "hook-replies.json"), allow).Answer([]byte(`{"hook_event_name":"Stop"}`))

	if tampered.ExitCode != 2 || missing.ExitCode != 2 {
		t.Fatalf("got %+v and %+v", tampered, missing)
	}
}
