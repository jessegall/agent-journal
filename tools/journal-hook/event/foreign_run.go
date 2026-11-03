package event

type ForeignRun struct {
	ID           string `json:"id"`
	ExitCode     int    `json:"exit_code"`
	Stdout       string `json:"stdout"`
	Stderr       string `json:"stderr"`
	Milliseconds int64  `json:"milliseconds"`
	TimedOut     bool   `json:"timed_out"`
}
