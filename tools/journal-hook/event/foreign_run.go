package event

type ForeignAnswer struct {
	Refusal      string         `json:"refusal"`
	Lines        []string       `json:"lines"`
	UpdatedInput map[string]any `json:"updated_input"`
	Terminal     string         `json:"terminal"`
}

type ForeignRun struct {
	ID           string `json:"id"`
	ExitCode     int    `json:"exit_code"`
	Stdout       string `json:"stdout"`
	Stderr       string `json:"stderr"`
	Milliseconds int64  `json:"milliseconds"`
	TimedOut     bool   `json:"timed_out"`
	// OnFailure is "block" when the hook's failure refuses the action it ran for, else empty.
	OnFailure string        `json:"on_failure,omitempty"`
	Answer    ForeignAnswer `json:"answer"`
}
