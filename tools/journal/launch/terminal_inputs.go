package launch

import (
	"io"
	"os/exec"
	"strings"
	"sync"
	"syscall"
	"time"
)

// keyPause is how long a typed line waits before its Enter, because a program reading a terminal takes a line and its
// Enter sent at once as pasted text.
const keyPause = 80 * time.Millisecond

// TerminalInputs keeps the input of each running program by its agent row, so a line typed in the viewer reaches the
// program's pseudo terminal beside what the person types at the keyboard, with when each last came.
type TerminalInputs struct {
	mutex    sync.Mutex
	writers  map[int]*io.PipeWriter
	keyedAt  map[int]time.Time
	typedAt  map[int]time.Time
	programs map[int]*exec.Cmd
	starting map[int]bool
}

// keyboardReader notes when keys come from the keyboard.
type keyboardReader struct {
	source io.Reader
	onRead func()
}

func (reader keyboardReader) Read(buffer []byte) (int, error) {
	count, err := reader.source.Read(buffer)
	if count > 0 {
		reader.onRead()
	}
	return count, err
}

// NewTerminalInputs makes the inputs of no program yet.
func NewTerminalInputs() *TerminalInputs {
	return &TerminalInputs{writers: map[int]*io.PipeWriter{}, keyedAt: map[int]time.Time{}, typedAt: map[int]time.Time{}, programs: map[int]*exec.Cmd{}, starting: map[int]bool{}}
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

// Reserve admits one startup for an agent until Close releases it.
func (inputs *TerminalInputs) Reserve(agentID int) bool {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	if inputs.starting[agentID] || inputs.writers[agentID] != nil || inputs.programs[agentID] != nil {
		return false
	}
	inputs.starting[agentID] = true
	return true
}

// IsOpen says whether a program of the agent is starting or running.
func (inputs *TerminalInputs) IsOpen(agentID int) bool {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	return inputs.starting[agentID] || inputs.writers[agentID] != nil || inputs.programs[agentID] != nil
}

// Close ends the agent's input once its program has ended.
func (inputs *TerminalInputs) Close(agentID int) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	if writer, ok := inputs.writers[agentID]; ok {
		_ = writer.Close()
		delete(inputs.writers, agentID)
	}
	delete(inputs.programs, agentID)
	delete(inputs.starting, agentID)
}

// Track keeps the agent's running program, so a request can stop it.
func (inputs *TerminalInputs) Track(agentID int, program *exec.Cmd) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	inputs.programs[agentID] = program
	delete(inputs.starting, agentID)
}

// StopProgram ends the agent's running program and says whether it had one.
func (inputs *TerminalInputs) StopProgram(agentID int) bool {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	program, ok := inputs.programs[agentID]
	if !ok || program.Process == nil {
		return false
	}
	return program.Process.Signal(syscall.SIGTERM) == nil
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
	prefix, entered := strings.CutSuffix(keys, "\r")
	if prefix != "" {
		if _, err := io.WriteString(writer, prefix); err != nil {
			return false
		}
	}
	if !entered {
		return true
	}
	if prefix != "" {
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
