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

// InputGate is the one way into a program's terminal: the person's keys, the journal's typed lines, its Enter and
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

// Human forwards the person's keys at once. Any driver line still pending is invalidated, never submitted, and the
// composer is the person's from their first key until they submit with Enter.
func (gate *InputGate) Human(keys []byte) error {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if gate.pending != nil {
		gate.pending.invalidated = true
		gate.pending = nil
	}
	if strings.HasSuffix(string(keys), enterKey) {
		gate.owner, gate.draftSince = NobodyOwns, time.Time{}
	} else if gate.owner != HumanInput {
		gate.owner, gate.draftSince = HumanInput, gate.now()
	}

	_, err := gate.program.Write(keys)

	return err
}

// Type writes a driver line into an empty composer whose generation is still the one the caller read; anything else
// refuses it with ErrComposerHeld. It never presses Enter: Submit does, once the echo is seen.
func (gate *InputGate) Type(requestID string, attempt int, text string, readGeneration uint64) (*TypedLine, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if gate.owner != NobodyOwns || gate.reader.Generation(gate.composer.Name()) != readGeneration {
		return nil, ErrComposerHeld
	}
	if _, err := io.WriteString(gate.program, text); err != nil {
		return nil, err
	}

	gate.pending = &TypedLine{RequestID: requestID, Attempt: attempt, Text: text}
	gate.owner = DriverInput

	return gate.pending, nil
}

// Submit presses Enter once for a typed line whose echo is in the composer. A line the person typed over is refused;
// a line with no echo is DeliveryUncertain, and so is a second Enter beyond the profile's retry bound.
func (gate *InputGate) Submit(line *TypedLine, enterRetries int) (Delivery, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if line.invalidated {
		return DeliveryUncertain, ErrLineInvalidated
	}
	if gate.pending != line || !gate.echoes(line.Text) || line.enters > enterRetries {
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

// Keys sends a driver's keys, such as a menu move, unless the person holds the input: a person's key since the
// last driver write pauses the driver until a person's Enter or explicit choice hands the input back.
func (gate *InputGate) Keys(keys string) error {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if gate.owner == HumanInput {
		return ErrPersonTyping
	}
	_, err := io.WriteString(gate.program, keys)

	return err
}

// Owner is who holds the input now.
func (gate *InputGate) Owner() Owner {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	return gate.owner
}

// Draft is the person's unsent text and since when it waits; found is false while the composer is not theirs.
func (gate *InputGate) Draft() (draft Draft, found bool) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

	if gate.owner != HumanInput {
		return Draft{}, false
	}

	return Draft{Text: gate.composerText(), Since: gate.draftSince}, true
}

// Choose carries out the person's explicit choice for their draft; clearKeys is the profile's key that empties the
// composer line. It returns the saved text for SaveAndClearDraft. The gate never makes this choice itself.
func (gate *InputGate) Choose(choice DraftChoice, clearKeys string) (string, error) {
	gate.mutex.Lock()
	defer gate.mutex.Unlock()

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
		if gate.pending != nil {
			gate.pending.invalidated = true
			gate.pending = nil
		}

		return "", nil
	}
}

// echoes is whether the composer shows the text, as the program draws it, spaces made plain.
func (gate *InputGate) echoes(text string) bool {
	return strings.Contains(gate.composerText(), strings.TrimSpace(text))
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
