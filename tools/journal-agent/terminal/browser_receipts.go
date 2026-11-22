package terminal

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"io"
	"strings"

	"journal-agent/screen"
	"journal-agent/screen/contracts"
)

// OperationKind is what a browser operation does: ordinary text, one Enter, a screen check that reconciles an
// uncertain stream, or a draft choice at give-back.
type OperationKind string

const (
	TextOperation  OperationKind = "text"
	EnterOperation OperationKind = "enter"
	// CheckOperation reconciles a fenced stream against a fresh screen; it takes no sequence and writes nothing.
	CheckOperation  OperationKind = "check"
	ChoiceOperation OperationKind = "choice"
	// KeyOperation sends one named key; PasteOperation pastes text, several lines only in bracketed paste.
	KeyOperation   OperationKind = "key"
	PasteOperation OperationKind = "paste"
)

// PasteByteLimit is the most bytes one paste may carry.
const PasteByteLimit = 16 << 10

// The markers a driver in bracketed paste mode takes a paste between.
const (
	pasteStart = "\x1b[200~"
	pasteEnd   = "\x1b[201~"
)

// ReceiptOutcome is what became of a browser operation.
type ReceiptOutcome string

const (
	// Applied is an operation written to the PTY in full; it confirms delivery to the PTY only.
	Applied ReceiptOutcome = "applied"
	// Duplicate is an identical repeat of a retained operation: its first receipt, nothing written again.
	Duplicate ReceiptOutcome = "duplicate"
	// Conflict is other content at a sequence already used.
	Conflict ReceiptOutcome = "conflict"
	// Gap is a sequence that is not the next one; the receipt names the one expected.
	Gap ReceiptOutcome = "gap"
	// Evicted is a sequence below the high-water mark whose receipt is no longer kept: outcome unknown.
	Evicted ReceiptOutcome = "unknown"
	// Expired is an operation through a grant that ended or never was.
	Expired ReceiptOutcome = "expired"
	// Paused is an operation refused at this prompt: protected, unknown, changed since the writer saw it, or over
	// the byte bound.
	Paused ReceiptOutcome = "input-paused"
	// Uncertain is a write that may have reached the program in part, or a stream fenced until a screen check.
	Uncertain ReceiptOutcome = "uncertain"
)

// receiptLimit is how many receipts a grant keeps.
const receiptLimit = 64

// OperationByteLimit is the most bytes one browser operation may carry, checked before anything is buffered.
const OperationByteLimit = 64 << 10

// BrowserOperation is one write a browser writer asks for through their grant: which grant, its sequence, the
// generation and attachment it was meant for, the prompt revision the writer saw, and what to write.
type BrowserOperation struct {
	GrantID        string
	Sequence       uint64
	Generation     uint64
	Attachment     string
	PromptRevision uint64
	Kind           OperationKind
	Text           string
	Choice         DraftChoice
	Key            string
}

// BrowserReceipt is the payload-free outcome of a browser operation: its sequence, the outcome, the sequence
// expected after a gap, the bytes written, and the text a Save and clear saved, for that operation only.
type BrowserReceipt struct {
	Sequence     uint64
	Outcome      ReceiptOutcome
	Expected     uint64
	BytesWritten int
	SavedText    string
}

// storedReceipt is a receipt kept for repeats, with the keyed digest of its whole operation.
type storedReceipt struct {
	digest  []byte
	receipt BrowserReceipt
}

// grantReceipts is what a grant keeps of its operations: the latest receipts, the high-water mark, the key of the
// digests, and whether its stream is fenced as uncertain.
type grantReceipts struct {
	key       []byte
	receipts  []storedReceipt
	highWater uint64
	uncertain bool
}

func newGrantReceipts() (*grantReceipts, error) {
	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		return nil, err
	}

	return &grantReceipts{key: key}, nil
}

// digestOf is the keyed digest of the whole operation, content included.
func (receipts *grantReceipts) digestOf(operation BrowserOperation) []byte {
	mac := hmac.New(sha256.New, receipts.key)
	parts := []string{
		operation.GrantID,
		operation.Attachment,
		string(operation.Kind),
		operation.Text,
		string(operation.Choice),
		operation.Key,
	}
	for _, part := range parts {
		_ = binary.Write(mac, binary.BigEndian, uint32(len(part)))
		mac.Write([]byte(part))
	}
	numbers := [3]uint64{operation.Sequence, operation.Generation, operation.PromptRevision}
	_ = binary.Write(mac, binary.BigEndian, numbers)

	return mac.Sum(nil)
}

