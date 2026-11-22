// Package recording holds the evidence fixtures of agent driver sessions: what a program printed, what was typed
// and when, and the slots later phases fill with the screen, key and state they expect.
package recording

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// FileName is the name of the fixture file inside a recording folder.
const FileName = "fixture.json"

// Mode is how the program was run: as one child per turn with pipes, or in one persistent terminal.
type Mode string

const (
	ProcessMode  Mode = "process"
	TerminalMode Mode = "terminal"
)

// Geometry is the size of the terminal in character cells.
type Geometry struct {
	Columns uint16 `json:"columns"`
	Rows    uint16 `json:"rows"`
}

// OutputChunk is a run of raw bytes the program wrote, at its offset from the start of the recording.
type OutputChunk struct {
	Offset time.Duration `json:"offset"`
	Stream string        `json:"stream"`
	Bytes  []byte        `json:"bytes"`
}

// InputEvent is what the user typed. Secret input is never written: only its length and that it was secret.
type InputEvent struct {
	Offset time.Duration `json:"offset"`
	Bytes  []byte        `json:"bytes,omitempty"`
	Secret bool          `json:"secret"`
	Length int           `json:"length"`
}

// ResizeEvent is a change of the terminal size during the recording.
type ResizeEvent struct {
	Offset   time.Duration `json:"offset"`
	Geometry Geometry      `json:"geometry"`
}

// InitialState is what the program started with, redacted: the names of the environment variables but no values.
type InitialState struct {
	WorkingFolder    string   `json:"working_folder"`
	Arguments        []string `json:"arguments"`
	EnvironmentNames []string `json:"environment_names"`
}

// ScreenCheckpoint is the screen a later phase expects at an offset: one string per row and the cursor.
type ScreenCheckpoint struct {
	Offset       time.Duration `json:"offset"`
	Rows         []string      `json:"rows"`
	CursorRow    int           `json:"cursor_row"`
	CursorColumn int           `json:"cursor_column"`
}

// ScriptParameter is one named value a KeyScript replay is given.
type ScriptParameter struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// ExpectedKeys are the keys a KeyScript is expected to send at an offset.
type ExpectedKeys struct {
	Offset time.Duration `json:"offset"`
	Bytes  []byte        `json:"bytes"`
}

// ExpectedTransition is a driver state, and the receipt it records, expected at an offset.
type ExpectedTransition struct {
	Offset  time.Duration `json:"offset"`
	State   string        `json:"state"`
	Receipt string        `json:"receipt"`
}

// Fixture is one recorded session of an agent driver.
type Fixture struct {
	Driver              string               `json:"driver"`
	DriverVersion       string               `json:"driver_version"`
	Profile             string               `json:"profile"`
	Mode                Mode                 `json:"mode"`
	Geometry            Geometry             `json:"geometry"`
	RecordedAt          time.Time            `json:"recorded_at"`
	InitialState        InitialState         `json:"initial_state"`
	Output              []OutputChunk        `json:"output"`
	Inputs              []InputEvent         `json:"inputs"`
	Resizes             []ResizeEvent        `json:"resizes"`
	ExitCode            int                  `json:"exit_code"`
	Checkpoints         []ScreenCheckpoint   `json:"checkpoints"`
	ScriptParameters    []ScriptParameter    `json:"script_parameters"`
	ExpectedKeys        []ExpectedKeys       `json:"expected_keys"`
	ExpectedTransitions []ExpectedTransition `json:"expected_transitions"`
	// Cut says why the recording ended before it was stopped, such as reaching its size bound; empty when it was not.
	Cut string `json:"cut,omitempty"`
}

// Save writes the fixture into the folder, creating it.
func (fixture Fixture) Save(folder string) error {
	if err := os.MkdirAll(folder, 0o755); err != nil {
		return fmt.Errorf("making the recording folder %s: %w", folder, err)
	}

	encoded, err := json.MarshalIndent(fixture, "", "  ")
	if err != nil {
		return fmt.Errorf("encoding the fixture: %w", err)
	}

	return os.WriteFile(filepath.Join(folder, FileName), encoded, 0o644)
}

// Load reads the fixture of a recording folder.
func Load(folder string) (Fixture, error) {
	var fixture Fixture

	encoded, err := os.ReadFile(filepath.Join(folder, FileName))
	if err != nil {
		return fixture, fmt.Errorf("reading the fixture of %s: %w", folder, err)
	}

	if err := json.Unmarshal(encoded, &fixture); err != nil {
		return fixture, fmt.Errorf("decoding the fixture of %s: %w", folder, err)
	}

	return fixture, nil
}
