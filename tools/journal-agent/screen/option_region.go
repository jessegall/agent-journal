package screen

import (
	"slices"

	"journal-agent/screen/contracts"
)

// OptionRegion is the lowest option list on screen, found by the highlight markers of every menu family and by no
// family's name or words: its rows, its entries and the markers it was found with.
type OptionRegion struct {
	Rows    contracts.RowRange
	Entries MenuEntries
	Markers []string
}

// OptionRegion finds the lowest list of at least two option rows any of the layout's highlight markers draws, known
// menu or not; found is false when none is drawn, and such a screen is never fingerprinted by its labels.
func (layout Layout) OptionRegion(snapshot contracts.Snapshot) (OptionRegion, bool) {
	options := OptionList{Label: "options", Markers: layout.highlightMarkers()}
	rows, found := options.Rows(snapshot)
	if !found {
		return OptionRegion{}, false
	}
	entries, _ := options.Entries(snapshot)

	return OptionRegion{Rows: rows, Entries: entries, Markers: options.Markers}, true
}

// highlightMarkers are the markers of every family whose options are an option list, each once.
func (layout Layout) highlightMarkers() []string {
	var markers []string
	for _, family := range layout.Menus {
		options, isList := family.Options.(OptionList)
		if !isList {
			continue
		}
		for _, marker := range options.Markers {
			if !slices.Contains(markers, marker) {
				markers = append(markers, marker)
			}
		}
	}

	return markers
}
