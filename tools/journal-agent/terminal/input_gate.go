package terminal

import (
	"io"
	"strings"
	"sync"
	"time"

	"journal-agent/screen/contracts"
)

// enterKey submits the composer's line.
const enterKey = "\r"

// InputGate is the one way into a program's terminal: the user's keys, the journal's typed lines, its Enter and
// any explicit draft choice all go through it, so a write lands only on the composer state it was meant for.
type InputGate struct {
	mutex      sync.Mutex
	program    io.Writer
	reader     contracts.ScreenReader
	composer   contracts.Region
	now        func() time.Time
	owner      Owner
	draftSince time.Time
	pending    *TypedLine
	// userInputs counts every input of the user's, so a check before an action sees whether the user typed
	// since it last looked, even when their Enter already gave the composer back.
	userInputs uint64
	browser    browserGrants
}

// NewInputGate guards writes to the program, reading its composer from the reader; now is the clock of draft ages.
func NewInputGate(
	program io.Writer,
	reader contracts.ScreenReader,
	composer contracts.Region,
	now func() time.Time,
) *InputGate {
	return &InputGate{program: program, reader: reader, composer: composer, now: now, owner: NobodyOwns}
}

// UserTyped forwards the local user's keys at once. A browser writer's grant is retired before the keys are written,
// any driver line still pending is invalidated, never submitted, and the composer is the user's from their first key
// until they submit with Enter.
func (gate *InputGate) UserTyped(keys []byte) error {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.preemptForLocal()
	gate.userInputs++
	gate.invalidatePending()
	if strings.HasSuffix(string(keys), enterKey) {
		gate.owner, gate.draftSince = NobodyOwns, time.Time{}
	} else if gate.owner != UserInput {
		gate.owner, gate.draftSince = UserInput, gate.now()
	}

	_, err := gate.program.Write(keys)

	return err
}

// UserInputs is how many inputs the user has sent through the gate; it only grows.
func (gate *InputGate) UserInputs() uint64 {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	return gate.userInputs
}

// Type writes a driver line into an empty composer whose generation is still the one the caller read; anything else,
// a browser writer's grant included, refuses it with ErrComposerHeld. It never presses Enter: Submit does, once the
// echo is seen.
func (gate *InputGate) Type(requestID string, attempt int, text string, readGeneration uint64) (*TypedLine, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.expireGrant()
	if gate.owner != NobodyOwns || gate.reader.Generation(gate.composer.Name()) != readGeneration {
		return nil, ErrComposerHeld
	}
	if _, err := io.WriteString(gate.program, text); err != nil {
		return nil, err
	}

	gate.pending = &TypedLine{RequestID: requestID, Attempt: attempt, Text: text, settled: make(chan struct{})}
	gate.owner = DriverInput

	return gate.pending, nil
}

// Submit presses Enter once for a typed line whose echo is in the composer. A line the user typed over is refused;
// a line with no echo is DeliveryUncertain, and so is a second Enter beyond the profile's retry bound.
func (gate *InputGate) Submit(line *TypedLine, enterRetries int) (Delivery, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if line.stranded {
		return DeliveryUncertain, ErrLineStranded
	}
	if line.invalidated {
		return DeliveryUncertain, ErrLineInvalidated
	}
	if !gate.mayEnter(line, enterRetries) {
		return DeliveryUncertain, nil
	}
	if _, err := io.WriteString(gate.program, enterKey); err != nil {
		return DeliveryUncertain, err
	}

	line.enters++
	if line.enters == 1 {
		gate.pending, gate.owner = nil, NobodyOwns

		return Delivered, nil
	}

	return DeliveryUncertain, nil
}

// mayEnter is whether the line may be entered now: it is the pending one, the program shows its text, and it has
// not used up its retries.
func (gate *InputGate) mayEnter(line *TypedLine, enterRetries int) bool {
	return gate.pending == line && gate.echoes(line.Text) && line.enters <= enterRetries
}

// Keys sends a driver's keys, such as a menu move or a key script's step, unless someone else holds the input: a
// user's key since the last driver write pauses the driver until a user's Enter or explicit choice hands the input
// back, and a browser writer's grant holds it until the grant ends.
func (gate *InputGate) Keys(keys string) error {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.expireGrant()
	if gate.owner == BrowserInput {
		return ErrComposerHeld
	}
	if gate.owner == UserInput {
		return ErrUserTyping
	}
	_, err := io.WriteString(gate.program, keys)

	return err
}

// Owner is who holds the input now.
func (gate *InputGate) Owner() Owner {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.expireGrant()

	return gate.owner
}

// Draft is the user's unsent text and since when it waits; found is false while the composer is not theirs.
func (gate *InputGate) Draft() (draft Draft, found bool) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if gate.owner != UserInput {
		return Draft{}, false
	}

	return Draft{Text: gate.composerText(), Since: gate.draftSince}, true
}

// Choose carries out the user's explicit choice for their draft; clearKeys is the profile's key that empties the
// composer line. It returns the saved text for SaveAndClearDraft. The gate never makes this choice itself.
func (gate *InputGate) Choose(choice DraftChoice, clearKeys string) (string, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	gate.expireGrant()
	if gate.owner == BrowserInput {
		return "", ErrComposerHeld
	}

	switch choice {
	case SendDraft:
		gate.owner, gate.draftSince = NobodyOwns, time.Time{}
		_, err := io.WriteString(gate.program, enterKey)

		return "", err
	case SaveAndClearDraft:
		saved := gate.composerText()
		gate.owner, gate.draftSince = NobodyOwns, time.Time{}
		_, err := io.WriteString(gate.program, clearKeys)

		return saved, err
	default:
		gate.invalidatePending()

		return "", nil
	}
}

// Echoes is whether the composer shows the text, as the program draws it, spaces made plain.
func (gate *InputGate) Echoes(text string) bool {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	return gate.echoes(text)
}

// echoes is whether the composer shows the text: every typed character at its place after the marker. A program may
// draw a typed space by moving the cursor, leaving an earlier placeholder's letter in that cell, so spaces are not
// compared.
func (gate *InputGate) echoes(text string) bool {
	drawn := []rune(gate.composerText())
	typed := []rune(strings.TrimSpace(text))

	for start := 0; start+len(typed) <= len(drawn); start++ {
		if matchesIgnoringSpaces(drawn[start:start+len(typed)], typed) {
			return true
		}
	}

	return false
}

// matchesIgnoringSpaces is whether every typed character that is not a space is drawn in the same place.
func matchesIgnoringSpaces(drawn, typed []rune) bool {
	for index, character := range typed {
		if character != ' ' && drawn[index] != character {
			return false
		}
	}

	return true
}

// composerText is the text in the composer after its marker, or nothing while the composer is not drawn.
func (gate *InputGate) composerText() string {
	snapshot := gate.reader.Snapshot()
	rows, found := gate.composer.Rows(snapshot)
	if !found {
		return ""
	}

	lines := make([]string, 0, rows.Last-rows.First)
	for row := rows.First; row < rows.Last; row++ {
		lines = append(lines, strings.ReplaceAll(snapshot.Rows[row], " ", " "))
	}

	return strings.TrimSpace(strings.Join(lines, " "))
}
