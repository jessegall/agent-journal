// Package terminal guards what is written to an agent driver's terminal: the user's keys and the journal's lines
// pass one gate, so neither overwrites the other.
package terminal

import "time"

// Owner is who holds the text in the program's composer.
type Owner string

const (
	// NobodyOwns is an empty composer: the journal may type into it.
	NobodyOwns Owner = "nobody"
	// UserInput is text the user typed: the journal never erases, retypes or submits it on its own.
	UserInput Owner = "user"
	// DriverInput is exactly the line the journal last typed, with no key of the user's since.
	DriverInput Owner = "driver"
)

// Draft is the user's unsent text in the composer and how long it has waited, so the journal can show its age and
// offer the user's own choices for it.
type Draft struct {
	Text  string
	Since time.Time
}

// Age is how long the draft has waited at the given time.
func (draft Draft) Age(now time.Time) time.Duration {
	return now.Sub(draft.Since)
}

// DraftChoice is what the user decides for a draft that holds up the journal's work. The gate never decides it.
type DraftChoice string

const (
	// SendDraft submits the user's draft as it stands.
	SendDraft DraftChoice = "send"
	// SaveAndClearDraft keeps the draft in the local draft buffer and empties the composer.
	SaveAndClearDraft DraftChoice = "save-and-clear"
	// CancelPendingWork drops the journal's waiting line and leaves the draft where it is.
	CancelPendingWork DraftChoice = "cancel-pending-work"
)
