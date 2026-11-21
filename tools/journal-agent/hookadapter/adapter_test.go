package hookadapter

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

const preToolUse = `{"hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"ls"}}`

func preparedAdapter(t *testing.T, ask func(ctx context.Context, native []byte) (Reply, error)) Adapter {
	t.Helper()
	file := filepath.Join(t.TempDir(), "prepared")
	if err := os.WriteFile(file, []byte("prepared\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	return Adapter{Ask: ask, PreparationFile: file}
}

func TestAPreToolUseCallGetsTheJournalsDecision(t *testing.T) {
	allow := Reply{Stdout: `{"hookSpecificOutput":{"permissionDecision":"allow"}}`}
	adapter := preparedAdapter(t, func(context.Context, []byte) (Reply, error) { return allow, nil })

	if reply := adapter.Answer([]byte(preToolUse)); reply != allow {
		t.Fatalf("answered %+v, want the journal's %+v", reply, allow)
	}
}

func TestWithTheJournalDownAPreToolUseCallGetsTheNativeDenyWithinTheBudget(t *testing.T) {
	calls := 0
	adapter := preparedAdapter(t, func(context.Context, []byte) (Reply, error) {
		calls++
		return Reply{}, errors.New("connection refused")
	})

	started := time.Now()
	reply := adapter.Answer([]byte(preToolUse))

	if !strings.Contains(reply.Stdout, `"permissionDecision":"deny"`) || reply.ExitCode != 0 {
		t.Fatalf("answered %+v, want the native PreToolUse deny", reply)
	}
	if calls != 2 || time.Since(started) > Budget {
		t.Fatalf("asked %d times in %s, want one retry within the budget", calls, time.Since(started))
	}
}

func TestALateAnswerAllowsNothing(t *testing.T) {
	adapter := preparedAdapter(t, func(ctx context.Context, _ []byte) (Reply, error) {
		<-ctx.Done()
		return Reply{Stdout: `{"allowed":true}`}, nil
	})

	if reply := adapter.Answer([]byte(preToolUse)); !strings.Contains(reply.Stdout, `"deny"`) {
		t.Fatalf("a late answer was used: %+v", reply)
	}
}

func TestAToolCallBeforeTheContextIsPreparedIsDenied(t *testing.T) {
	adapter := Adapter{
		Ask:             func(context.Context, []byte) (Reply, error) { return Reply{}, nil },
		PreparationFile: filepath.Join(t.TempDir(), "prepared"),
	}

	if reply := adapter.Answer([]byte(preToolUse)); !strings.Contains(reply.Stdout, "preparation-pending") {
		t.Fatalf("an unprepared tool call answered %+v", reply)
	}
	adapter.Answer([]byte(`{"hook_event_name":"SessionStart"}`))
	if reply := adapter.Answer([]byte(preToolUse)); strings.Contains(reply.Stdout, "preparation-pending") {
		t.Fatalf("a tool call after a valid SessionStart reply answered %+v", reply)
	}
}

func TestAnUnknownEventGetsANamedRefusal(t *testing.T) {
	adapter := preparedAdapter(t, func(context.Context, []byte) (Reply, error) { return Reply{}, nil })

	reply := adapter.Answer([]byte(`{"hook_event_name":"Teleport"}`))

	if reply.ExitCode != 2 || !strings.Contains(reply.Stderr, ErrUnknownEvent.Error()) || !strings.Contains(reply.Stderr, "Teleport") {
		t.Fatalf("an unknown event answered %+v", reply)
	}
}

func TestAVendorSpawnIsRefusedTowardJournalHelpers(t *testing.T) {
	asked := false
	adapter := preparedAdapter(t, func(context.Context, []byte) (Reply, error) {
		asked = true
		return Reply{Stdout: `{"allowed":true}`}, nil
	})

	reply := adapter.Answer([]byte(`{"hook_event_name":"PreToolUse","tool_name":"Task","tool_input":{}}`))

	if asked || !strings.Contains(reply.Stdout, `"deny"`) || !strings.Contains(reply.Stdout, "journal helper start") {
		t.Fatalf("a vendor spawn answered %+v (journal asked: %v)", reply, asked)
	}
}
