package launch

import (
	"io"
	"strings"
	"sync"
	"time"
)

// keyPause is how long a typed line waits before its Enter, because a program reading a terminal takes a line and its
// Enter sent at once as pasted text.
const keyPause = 80 * time.Millisecond

// TerminalInputs keeps the input of each running program by its agent row, so a line typed in the viewer reaches the
// program's pseudo terminal beside what the person types at the keyboard, with when each last came.
type TerminalInputs struct {
	mutex   sync.Mutex
	writers map[int]*io.PipeWriter
	keyedAt map[int]time.Time
	typedAt map[int]time.Time
}

// keyboardReader notes when keys come from the keyboard.
type keyboardReader struct {
	source io.Reader
	noted  func()
}

func (reader keyboardReader) Read(buffer []byte) (int, error) {
	count, err := reader.source.Read(buffer)
	if count > 0 {
		reader.noted()
	}
	return count, err
}

// NewTerminalInputs makes the inputs of no program yet.
func NewTerminalInputs() *TerminalInputs {
	return &TerminalInputs{writers: map[int]*io.PipeWriter{}, keyedAt: map[int]time.Time{}, typedAt: map[int]time.Time{}}
}

// Open keeps an input for the agent, fed by the source as well, and returns what the program's terminal reads.
func (inputs *TerminalInputs) Open(agentID int, source io.Reader) io.Reader {
	reader, writer := io.Pipe()
	inputs.mutex.Lock()
	inputs.writers[agentID] = writer
	inputs.mutex.Unlock()
	go func() { _, _ = io.Copy(writer, keyboardReader{source, func() { inputs.noteKeys(agentID) }}) }()
	return reader
}

// IsOpen says whether a program of the agent runs.
func (inputs *TerminalInputs) IsOpen(agentID int) bool {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	_, ok := inputs.writers[agentID]
	return ok
}

// Close ends the agent's input once its program has ended.
func (inputs *TerminalInputs) Close(agentID int) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	if writer, ok := inputs.writers[agentID]; ok {
		_ = writer.Close()
		delete(inputs.writers, agentID)
	}
}

// TypeLine types the line and its Enter into the agent's terminal, and says whether the agent has one.
func (inputs *TerminalInputs) TypeLine(agentID int, line string) bool {
	inputs.mutex.Lock()
	writer, ok := inputs.writers[agentID]
	inputs.mutex.Unlock()
	if !ok {
		return false
	}
	inputs.mutex.Lock()
	inputs.typedAt[agentID] = time.Now()
	inputs.mutex.Unlock()
	if _, err := io.WriteString(writer, line); err != nil {
		return false
	}
	time.Sleep(keyPause)
	_, err := io.WriteString(writer, "\r")
	return err == nil
}

// PressKeys presses keys in the agent's terminal, with the same pause before an Enter as a typed line. They count neither
// as keys at the keyboard nor as a typed line.
func (inputs *TerminalInputs) PressKeys(agentID int, keys string) bool {
	inputs.mutex.Lock()
	writer, ok := inputs.writers[agentID]
	inputs.mutex.Unlock()
	if !ok {
		return false
	}
	before, entered := strings.CutSuffix(keys, "\r")
	if before != "" {
		if _, err := io.WriteString(writer, before); err != nil {
			return false
		}
	}
	if !entered {
		return true
	}
	if before != "" {
		time.Sleep(keyPause)
	}
	_, err := io.WriteString(writer, "\r")
	return err == nil
}

// KeyedAt is when the agent's terminal last had keys from the keyboard.
func (inputs *TerminalInputs) KeyedAt(agentID int) time.Time {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	return inputs.keyedAt[agentID]
}

// TypedAt is when the journal last typed a line into the agent's terminal.
func (inputs *TerminalInputs) TypedAt(agentID int) time.Time {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	return inputs.typedAt[agentID]
}

func (inputs *TerminalInputs) noteKeys(agentID int) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	inputs.keyedAt[agentID] = time.Now()
}
