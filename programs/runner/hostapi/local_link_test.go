package hostapi

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestLocalLinkReadersRefuseInvalidFields(t *testing.T) {
	t.Run("adopt", func(t *testing.T) {
		assertLocalLinkFields(t, ReadLocalLinkAdopt, LocalLinkAdopt{}, "generation")
	})
	t.Run("instruction", func(t *testing.T) {
		assertLocalLinkFields(t, ReadLocalLinkInstruction, LocalLinkInstruction{}, "sequence")
	})
	t.Run("answer", func(t *testing.T) {
		assertLocalLinkFields(t, ReadLocalLinkAnswer, LocalLinkAnswer{}, "instruction_id")
	})
	t.Run("output", func(t *testing.T) {
		output := LocalLinkOutput{Frames: []Frame{}, Chunks: []Chunk{}}
		assertLocalLinkFields(t, ReadLocalLinkOutput, output, "frames")
	})
	t.Run("exit", func(t *testing.T) {
		assertLocalLinkFields(t, ReadLocalLinkExit, LocalLinkExit{}, "code")
	})
}

func assertLocalLinkFields[T any](t *testing.T, read func([]byte) (T, error), message T, field string) {
	t.Helper()
	encoded, err := json.Marshal(message)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := read(encoded); err != nil {
		t.Fatalf("the declared message was refused: %v", err)
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(encoded, &fields); err != nil {
		t.Fatal(err)
	}

	refuses := func(name string) {
		t.Helper()
		invalid, err := json.Marshal(fields)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := read(invalid); err == nil || !strings.Contains(err.Error(), name) {
			t.Fatalf("read %s returned %v, want a refusal naming %s", invalid, err, name)
		}
	}

	fields["extra"] = json.RawMessage("true")
	refuses("extra")
	delete(fields, "extra")
	delete(fields, field)
	refuses(field)
	fields[field] = json.RawMessage("true")
	refuses(field)
}
