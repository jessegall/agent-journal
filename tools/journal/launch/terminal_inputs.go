package launch

import (
	"io"
	"os/exec"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

const (
	backspace    = "\x7f"
	loginCommand = "/login"
	// neverTyped is the seconds since the last keys of a terminal nobody has typed in.
	neverTyped = 1 << 30
)

// keyPause is how long a typed line waits before its Enter, because a program reading a terminal takes a line and its
// Enter sent at once as pasted text.
const keyPause = 80 * time.Millisecond

const (
	stopWait       = 5 * time.Second
	forcedStopWait = 2 * time.Second
	stopPoll       = 50 * time.Millisecond
)

// TerminalInputs keeps the input of each running program by its agent row, so a line typed in the viewer reaches the
// program's pseudo terminal beside what the person types at the keyboard, with when each last came.
type TerminalInputs struct {
	closing  bool
	mutex    sync.Mutex
	writers  map[int]*io.PipeWriter
	keyedAt  map[int]time.Time
	typedAt  map[int]time.Time
	programs map[int]*exec.Cmd
	starting map[int]bool
	pending  map[int]*inputLine
	typing   map[int]*sync.Mutex
	onLogin  func(agentID int)
}

// keyboardReader notes when keys come from the keyboard, and which.
type keyboardReader struct {
	source io.Reader
	onRead func(keys []byte)
}

func (reader keyboardReader) Read(buffer []byte) (int, error) {
	count, err := reader.source.Read(buffer)
	if count > 0 {
		reader.onRead(buffer[:count])
	}
	return count, err
}

// NewTerminalInputs makes the inputs of no program yet.
func NewTerminalInputs() *TerminalInputs {
	return &TerminalInputs{writers: map[int]*io.PipeWriter{}, keyedAt: map[int]time.Time{}, typedAt: map[int]time.Time{}, programs: map[int]*exec.Cmd{}, starting: map[int]bool{}, pending: map[int]*inputLine{}, typing: map[int]*sync.Mutex{}}
}

// Open keeps an input for the agent, fed by the source as well, and returns what the program's terminal reads.
func (inputs *TerminalInputs) Open(agentID int, source io.Reader) io.Reader {
	reader, writer := io.Pipe()
	inputs.mutex.Lock()
	inputs.writers[agentID] = writer
	inputs.mutex.Unlock()
	go func() { _, _ = io.Copy(writer, keyboardReader{source, func(keys []byte) { inputs.noteKeys(agentID, keys) }}) }()
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

// HasPrograms includes programs still starting or keeping a terminal open.
func (inputs *TerminalInputs) HasPrograms() bool {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	return len(inputs.starting)+len(inputs.writers)+len(inputs.programs) > 0
}

// ProgramPid is the process number of the agent's running program, and 0 when it has none.
func (inputs *TerminalInputs) ProgramPid(agentID int) int {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	program, ok := inputs.programs[agentID]
	if !ok || program.Process == nil {
		return 0
	}
	return program.Process.Pid
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

// StopProgram asks the agent's program and the children in its process group to end, waits for them, then forces
// them, and says whether it had a program.
func (inputs *TerminalInputs) StopProgram(agentID int) bool {
	inputs.mutex.Lock()
	program, ok := inputs.programs[agentID]
	inputs.mutex.Unlock()
	if !ok || program.Process == nil {
		return false
	}
	signalGroup(program.Process.Pid, false)
	if inputs.waitForExit(agentID, stopWait) {
		return true
	}
	signalGroup(program.Process.Pid, true)
	inputs.waitForExit(agentID, forcedStopWait)
	return true
}

// StopAll stops every program this launch started, as the launch ends, and says so to each one's exit.
func (inputs *TerminalInputs) StopAll() {
	inputs.mutex.Lock()
	inputs.closing = true
	running := make([]int, 0, len(inputs.programs))
	for agentID := range inputs.programs {
		running = append(running, agentID)
	}
	inputs.mutex.Unlock()
	for _, agentID := range running {
		inputs.StopProgram(agentID)
	}
}

// IsClosing says the launch that owns these programs is ending.
func (inputs *TerminalInputs) IsClosing() bool {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	return inputs.closing
}

func (inputs *TerminalInputs) waitForExit(agentID int, limit time.Duration) bool {
	deadline := time.Now().Add(limit)
	for time.Now().Before(deadline) {
		inputs.mutex.Lock()
		_, running := inputs.programs[agentID]
		inputs.mutex.Unlock()
		if !running {
			return true
		}
		time.Sleep(stopPoll)
	}
	return false
}

// TypeLine types the line and its Enter into the agent's terminal, and says whether the agent has one. Text the person
// typed there and has not entered is cleared with one backspace for each character, never a key that could interrupt the
// program, and typed again after the line, so the person goes on typing where they were. Lines for one agent go in one at
// a time, with a pause after each Enter, so two that come together are entered as two.
func (inputs *TerminalInputs) TypeLine(agentID int, line string) bool {
	inputs.mutex.Lock()
	writer, ok := inputs.writers[agentID]
	turn := inputs.typingTurn(agentID)
	inputs.mutex.Unlock()
	if !ok {
		return false
	}
	turn.Lock()
	defer turn.Unlock()
	defer time.Sleep(keyPause)
	remembered := inputs.Pending(agentID)
	inputs.mutex.Lock()
	inputs.typedAt[agentID] = time.Now()
	inputs.mutex.Unlock()
	if remembered != "" {
		if _, err := io.WriteString(writer, strings.Repeat(backspace, utf8.RuneCountInString(remembered))); err != nil {
			return false
		}
	}
	if _, err := io.WriteString(writer, line); err != nil {
		return false
	}
	time.Sleep(keyPause)
	if _, err := io.WriteString(writer, "\r"); err != nil {
		return false
	}
	if remembered == "" {
		return true
	}
	_, err := io.WriteString(writer, remembered)
	return err == nil
}

// typingTurn is the agent's lock on its terminal for one typed line; the caller holds inputs.mutex.
func (inputs *TerminalInputs) typingTurn(agentID int) *sync.Mutex {
	turn := inputs.typing[agentID]
	if turn == nil {
		turn = &sync.Mutex{}
		inputs.typing[agentID] = turn
	}
	return turn
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

func (inputs *TerminalInputs) noteKeys(agentID int, keys []byte) {
	inputs.mutex.Lock()
	inputs.keyedAt[agentID] = time.Now()
	line := inputs.pending[agentID]
	if line == nil {
		line = &inputLine{}
		inputs.pending[agentID] = line
	}
	submitted := line.keys(keys)
	onLogin := inputs.onLogin
	inputs.mutex.Unlock()
	if onLogin != nil && strings.TrimSpace(submitted) == loginCommand {
		onLogin(agentID)
	}
}

// OnLogin sets what is done when a person enters the login command at the keyboard of an agent's terminal, which ends
// the program's turn as an interrupt does.
func (inputs *TerminalInputs) OnLogin(tell func(agentID int)) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	inputs.onLogin = tell
}

// Pending is the text the person typed at the keyboard of the agent's terminal and has not entered.
func (inputs *TerminalInputs) Pending(agentID int) string {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	if line := inputs.pending[agentID]; line != nil {
		return string(line.text)
	}
	return ""
}

// QuietSeconds is how many seconds ago the person last typed at the keyboard of the agent's terminal, or neverTyped.
func (inputs *TerminalInputs) QuietSeconds(agentID int) int {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	keyed, ok := inputs.keyedAt[agentID]
	if !ok {
		return neverTyped
	}
	return int(time.Since(keyed).Seconds())
}
