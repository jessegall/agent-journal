package terminal

import (
	"bytes"
	"errors"
	"testing"
	"time"
)

// grantGate is a gate at a ready prompt whose clock the test moves.
func grantGate(t *testing.T) (*InputGate, *time.Time, *bytes.Buffer) {
	t.Helper()
	reader, layout := readyClaudeCode(t)
	program := &bytes.Buffer{}
	clock := time.Unix(100, 0)

	return NewInputGate(program, reader, layout.Composer, func() time.Time { return clock }), &clock, program
}

var scope = GrantScope{Generation: 1, Attachment: "attachment-1"}

func TestATakeHoldsTheInputAcrossPromptsAndRefusesTheDriverAndKeyScripts(t *testing.T) {
	gate, _, program := grantGate(t)

	grant, err := gate.Take("take-1", scope)
	if err != nil {
		t.Fatal(err)
	}

	if grant.ID == "" || grant.Scope != scope || gate.Owner() != BrowserInput {
		t.Fatalf("the take gave %+v with the input owned by %s", grant, gate.Owner())
	}
	if _, err := gate.Type("request-1", 1, "run the tests", 0); !errors.Is(err, ErrComposerHeld) {
		t.Fatalf("a driver line went in under a browser grant: %v", err)
	}
	if err := gate.Keys("\x1b[B"); !errors.Is(err, ErrComposerHeld) {
		t.Fatalf("a key script step went in under a browser grant: %v", err)
	}
	if _, err := gate.Choose(SendDraft, ""); !errors.Is(err, ErrComposerHeld) {
		t.Fatalf("a draft choice went in under a browser grant: %v", err)
	}
	if program.Len() != 0 {
		t.Fatalf("bytes reached the program: %q", program.String())
	}
}

func TestReleasingWithAnEmptyComposerLetsTheJournalTypeAgain(t *testing.T) {
	gate, _, _ := grantGate(t)
	grant, _ := gate.Take("take-1", scope)

	if err := gate.Release(grant.ID); err != nil {
		t.Fatal(err)
	}

	if gate.Owner() != NobodyOwns {
		t.Fatalf("after release the input is %s", gate.Owner())
	}
	if err := gate.Keys("\x1b[B"); err != nil {
		t.Fatalf("a key script stayed held after release: %v", err)
	}
}

func TestACancelEndsItsOwnGrantAndALateTakeNeverRevivesIt(t *testing.T) {
	gate, _, _ := grantGate(t)
	grant, _ := gate.Take("take-1", scope)

	gate.Cancel("take-1")

	if _, err := gate.Renew(grant.ID); !errors.Is(err, ErrGrantEnded) {
		t.Fatalf("the cancelled take's grant renewed: %v", err)
	}
	if _, err := gate.Take("take-1", scope); !errors.Is(err, ErrTakeCancelled) {
		t.Fatalf("a late take of a cancelled request was taken: %v", err)
	}
}

func TestACancelOfAnOlderTakeLeavesTheNewerHolderAlone(t *testing.T) {
	gate, _, _ := grantGate(t)
	first, _ := gate.Take("take-1", scope)
	_ = gate.Release(first.ID)
	newer, _ := gate.Take("take-2", scope)

	gate.Cancel("take-1")

	if state := gate.GrantState(); state.GrantID != newer.ID || state.Owner != BrowserInput {
		t.Fatalf("cancelling the old take touched the newer holder: %+v", state)
	}
	if _, err := gate.Take("take-3", scope); !errors.Is(err, ErrGrantHeld) {
		t.Fatalf("a second writer took the input from a live grant: %v", err)
	}
}

func TestAGrantExpiresThirtySecondsAfterItsLastRenewal(t *testing.T) {
	gate, clock, _ := grantGate(t)
	grant, _ := gate.Take("take-1", scope)

	*clock = clock.Add(20 * time.Second)
	if _, err := gate.Renew(grant.ID); err != nil {
		t.Fatal(err)
	}
	*clock = clock.Add(29 * time.Second)
	if gate.Owner() != BrowserInput {
		t.Fatal("the renewed grant ended early")
	}

	*clock = clock.Add(time.Second)

	if _, err := gate.Renew(grant.ID); !errors.Is(err, ErrGrantEnded) {
		t.Fatalf("an expired grant renewed: %v", err)
	}
	if gate.Owner() != NobodyOwns {
		t.Fatalf("after expiry the input is %s", gate.Owner())
	}
}

func TestALocalKeyRetiresTheBrowserGrantBeforeItsBytesAreWritten(t *testing.T) {
	gate, _, program := grantGate(t)
	grant, _ := gate.Take("take-1", scope)

	if err := gate.UserTyped([]byte("x")); err != nil {
		t.Fatal(err)
	}

	state := gate.GrantState()
	if state.GrantID != "" || !state.LocalControl || state.Owner != UserInput {
		t.Fatalf("the local key left the grant in place: %+v", state)
	}
	if _, err := gate.Renew(grant.ID); !errors.Is(err, ErrGrantEnded) {
		t.Fatalf("the retired grant renewed: %v", err)
	}
	if program.String() != "x" {
		t.Fatalf("the program got %q", program.String())
	}
}

func TestALocalResizeRetiresTheBrowserGrant(t *testing.T) {
	gate, _, _ := grantGate(t)
	gate.Take("take-1", scope)

	gate.LocalResized()

	if state := gate.GrantState(); state.GrantID != "" || !state.LocalControl {
		t.Fatalf("the local resize left the grant in place: %+v", state)
	}
}