// retained answers an operation at a sequence already used, without writing: its first receipt for an identical
// repeat, conflict for other content, unknown for one no longer kept.
func (receipts *grantReceipts) retained(operation BrowserOperation) BrowserReceipt {
	digest := receipts.digestOf(operation)
	for _, stored := range receipts.receipts {
		if stored.receipt.Sequence != operation.Sequence {
			continue
		}
		if !hmac.Equal(stored.digest, digest) {
			return BrowserReceipt{Sequence: operation.Sequence, Outcome: Conflict}
		}
		repeat := stored.receipt
		repeat.Outcome, repeat.SavedText = Duplicate, ""

		return repeat
	}

	return BrowserReceipt{Sequence: operation.Sequence, Outcome: Evicted}
}

// keep records the receipt of a fresh operation and raises the high-water mark.
func (receipts *grantReceipts) keep(operation BrowserOperation, receipt BrowserReceipt) BrowserReceipt {
	receipts.highWater = operation.Sequence
	receipts.receipts = append(receipts.receipts, storedReceipt{digest: receipts.digestOf(operation), receipt: receipt})
	if len(receipts.receipts) > receiptLimit {
		receipts.receipts = receipts.receipts[len(receipts.receipts)-receiptLimit:]
	}

	return receipt
}

// ApplyBrowser carries out one browser operation under the gate lock: first the grant and its scope, then the
// receipt, then the prompt classified at source and its revision, and only a fresh operation at the exact next
// sequence writes; a short write fences the stream as uncertain until a screen check reconciles it. clearKeys are
// the profile's keys that empty the composer, for Save and clear.
func (gate *InputGate) ApplyBrowser(operation BrowserOperation, layout screen.Layout, clearKeys string) BrowserReceipt {
	gate.mutex.Lock()
	receipt, settle := gate.applyLocked(operation, layout, clearKeys)
	gate.mutex.Unlock()

	if settle == nil {
		return receipt
	}

	return settle()
}

// applyLocked is ApplyBrowser's work under the lock; a Save and clear hands back the wait for its empty composer.
func (gate *InputGate) applyLocked(
	operation BrowserOperation,
	layout screen.Layout,
	clearKeys string,
) (BrowserReceipt, func() BrowserReceipt) {
	gate.expireGrant()
	held := gate.browser.grant
	if held == nil || held.ID != operation.GrantID || !held.isFor(operation) {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Expired}, nil
	}
	receipts := gate.browser.receipts
	if operation.Kind == CheckOperation {
		receipts.uncertain = false

		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Applied}, nil
	}
	if operation.Sequence <= receipts.highWater {
		return receipts.retained(operation), nil
	}
	if operation.Sequence != receipts.highWater+1 {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Gap, Expected: receipts.highWater + 1}, nil
	}
	if receipts.uncertain {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Uncertain}, nil
	}
	if !gate.admitsPrompt(layout) || operation.PromptRevision != gate.browser.promptRevision ||
		len(operation.Text) > OperationByteLimit {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Paused}, nil
	}

	return gate.writeLocked(operation, receipts, clearKeys, layout.BracketedPaste)
}

// writeLocked writes a fresh, admitted operation and keeps its receipt.
func (gate *InputGate) writeLocked(
	operation BrowserOperation,
	receipts *grantReceipts,
	clearKeys string,
	bracketedPaste bool,
) (BrowserReceipt, func() BrowserReceipt) {
	switch operation.Kind {
	case TextOperation:
		return receipts.keep(operation, gate.writeCounted(operation.Sequence, receipts, operation.Text)), nil
	case EnterOperation:
		return receipts.keep(operation, gate.writeCounted(operation.Sequence, receipts, enterKey)), nil
	case KeyOperation:
		return gate.keyLocked(operation, receipts), nil
	case PasteOperation:
		return gate.pasteLocked(operation, receipts, bracketedPaste), nil
	}

	return gate.chooseLocked(operation, receipts, clearKeys)
}

// keyLocked writes one named key's sequence; a name the table does not know writes nothing.
func (gate *InputGate) keyLocked(operation BrowserOperation, receipts *grantReceipts) BrowserReceipt {
	sequence, found := KeySequence(operation.Key)
	if !found {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Paused}
	}

	return receipts.keep(operation, gate.writeCounted(operation.Sequence, receipts, sequence))
}

