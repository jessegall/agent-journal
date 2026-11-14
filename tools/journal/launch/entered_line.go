package launch

import (
	"io"
	"time"
)

const (
	// echoQuiet is how long the screen must be still after it showed a typed line, before the line's Enter is pressed.
	echoQuiet = 150 * time.Millisecond
	// echoWait is the longest a typed line waits for the screen to show it.
	echoWait = 2 * time.Second
	echoPoll = 20 * time.Millisecond
)

// EnteredLine is the last line the journal entered in an agent's terminal: when its latest Enter was pressed, and how
// many Enters were pressed after the first because the line was still in the input box.
type EnteredLine struct {
	EnteredAt  time.Time
	MoreEnters int
}

// NoteOutput notes that the agent's program wrote to its screen.
func (inputs *TerminalInputs) NoteOutput(agentID int) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	inputs.outputAt[agentID] = time.Now()
}

// waitForEcho waits until the program has shown the line written at writtenAt and its screen is still. A program that
// is busy reads a line and an Enter that follows it at once as one pasted text, and keeps the Enter as a new line in
// its input box; the screen showing the line proves the program has read it, so the Enter after it is a key of its own.
// A terminal whose screen nobody reads waits the key pause alone.
func (inputs *TerminalInputs) waitForEcho(agentID int, writtenAt time.Time) {
	time.Sleep(keyPause)
	inputs.mutex.Lock()
	_, isScreenRead := inputs.outputAt[agentID]
	inputs.mutex.Unlock()
	if !isScreenRead {
		return
	}
	for deadline := writtenAt.Add(echoWait); time.Now().Before(deadline); time.Sleep(echoPoll) {
		inputs.mutex.Lock()
		outputAt := inputs.outputAt[agentID]
		inputs.mutex.Unlock()
		if outputAt.After(writtenAt) && time.Since(outputAt) >= echoQuiet {
			return
		}
	}
}

func (inputs *TerminalInputs) noteEntered(agentID int, moreEnters int) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	inputs.entered[agentID] = EnteredLine{time.Now(), moreEnters}
}

// EnteredLine is the line the journal last entered in the agent's terminal, while nobody has found it sent.
func (inputs *TerminalInputs) EnteredLine(agentID int) (EnteredLine, bool) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	line, ok := inputs.entered[agentID]
	return line, ok
}

// ForgetEnteredLine ends the watch on the line the journal last entered.
func (inputs *TerminalInputs) ForgetEnteredLine(agentID int) {
	inputs.mutex.Lock()
	defer inputs.mutex.Unlock()
	delete(inputs.entered, agentID)
}

// EnterAgain presses Enter once more for the line the journal last entered, and says whether it was pressed.
func (inputs *TerminalInputs) EnterAgain(agentID int) bool {
	inputs.mutex.Lock()
	writer, ok := inputs.writers[agentID]
	line, isEntered := inputs.entered[agentID]
	turn := inputs.typingTurn(agentID)
	inputs.mutex.Unlock()
	if !ok || !isEntered {
		return false
	}
	turn.Lock()
	defer turn.Unlock()
	if _, err := io.WriteString(writer, "\r"); err != nil {
		return false
	}
	inputs.noteEntered(agentID, line.MoreEnters+1)
	return true
}
