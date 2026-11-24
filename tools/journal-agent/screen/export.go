package screen

import "journal-agent/screen/contracts"

// AsksForSecret is whether a family marked Secret has enough of its keywords on the screen, whether or not its
// option list is drawn: a plain password or key prompt has none.
func (layout Layout) AsksForSecret(snapshot contracts.Snapshot) bool {
	for _, family := range layout.Menus {
		if family.Secret && family.matchesWords(snapshot) {
			return true
		}
	}

	return false
}

// IsExportable is whether any text of this screen may leave the host for the journal; every export asks it first and
// sends nothing when it says no.
func (layout Layout) IsExportable(snapshot contracts.Snapshot) bool {
	return !layout.AsksForSecret(snapshot)
}
