package recording

import (
	"bytes"
	"testing"
	"time"
)

func TestReplayWritesTheRecordedChunksInOrderOnTheFakeClock(t *testing.T) {
	start := time.Date(2026, 11, 18, 12, 0, 0, 0, time.UTC)
	clock := NewFakeClock(start)
	recorder := NewRecorder(Fixture{Driver: "claude", Mode: TerminalMode}, clock.Now)

	recorder.Output("terminal", []byte("welcome\r\n"))
	clock.Sleep(250 * time.Millisecond)
	recorder.Output("terminal", []byte("> "))
	fixture := recorder.Finish(0)

	replayClock := NewFakeClock(start)
	var sink bytes.Buffer
	replayed, err := Replay(fixture, &sink, replayClock)

	if err != nil {
		t.Fatal(err)
	}
	if sink.String() != "welcome\r\n> " || len(replayed) != 2 {
		t.Fatalf("replayed %q in %d chunks", sink.String(), len(replayed))
	}
	if !replayClock.Now().Equal(start.Add(250 * time.Millisecond)) {
		t.Fatalf("the fake clock is at %s", replayClock.Now())
	}
}

func TestSecretInputKeepsOnlyItsLengthThroughSaveAndLoad(t *testing.T) {
	recorder := NewRecorder(Fixture{Driver: "codex", Mode: ProcessMode}, time.Now)
	recorder.Input([]byte("hunter2"), true)
	recorder.Input([]byte("hello"), false)
	folder := t.TempDir()

	if err := recorder.Finish(0).Save(folder); err != nil {
		t.Fatal(err)
	}
	loaded, err := Load(folder)
	if err != nil {
		t.Fatal(err)
	}

	secret, plain := loaded.Inputs[0], loaded.Inputs[1]
	if secret.Bytes != nil || secret.Length != 7 || !secret.Secret {
		t.Fatalf("secret input was written: %+v", secret)
	}
	if string(plain.Bytes) != "hello" {
		t.Fatalf("plain input lost: %+v", plain)
	}
}
