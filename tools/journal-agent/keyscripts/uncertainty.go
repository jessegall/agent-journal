package keyscripts

import "journal-agent/screen"

// UncertaintyReason is why a run could not be certain of its next key (doc 54, section 4, decision 3).
type UncertaintyReason string

const (
	// NoEntry is a step whose expected screen did not come while a stable menu showed instead.
	NoEntry UncertaintyReason = "no-entry"
	// LabelMissing is a wanted entry the menu on screen does not show by its label.
	LabelMissing UncertaintyReason = "label-missing"
	// Ambiguous is a wanted label two entries on screen hold.
	Ambiguous UncertaintyReason = "ambiguous"
	// HighlightWrong is a highlight that is not on the wanted entry when it is to be confirmed.
	HighlightWrong UncertaintyReason = "highlight-wrong"
	// NoProof is a goal whose proof did not show after the last step.
	NoProof UncertaintyReason = "no-proof"
	// StaleEntry is a library entry whose replay failed a check.
	StaleEntry UncertaintyReason = "stale-entry"
	// NextFingerprint is a library entry's step whose screen, by its fingerprint, did not come.
	NextFingerprint UncertaintyReason = "next-fingerprint"
)

// Uncertainty is where a run stopped because it could not be certain, as the main agent is asked about it: why, at
// which step, and the stable screen it stopped on, its rows redacted, with its fingerprint, the highlighted entry
// (-1 when none), the screen generation and the count of the user's inputs it was read at.
type Uncertainty struct {
	Reason      UncertaintyReason
	Step        int
	StepName    string
	Fingerprint string
	Rows        []string
	Highlight   int
	Generation  uint64
	Epoch       uint64
	StaleEntry  string
	// HostRows are the screen's rows as drawn, kept on the host to refuse a proof the stalled screen already showed;
	// they are never sent anywhere.
	HostRows []string
}

// Driver is the driver build a runner drives, as an uncertainty names it: its name and the layout it draws with.
type Driver struct {
	Name   string
	Layout screen.Layout
}
