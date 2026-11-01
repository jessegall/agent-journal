package launch

import (
	"io"
	"sync"
	"time"
)

// keyPause is how long a typed line waits before its Enter, because a program reading a terminal takes a line and its
// Enter sent at once as pasted text.
const keyPause = 80 * time.Millisecond

// TerminalInputs keeps the input of each running program by its agent row, so a line typed in the viewer reaches the
// program's pseudo terminal beside what the person types at the keyboard.
type TerminalInputs struct {
	mutex   sync.Mutex
	writers map[int]*io.PipeWriter
}

// NewTerminalInputs makes the inputs of no program yet.
func NewTerminalInputs() *TerminalInputs {
	return &TerminalInputs{writers: map[int]*io.PipeWriter{}}
}

// Open keeps an input for the agent, fed by the source as well, and returns what the program's terminal reads.
func (inputs *TerminalInputs) Open(agentID int, source io.Reader) io.Reader {
	reader, writer := io.Pipe()
	inputs.mutex.Lock()
	inputs.writers[agentID] = writer
	inputs.mutex.Unlock()
	go func() { _, _ = io.Copy(writer, source) }()
	return reader
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
	if _, err := io.WriteString(writer, line); err != nil {
		return false
	}
	time.Sleep(keyPause)
	_, err := io.WriteString(writer, "\r")
	return err == nil
}
