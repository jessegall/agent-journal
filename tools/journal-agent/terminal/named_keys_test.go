package terminal

import "testing"

func keyAt(grant BrowserGrant, sequence uint64, key string) BrowserOperation {
	operation := textAt(grant, sequence, "")
	operation.Type, operation.Key = KeyOperation, key

	return operation
}

func pasteAt(grant BrowserGrant, sequence uint64, text string) BrowserOperation {
	operation := textAt(grant, sequence, text)
	operation.Type = PasteOperation

	return operation
}

func TestAnArrowAndCtrlCReachTheProgramOnceEach(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)

	gate.ApplyBrowser(keyAt(grant, 1, "up"), layout, "")
	gate.ApplyBrowser(keyAt(grant, 1, "up"), layout, "")
	gate.ApplyBrowser(keyAt(grant, 2, "ctrl_c"), layout, "")

	if program.String() != KeyArrowUp+"\x03" {
		t.Fatalf("the program got %q", program.String())
	}
}

func TestAMultiLinePasteIsBracketedOnlyForADriverThatTakesIt(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)

	pasted := gate.ApplyBrowser(pasteAt(grant, 1, "one\ntwo"), layout, "")
	layout.BracketedPaste = false
	refused := gate.ApplyBrowser(pasteAt(grant, 2, "three\nfour"), layout, "")

	if pasted.Outcome != Applied || program.String() != pasteStart+"one\ntwo"+pasteEnd {
		t.Fatalf("the bracketed paste was %s and the program got %q", pasted.Outcome, program.String())
	}
	if refused.Outcome != Paused {
		t.Fatalf("a multi-line paste without bracketed paste was %s", refused.Outcome)
	}
}

func TestAPasteOverItsBoundOrForAnEarlierPromptWritesNothing(t *testing.T) {
	gate, grant, layout, program := receiptGate(t)
	stale := pasteAt(grant, 1, "secret")
	stale.PromptRevision = 1

	large := gate.ApplyBrowser(pasteAt(grant, 1, string(make([]byte, PasteByteLimit+1))), layout, "")
	changed := gate.ApplyBrowser(stale, layout, "")

	if large.Outcome != Paused || changed.Outcome != Paused || program.Len() != 0 {
		t.Fatalf("the large paste was %s, the stale one %s, and the program got %q",
			large.Outcome, changed.Outcome, program.String())
	}
}
