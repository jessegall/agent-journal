package terminal

import (
	"bytes"
	"errors"
	"strings"
	"sync"
	"testing"
	"time"

	"journal-agent/screen"
)

// lockedBuffer is a program the gate writes to while the test reads what it got.
type lockedBuffer struct {
	mutex   sync.Mutex
	written bytes.Buffer
}

func (buffer *lockedBuffer) Write(bytes []byte) (int, error) {
	buffer.mutex.Lock()
	defer buffer.mutex.Unlock()

	return buffer.written.Write(bytes)
}

func (buffer *lockedBuffer) String() string {
	buffer.mutex.Lock()
	defer buffer.mutex.Unlock()

	return buffer.written.String()
}

const clearLine = "\x15"

// strandedGate is a gate whose driver line is typed and echoed but not yet submitted, with short settle waits.
func strandedGate(t *testing.T, text string) (*InputGate, *screen.EmulatorReader, *lockedBuffer, *TypedLine) {
	t.Helper()
	previous := takeSettleWait
	takeSettleWait = 300 * time.Millisecond
	t.Cleanup(func() { takeSettleWait = previous })

	reader, layout := readyClaudeCode(t)
	program := &lockedBuffer{}
	gate := NewInputGate(program, reader, layout.Composer, time.Now)
	line, err := gate.Type("request-1", 1, text, reader.Generation("composer"))
	if err != nil {
		t.Fatal(err)
	}

	return gate, reader, program, line
}

// eraseOnClear blanks the echoed text on the screen once the clear keys reach the program, as the program would.
func eraseOnClear(reader *screen.EmulatorReader, program *lockedBuffer, length int) {
	go func() {
		deadline := time.Now().Add(time.Second)
		for time.Now().Before(deadline) {
			if strings.Contains(program.String(), clearLine) {
				back := strings.Repeat("\b", length)
				reader.Feed([]byte(back + strings.Repeat(" ", length) + back))

				return
			}
			time.Sleep(5 * time.Millisecond)
		}
	}()
}

func TestATakeDuringAPendingTypedLineClearsItWithoutEnterAndCancelsTheRequest(t *testing.T) {
	gate, reader, program, line := strandedGate(t, "run the tests")
	reader.Feed([]byte("run the tests"))
	eraseOnClear(reader, program, len("run the tests"))

	grant, err := gate.TakeAfterSettling("take-1", scope, clearLine)

	if err != nil || grant.ID == "" {
		t.Fatalf("the take did not settle the line: %v", err)
	}
	if strings.Contains(program.String(), enterKey) {
		t.Fatalf("the take sent Enter: %q", program.String())
	}
	if _, err := gate.Submit(line, 0); !errors.Is(err, ErrLineStranded) {
		t.Fatalf("the stranded line could still be submitted: %v", err)
	}
	if !gate.AwaitSettlement(line, time.Second) {
		t.Fatal("the line was not reported cancelled before submit")
	}
	if gate.Owner() != BrowserInput {
		t.Fatalf("after the take the input is %s", gate.Owner())
	}
}

func TestATakeOverAPartlyWrittenLineIsUncertainAndKeepsTheHold(t *testing.T) {
	gate, reader, program, line := strandedGate(t, "run the tests")
	reader.Feed([]byte("run the"))

	_, err := gate.TakeAfterSettling("take-1", scope, clearLine)

	if !errors.Is(err, ErrTakeUncertain) {
		t.Fatalf("a partly written line was settled: %v", err)
	}
	if strings.Contains(program.String(), clearLine) || strings.Contains(program.String(), enterKey) {
		t.Fatalf("the take wrote to the program: %q", program.String())
	}
	if gate.AwaitSettlement(line, time.Second) {
		t.Fatal("an unsettled line was reported cancelled")
	}
	if gate.Owner() != DriverInput || gate.GrantState().GrantID != "" {
		t.Fatalf("the uncertain take gave up the hold: %s", gate.Owner())
	}
}