// pasteLocked writes a paste: one ordinary line as plain text with no Enter, several lines or control characters
// only between the bracketed paste markers of a driver that takes them; anything else, and a paste over its bound,
// writes nothing.
func (gate *InputGate) pasteLocked(operation BrowserOperation, receipts *grantReceipts, bracketed bool) BrowserReceipt {
	if len(operation.Text) > PasteByteLimit {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Paused}
	}
	if isOrdinaryLine(operation.Text) {
		return receipts.keep(operation, gate.writeCounted(operation.Sequence, receipts, operation.Text))
	}
	if !bracketed {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Paused}
	}
	pasted := pasteStart + strings.ReplaceAll(operation.Text, pasteEnd, "") + pasteEnd

	return receipts.keep(operation, gate.writeCounted(operation.Sequence, receipts, pasted))
}

// isOrdinaryLine is whether the text is one line with no control character in it.
func isOrdinaryLine(text string) bool {
	for _, character := range text {
		if character < ' ' || character == 0x7f {
			return false
		}
	}

	return true
}

// chooseLocked carries out a give-back choice: Send presses Enter once, Keep typing writes nothing, and Save and
// clear writes the clear keys and succeeds only once the composer is seen empty.
func (gate *InputGate) chooseLocked(
	operation BrowserOperation,
	receipts *grantReceipts,
	clearKeys string,
) (BrowserReceipt, func() BrowserReceipt) {
	switch operation.Choice {
	case SendDraft:
		return receipts.keep(operation, gate.writeCounted(operation.Sequence, receipts, enterKey)), nil
	case SaveAndClearDraft:
		saved := gate.composerText()
		written := gate.writeCounted(operation.Sequence, receipts, clearKeys)
		if written.Outcome != Applied {
			return receipts.keep(operation, written), nil
		}

		return BrowserReceipt{}, func() BrowserReceipt { return gate.settleSaveAndClear(operation, saved) }
	}

	return receipts.keep(operation, BrowserReceipt{Sequence: operation.Sequence, Outcome: Applied}), nil
}

// settleSaveAndClear waits for the composer to show empty; only then is the saved text the writer's, and a clear
// that does not show keeps the hold as uncertain.
func (gate *InputGate) settleSaveAndClear(operation BrowserOperation, saved string) BrowserReceipt {
	cleared := gate.waitFor(func() bool { return gate.composerText() == "" })

	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	held := gate.browser.grant
	if held == nil || held.ID != operation.GrantID {
		return BrowserReceipt{Sequence: operation.Sequence, Outcome: Expired}
	}
	receipts := gate.browser.receipts
	if !cleared {
		receipts.uncertain = true

		return receipts.keep(operation, BrowserReceipt{Sequence: operation.Sequence, Outcome: Uncertain})
	}

	receipt := BrowserReceipt{Sequence: operation.Sequence, Outcome: Applied, SavedText: saved}
	receipts.keep(operation, BrowserReceipt{Sequence: operation.Sequence, Outcome: Applied})

	return receipt
}

// writeCounted writes the bytes and counts what the program took: a short or failed write fences the stream.
func (gate *InputGate) writeCounted(sequence uint64, receipts *grantReceipts, text string) BrowserReceipt {
	written, err := io.WriteString(gate.program, text)
	if err != nil || written != len(text) {
		receipts.uncertain = true

		return BrowserReceipt{Sequence: sequence, Outcome: Uncertain, BytesWritten: written}
	}

	return BrowserReceipt{Sequence: sequence, Outcome: Applied, BytesWritten: written}
}

// admitsPrompt classifies the prompt at source: a composer drawn on a screen that asks for no secret. A prompt that
// turns protected or unknown raises the prompt revision, so an operation the writer meant for the earlier prompt
// never lands on the new one; the caller holds the mutex.
func (gate *InputGate) admitsPrompt(layout screen.Layout) bool {
	snapshot := gate.reader.Snapshot()
	allowed := gate.composerDrawn(snapshot) && layout.Exportable(snapshot)
	if !allowed && gate.browser.promptAllowed {
		gate.browser.promptRevision++
	}
	gate.browser.promptAllowed = allowed

	return allowed
}

func (gate *InputGate) composerDrawn(snapshot contracts.Snapshot) bool {
	_, found := gate.composer.Rows(snapshot)

	return found
}

// isFor is whether the operation was meant for the program the grant was issued for.
func (grant *BrowserGrant) isFor(operation BrowserOperation) bool {
	return grant.Scope.Generation == operation.Generation && grant.Scope.Attachment == operation.Attachment
}
