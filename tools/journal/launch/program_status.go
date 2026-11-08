package launch

import (
	"bytes"
	"encoding/json"
	"math"
	"os"
	"path/filepath"
	"regexp"
)

// assumedContextWindowTokens is the size of a model's context window until the program's first result names it.
const assumedContextWindowTokens = 1_000_000

var sessionFileName = regexp.MustCompile(`^[A-Za-z0-9_.-]+$`)

// statusReport is the part of a status file the journal reads for a card, in the shape Claude Code's status line
// hands over.
type statusReport struct {
	SessionID string         `json:"session_id"`
	Context   *statusContext `json:"context_window,omitempty"`
	Cost      *statusCost    `json:"cost,omitempty"`
}

type statusContext struct {
	UsedPercentage   int `json:"used_percentage"`
	TotalInputTokens int `json:"total_input_tokens,omitempty"`
}

type statusCost struct {
	TotalCostUSD float64 `json:"total_cost_usd"`
}

// programEvent is one line of Claude Code's stream-json output: an assistant line of the agent itself carries the
// context in use, a result line what the session cost so far and each model's context window.
type programEvent struct {
	Type         string   `json:"type"`
	SessionID    string   `json:"session_id"`
	ParentToolID *string  `json:"parent_tool_use_id"`
	TotalCostUSD *float64 `json:"total_cost_usd"`
	ModelUsage   map[string]struct {
		ContextWindow int `json:"contextWindow"`
	} `json:"modelUsage"`
	Message struct {
		Model string `json:"model"`
		Usage struct {
			InputTokens         int `json:"input_tokens"`
			CacheReadTokens     int `json:"cache_read_input_tokens"`
			CacheCreationTokens int `json:"cache_creation_input_tokens"`
		} `json:"usage"`
	} `json:"message"`
}

// ProgramStatus keeps the status file of a program that runs without a status line, as a worker's does, from the
// stream-json lines of its output, so its card shows its context and cost; the cost of a resumed session starts from
// what its last file said. Any other output is left alone.
type ProgramStatus struct {
	folder       string
	pending      []byte
	report       statusReport
	model        string
	tokens       int
	windowTokens int
	hasReport    bool
}

// NewProgramStatus keeps status files in the status folder under the journal's folder.
func NewProgramStatus(home string) *ProgramStatus {
	return &ProgramStatus{folder: filepath.Join(home, "runtime", "status"), windowTokens: assumedContextWindowTokens}
}

// Write takes the program's output as it comes and reads each finished line.
func (status *ProgramStatus) Write(output []byte) (int, error) {
	status.pending = append(status.pending, output...)
	for {
		end := bytes.IndexByte(status.pending, '\n')
		if end < 0 {
			return len(output), nil
		}
		status.read(bytes.TrimSpace(status.pending[:end]))
		status.pending = status.pending[end+1:]
	}
}

func (status *ProgramStatus) read(line []byte) {
	var event programEvent
	if !bytes.HasPrefix(line, []byte("{")) || json.Unmarshal(line, &event) != nil || !sessionFileName.MatchString(event.SessionID) {
		return
	}
	switch {
	case event.Type == "assistant" && event.ParentToolID == nil:
		usage := event.Message.Usage
		status.model = event.Message.Model
		status.tokens = usage.InputTokens + usage.CacheReadTokens + usage.CacheCreationTokens
	case event.Type == "result" && event.TotalCostUSD != nil:
		status.report.Cost = &statusCost{TotalCostUSD: *event.TotalCostUSD}
		if window := event.ModelUsage[status.model].ContextWindow; window > 0 {
			status.windowTokens = window
		}
	default:
		return
	}
	status.keep(event.SessionID)
}

func (status *ProgramStatus) keep(session string) {
	if status.report.SessionID != session {
		status.report.SessionID = session
		if status.report.Cost == nil {
			status.report.Cost = status.lastCost(session)
		}
	}
	if status.tokens > 0 {
		status.report.Context = &statusContext{UsedPercentage: int(math.Round(float64(status.tokens) * 100 / float64(status.windowTokens))), TotalInputTokens: status.tokens}
	}
	body, err := json.Marshal(status.report)
	if err != nil || os.MkdirAll(status.folder, 0o755) != nil {
		return
	}
	path := filepath.Join(status.folder, session+".json")
	// a file this run already wrote that has gone was moved when the agent ended, so a late line follows it there
	if _, missing := os.Stat(path); status.hasReport && missing != nil {
		path = filepath.Join(status.folder, "ended", session+".json")
	}
	status.hasReport = true
	_ = os.WriteFile(path, body, 0o644)
}

func (status *ProgramStatus) lastCost(session string) *statusCost {
	for _, folder := range []string{status.folder, filepath.Join(status.folder, "ended")} {
		var last statusReport
		text, err := os.ReadFile(filepath.Join(folder, session+".json"))
		if err == nil && json.Unmarshal(text, &last) == nil && last.Cost != nil {
			return last.Cost
		}
	}
	return nil
}
