package launch

import (
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

// terminalTexts are what each program prints when its turn is interrupted.
var terminalTexts = map[string]string{
	"claude old": "\x1b[31m[Request interrupted by user]\x1b[0m",
	"claude":     "  ⎿  Interrupted · What should Claude do instead?",
	"codex":      "■ Conversation interrupted - tell the model what to do differently.",
}

func TestAnInterruptNoticeOfEachProgramIsToldOnceEvenWhenItsWordsComeInTwoWrites(t *testing.T) {
	for name, notice := range terminalTexts {
		t.Run(name, func(t *testing.T) {
			told := 0
			watcher := &InterruptWatcher{OnInterrupt: func() { told++ }}
			_, _ = watcher.Write([]byte("working...\r\n"))
			middle := len(notice) / 2
			_, _ = watcher.Write([]byte(notice[:middle]))
			_, _ = watcher.Write([]byte(notice[middle:] + "\r\n> "))
			_, _ = watcher.Write([]byte("typing more output\r\n"))
			if told != 1 {
				t.Fatalf("the interrupt was told %d times", told)
			}
		})
	}
}

func TestOutputWithNoInterruptNoticeTellsNothing(t *testing.T) {
	watcher := &InterruptWatcher{OnInterrupt: func() { t.Fatal("an interrupt was told") }}
	_, _ = watcher.Write([]byte("Done. The request completed; nothing interrupted it.\r\n"))
}

// keyboardInput feeds the keyboard of an agent's terminal and gives what the program reads of it.
func keyboardInput(t *testing.T, inputs *TerminalInputs, agentID int, typed string) io.Reader {
	t.Helper()
	keyboard, keys := io.Pipe()
	read := inputs.Open(agentID, keyboard)
	go func() { _, _ = io.WriteString(keys, typed) }()
	return read
}

// typedInBackground types a line as the launcher does while the program reads, since the input holds no more than the
// program has read.
func typedInBackground(inputs *TerminalInputs, agentID int, line string) <-chan bool {
	typed := make(chan bool, 1)
	go func() { typed <- inputs.TypeLine(agentID, line) }()
	return typed
}

func readUntil(t *testing.T, read io.Reader, length int) string {
	t.Helper()
	result := make([]byte, 0, length)
	buffer := make([]byte, 64)
	deadline := time.Now().Add(5 * time.Second)
	for len(result) < length && time.Now().Before(deadline) {
		count, err := read.Read(buffer)
		result = append(result, buffer[:count]...)
		if err != nil {
			break
		}
	}
	return string(result)
}

func TestAWakeLineClearsTheUnsentTextWithBackspacesAndTypesItAgainAfterTheLine(t *testing.T) {
	for name := range terminalTexts {
		t.Run(name, func(t *testing.T) {
			inputs := NewTerminalInputs()
			read := keyboardInput(t, inputs, 7, "fix the t")
			readUntil(t, read, len("fix the t"))
			if inputs.Pending(7) != "fix the t" {
				t.Fatalf("the unsent text is %q", inputs.Pending(7))
			}
			typed := typedInBackground(inputs, 7, "you were interrupted")
			want := strings.Repeat("\x7f", len("fix the t")) + "you were interrupted" + "\r" + "fix the t"
			if got := readUntil(t, read, len(want)); got != want {
				t.Fatalf("the program read %q, not %q", got, want)
			}
			if !<-typed {
				t.Fatal("the line was not typed")
			}
			if strings.ContainsAny(want, "\x03\x1b") {
				t.Fatal("the line holds a key that could interrupt the program")
			}
			if inputs.Pending(7) != "fix the t" {
				t.Fatalf("the unsent text was lost: %q", inputs.Pending(7))
			}
		})
	}
}

func TestALineTypedWhereNothingIsUnsentIsTypedAsItWas(t *testing.T) {
	inputs := NewTerminalInputs()
	read := keyboardInput(t, inputs, 7, "")
	typed := typedInBackground(inputs, 7, "go on")
	if got := readUntil(t, read, len("go on\r")); got != "go on\r" {
		t.Fatalf("the program read %q", got)
	}
	if !<-typed {
		t.Fatal("the line was not typed")
	}
}

func TestTextTheLineDroppedByBackspaceOrEnterIsNotRemembered(t *testing.T) {
	inputs := NewTerminalInputs()
	read := keyboardInput(t, inputs, 7, "abc\x7f\x7fd\x1b[A")
	readUntil(t, read, len("abc\x7f\x7fd\x1b[A"))
	if inputs.Pending(7) != "ad" {
		t.Fatalf("the unsent text is %q", inputs.Pending(7))
	}
}

func TestTheLoginCommandEnteredAtTheKeyboardIsToldAsAnInterrupt(t *testing.T) {
	inputs := NewTerminalInputs()
	told := make(chan int, 1)
	inputs.OnLogin(func(agentID int) { told <- agentID })
	read := keyboardInput(t, inputs, 7, "/login\r")
	readUntil(t, read, len("/login\r"))
	select {
	case agentID := <-told:
		if agentID != 7 {
			t.Fatalf("agent %d was told", agentID)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("the login command was not told")
	}
}

func TestQuietSecondsSaysHowLongAgoTheKeyboardWasLastUsed(t *testing.T) {
	inputs := NewTerminalInputs()
	if inputs.QuietSeconds(7) != neverTyped {
		t.Fatal("a terminal nobody typed in has a time")
	}
	read := keyboardInput(t, inputs, 7, "a")
	readUntil(t, read, 1)
	if seconds := inputs.QuietSeconds(7); seconds != 0 {
		t.Fatalf("the keyboard was used %d seconds ago", seconds)
	}
}

type noStarter struct{}

func (noStarter) Start(ProgramStart) error { return nil }

func TestTheSocketSaysHowLongAgoTheKeyboardOfAnOpenTerminalWasUsed(t *testing.T) {
	folder, err := os.MkdirTemp("", "q")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(folder)
	inputs := NewTerminalInputs()
	read := keyboardInput(t, inputs, 7, "a")
	readUntil(t, read, 1)
	path := filepath.Join(folder, "l.sock")
	listener, err := Listen(path, noStarter{}, inputs)
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	answer, err := socketAnswer(path, WorkerRequest{AgentID: 7, Quiet: true})
	if err != nil || strings.TrimSpace(answer) != QuietAnswer+" 0" {
		t.Fatalf("the launcher answered %q, %v", answer, err)
	}
	if answer, _ := socketAnswer(path, WorkerRequest{AgentID: 8, Quiet: true}); strings.TrimSpace(answer) != "" {
		t.Fatalf("the launcher answered %q for an agent it has no terminal of", answer)
	}
}
