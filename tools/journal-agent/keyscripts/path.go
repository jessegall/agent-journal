package keyscripts

import (
	"errors"
	"fmt"
	"strings"
)

// ErrEmptyPath refuses an entry from a log that holds no action.
var ErrEmptyPath = errors.New("a proven path holds no action to replay")

// ErrSecretPath refuses an entry from a log that met a screen the secret boundary kept on the host.
var ErrSecretPath = errors.New("a proven path that met a secret screen is never saved")

// ErrUnreplayablePath refuses an entry whose choice was made on a screen a replay could not find again.
var ErrUnreplayablePath = errors.New("a proven path chose on a screen with no option list to find again")

// highlightKeys only move the highlight: the confirming action carries the label, so they are never stored.
var highlightKeys = map[string]bool{"up": true, "down": true, "tab": true, "left": true, "right": true}

// ProvenPath is what a proven navigation carried out: its actions in order, whether any screen was a secret one,
// and the proof that ended it with what it completes.
type ProvenPath struct {
	Actions   []ActionRecord
	Secret    bool
	Proof     string
	Completes string
	NextStep  *int
}

// Entry turns a proven path into the steps of a library entry: each choice becomes a Choose step with the
// label seen before its confirming key and the fingerprint before it, each confirmation key a Key step, and the
// moves of the highlight are dropped. The last step carries the proof; the first step's fingerprint finds the entry.
func (path ProvenPath) Entry() (Entry, error) {
	if path.Secret {
		return Entry{}, ErrSecretPath
	}
	var steps []EntryStep
	for _, action := range path.Actions {
		if action.movesHighlight() {
			continue
		}
		step, err := stepOf(action)
		if err != nil {
			return Entry{}, err
		}
		steps = append(steps, step)
	}
	if len(steps) == 0 {
		return Entry{}, ErrEmptyPath
	}
	proof := path.Proof
	steps[len(steps)-1].Proof = &proof

	return Entry{Steps: steps, Completes: path.Completes, NextStep: path.NextStep, Proof: path.Proof}, nil
}

// movesHighlight is whether the action only moved the highlight, which a library entry drops.
func (action ActionRecord) movesHighlight() bool {
	return action.Kind == "key" && highlightKeys[action.Key]
}

func stepOf(action ActionRecord) (EntryStep, error) {
	if action.Kind == "choose" {
		if !action.Replayable {
			return EntryStep{}, ErrUnreplayablePath
		}
		label := action.Label
		return EntryStep{Fingerprint: action.Fingerprint, Choose: &label}, nil
	}
	if _, named := namedKeys[action.Key]; !named || strings.HasPrefix(action.Key, "text:") {
		return EntryStep{}, fmt.Errorf("a proven path pressed %q, which a library entry cannot keep", action.Key)
	}
	key := action.Key

	return EntryStep{Fingerprint: action.Fingerprint, Key: &key}, nil
}
