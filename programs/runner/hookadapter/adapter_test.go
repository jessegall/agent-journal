package hookadapter

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"journal-runner/recorded"
	"journal-runner/recording"
)

const testKey = "the-start-key"

// writeReplies writes a sealed reply file and its key into a new folder, the way the journal writes them for a
// driver whose spawn tool is the given one, and answers the reply file's path.
func writeReplies(t *testing.T, spawnTool string, deny string) string {
	t.Helper()
	folder := t.TempDir()
	events := []string{"SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "Stop"}
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

func nativeHook(t *testing.T, scenario string, wanted nativeCall) []byte {
	t.Helper()
	return decodedHookBody(t, recordedHook(t, scenario, wanted, 1).Asked.Body)
}

func recordedHook(t *testing.T, scenario string, wanted nativeCall, occurrence int) recorded.Call {
	t.Helper()
	calls, err := recorded.MustLoad(t, scenario).Calls(recording.WireHooks)
	if err != nil {
		t.Fatal(err)
	}
	for _, call := range calls {
		body := decodedHookBody(t, call.Asked.Body)
		if callOf(body) != wanted {
			continue
		}
		occurrence--
		if occurrence == 0 {
			return call
		}
	}
	t.Fatalf("%s has no recorded hook for %+v", scenario, wanted)
	return recorded.Call{}
}

func decodedHookBody(t *testing.T, body string) []byte {
	t.Helper()
	decoded, err := base64.StdEncoding.DecodeString(body)
	if err != nil {
		t.Fatal(err)
	}
	return decoded
}

func TestTheNativeClearCompactAndWriteReachTheJournalWhole(t *testing.T) {
	for _, hook := range []struct {
		scenario   string
		call       nativeCall
		occurrence int
	}{
		{"terminal-clear", nativeCall{Event: "SessionStart"}, 2},
		{"terminal-compact", nativeCall{Event: "SessionStart"}, 2},
		{"refused-write", nativeCall{Event: "PreToolUse", Tool: "Bash"}, 1},
	} {
		t.Run(hook.scenario, func(t *testing.T) {
			exchange := recordedHook(t, hook.scenario, hook.call, hook.occurrence)
			native := decodedHookBody(t, exchange.Asked.Body)
			var reply Reply
			if err := json.Unmarshal(decodedHookBody(t, exchange.Answered.Body), &reply); err != nil {
				t.Fatal(err)
			}
			adapter := preparedAdapter(t, writeReplies(t, "Task", "deny"), func(_ context.Context, body []byte) (Reply, error) {
				if !bytes.Equal(body, native) {
					return Reply{}, errors.New("the native hook changed on its way to the journal")
				}
				return reply, nil
			})

			if got := adapter.Answer(native); got != reply {
				t.Fatalf("the adapter did not pass the recorded journal reply: %+v", got)
			}
		})
	}
}

func TestAJournalAwayIsAnsweredFromTheFileForEachDriversShape(t *testing.T) {
	for scenario, spawnTool := range map[string]string{"terminal-turn": "Task", "second-terminal-turn": "spawn_agent"} {
		path := writeReplies(t, spawnTool, scenario+"-deny")
		adapter := preparedAdapter(t, path, journalAway)

		tool := adapter.Answer(nativeHook(t, scenario, nativeCall{Event: "PreToolUse", Tool: "Bash"}))
		stop := adapter.Answer(nativeHook(t, scenario, nativeCall{Event: "Stop"}))

		if tool.Stdout != "away:"+scenario+"-deny" || stop.Stdout != "{}" {
			t.Fatalf("%s: got %+v and %+v", scenario, tool, stop)
		}
	}
}

func TestASpawnToolIsRefusedWithoutAskingTheJournal(t *testing.T) {
	asked := false
	adapter := preparedAdapter(t, writeReplies(t, "Bash", "deny"), func(context.Context, []byte) (Reply, error) {
		asked = true
		return Reply{Stdout: "allowed"}, nil
	})

	reply := adapter.Answer(nativeHook(t, "terminal-turn", nativeCall{Event: "PreToolUse", Tool: "Bash"}))

	if reply.Stdout != "spawn:deny" || asked {
		t.Fatalf("got %+v, asked %v", reply, asked)
	}
}

func TestAToolCallBeforeTheStartIsPreparedIsRefused(t *testing.T) {
	adapter := Adapter{Ask: journalAway, RepliesFile: writeReplies(t, "Task", "deny"), PreparationFile: filepath.Join(t.TempDir(), "none")}

	reply := adapter.Answer(nativeHook(t, "terminal-turn", nativeCall{Event: "PreToolUse", Tool: "Bash"}))

	if reply.Stdout != "unprepared:deny" {
		t.Fatalf("got %+v", reply)
	}
}

func TestTheJournalsAnswerPassesAndAnUnknownEventIsRefused(t *testing.T) {
	adapter := preparedAdapter(t, writeReplies(t, "Task", "deny"), func(context.Context, []byte) (Reply, error) {
		return Reply{Stdout: "from the journal"}, nil
	})

	answered := adapter.Answer(nativeHook(t, "terminal-turn", nativeCall{Event: "PreToolUse", Tool: "Bash"}))
	unknown := adapter.Answer(nativeHook(t, "headless-turn", nativeCall{Event: "SessionEnd"}))

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

	stop := nativeHook(t, "terminal-turn", nativeCall{Event: "Stop"})
	tampered := preparedAdapter(t, path, allow).Answer(stop)
	missing := preparedAdapter(t, filepath.Join(t.TempDir(), "hook-replies.json"), allow).Answer(stop)

	if tampered.ExitCode != 2 || missing.ExitCode != 2 {
		t.Fatalf("got %+v and %+v", tampered, missing)
	}
}
