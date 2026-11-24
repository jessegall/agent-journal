package contracts

// TurnEnd is what the host saw when a turn ended, as it saw it: the journal judges from it whether the turn was
// applied, failed or uncertain. Each driver fills in what it can see and leaves the rest empty.
type TurnEnd struct {
	// ExitCode is the exit code of a headless turn's process; nil when no process of the turn ended.
	ExitCode *int `json:"exit_code,omitempty"`
	// ResultRead is whether the turn's output held a result line; ResultSubtype and ResultIsError are its fields.
	ResultRead    bool   `json:"result_read,omitempty"`
	ResultSubtype string `json:"result_subtype,omitempty"`
	ResultIsError bool   `json:"result_is_error,omitempty"`
	// Model is the model the turn's own output says it ran on; empty when its output names none.
	Model string `json:"model,omitempty"`
	// CodexStatus is the status the Codex owner ended the turn with.
	CodexStatus string `json:"codex_status,omitempty"`
	// ComposerLeft is whether a terminal turn took the composer away within the journal's start window.
	ComposerLeft *bool `json:"composer_left,omitempty"`
	// Problem is an error the host met while it waited for the end, word for word.
	Problem string `json:"problem,omitempty"`
}
