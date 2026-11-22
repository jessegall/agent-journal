package terminal

import (
	"bytes"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/screen"
)

// receiptGate is a gate at a ready prompt with a live browser grant, the layout to classify its prompt by, and the
// program the gate writes to.
func receiptGate(t *testing.T) (*InputGate, BrowserGrant, screen.Layout, *bytes.Buffer) {
	t.Helper()
	gate, _, program := grantGate(t)
	grant, err := gate.Take("take-1", scope)
	if err != nil {
		t.Fatal(err)
	}

	return gate, grant, profiles.ClaudeCode{}.Screens(), program
}

func textAt(grant BrowserGrant, sequence uint64, text string) BrowserOperation {
	return BrowserOperation{
		GrantID:    grant.ID,
		Sequence:   sequence,
		Generation: scope.Generation,
		Attachment: scope.Attachment,
		Kind:       TextOperation,
		Text:       text,
	}
}

func TestAFreshOperationAtTheNextSequenceIsTheOnlyOneThatWrites(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)

	first := gate.ApplyBrowser(textAt(grant, 1, "ls"), layout, "")
	repeat := gate.ApplyBrowser(textAt(grant, 1, "ls"), layout, "")
	conflict := gate.ApplyBrowser(textAt(grant, 1, "rm"), layout, "")
	gap := gate.ApplyBrowser(textAt(grant, 3, "pwd"), layout, "")

	if first.Outcome != Applied || first.BytesWritten != 2 {
		t.Fatalf("the fresh operation was %+v", first)
	}
	if repeat.Outcome != Duplicate || conflict.Outcome != Conflict {
		t.Fatalf("a repeat was %s and other content at a used sequence %s", repeat.Outcome, conflict.Outcome)
	}
	if gap.Outcome != Gap || gap.Expected != 2 {
		t.Fatalf("a gap was %+v", gap)
	}
	if program.String() != "ls" {
		t.Fatalf("the program got %q", program.String())
	}
}

func TestASequenceWhoseReceiptWasEvictedIsUnknown(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)
	for sequence := uint64(1); sequence <= receiptLimit+1; sequence++ {
		gate.ApplyBrowser(textAt(grant, sequence, "x"), layout, "")
	}
	before := program.Len()

	evicted := gate.ApplyBrowser(textAt(grant, 1, "x"), layout, "")

	if evicted.Outcome != Evicted || program.Len() != before {
		t.Fatalf("an evicted sequence was %s and wrote %d bytes", evicted.Outcome, program.Len()-before)
	}
}

func TestAnEndedGrantGetsExpiredEvenForARepeat(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)
	gate.ApplyBrowser(textAt(grant, 1, "ls"), layout, "")
	_ = gate.Release(grant.ID)

	repeat := gate.ApplyBrowser(textAt(grant, 1, "ls"), layout, "")
	fresh := gate.ApplyBrowser(textAt(grant, 2, "pwd"), layout, "")

	if repeat.Outcome != Expired || fresh.Outcome != Expired || program.String() != "ls" {
		t.Fatalf("an ended grant answered %s and %s and the program got %q", repeat.Outcome, fresh.Outcome, program.String())
	}
}

func TestAStalePromptRevisionIsPausedAndWritesNothing(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)
	stale := textAt(grant, 1, "ls")
	stale.PromptRevision = 7

	paused := gate.ApplyBrowser(stale, layout, "")

	if paused.Outcome != Paused || program.Len() != 0 {
		t.Fatalf("a stale prompt revision was %s and the program got %q", paused.Outcome, program.String())
	}
}

// shortProgram takes one byte of every write.
type shortProgram struct{ written bytes.Buffer }

func (program *shortProgram) Write(bytes []byte) (int, error) {
	return program.written.Write(bytes[:1])
}

func TestAShortWriteFencesTheStreamUntilAScreenCheck(t *testing.T) {
	reader, layout := readyClaudeCode(t)
	program := &shortProgram{}
	gate := NewInputGate(program, reader, layout.Composer, time.Now)
	grant, _ := gate.Take("take-1", scope)

	short := gate.ApplyBrowser(textAt(grant, 1, "ls -la"), layout, "")
	fenced := gate.ApplyBrowser(textAt(grant, 2, "pwd"), layout, "")
	check := BrowserOperation{GrantID: grant.ID, Generation: 1, Attachment: "attachment-1", Kind: CheckOperation}
	checked := gate.ApplyBrowser(check, layout, "")
	after := gate.ApplyBrowser(textAt(grant, 2, "p"), layout, "")

	if short.Outcome != Uncertain || short.BytesWritten != 1 {
		t.Fatalf("a short write was %+v", short)
	}
	if fenced.Outcome != Uncertain || program.written.String() != "l" {
		t.Fatalf("the fenced stream answered %s and the program got %q", fenced.Outcome, program.written.String())
	}
	if checked.Outcome != Applied || after.Outcome != Applied {
		t.Fatalf("the screen check answered %s and the next write %s", checked.Outcome, after.Outcome)
	}
}
