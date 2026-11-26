package contracts

// TurnEnd is what the host saw when a turn ended, as it saw it: the journal judges from it whether the turn was
// applied, failed or uncertain. Each driver fills in what it can see and leaves the rest empty.
type TurnEnd struct {
	// CodexStatus is the status the Codex owner ended the turn with.
	CodexStatus string `json:"codex_status,omitempty"`
	// ComposerLeft is whether a terminal turn took the composer away within the journal's start window.
	ComposerLeft *bool `json:"composer_left,omitempty"`
	// Problem is an error the host met while it waited for the end, word for word.
	Problem string `json:"problem,omitempty"`
}
