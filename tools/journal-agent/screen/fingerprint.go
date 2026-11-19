package screen

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"

	"journal-agent/screen/contracts"
)

// fingerprintVersion opens every fingerprint, so a fingerprint made another way never equals one made this way.
const fingerprintVersion = "fp1"

// Fingerprint is the screen's fingerprint, "fp1:" and a hex SHA-256: what stays the same each time the program shows
// this screen, whatever its options, counts, addresses, paths, composer or spinner hold at the moment.
func Fingerprint(layout Layout, program string, snapshot contracts.Snapshot, menu string) string {
	fingerprint, _ := FingerprintOf(layout, program, snapshot, menu)

	return fingerprint
}

// FingerprintOf is the fingerprint and whether a replay may go by it: replayable is false when no option list is
// drawn, and the whole screen was hashed.
func FingerprintOf(
	layout Layout,
	program string,
	snapshot contracts.Snapshot,
	menu string,
) (fingerprint string, replayable bool) {
	if menu == "" {
		menu = "unknown"
	}
	options, replayable := layout.OptionRegion(snapshot)
	left := layout.changingRows(snapshot)
	if replayable {
		left = append(left, options.Rows)
	}

	lines := []string{fingerprintVersion, program, string(snapshot.Buffer), menu}
	for row, text := range snapshot.Rows {
		if isInAny(row, left) {
			continue
		}
		if normalised := Normalise(text, options.Markers); normalised != "" {
			lines = append(lines, normalised)
		}
	}
	sum := sha256.Sum256([]byte(strings.Join(lines, "\n")))

	return fingerprintVersion + ":" + hex.EncodeToString(sum[:]), replayable
}

// changingRows are the rows of the composer and of every other region the layout names, such as its spinner and
// status line, which change while the screen stays the same.
func (layout Layout) changingRows(snapshot contracts.Snapshot) []contracts.RowRange {
	var ranges []contracts.RowRange
	for _, region := range append([]contracts.Region{layout.Composer}, layout.Others...) {
		if rows, found := region.Rows(snapshot); found {
			ranges = append(ranges, rows)
		}
	}

	return ranges
}

func isInAny(row int, ranges []contracts.RowRange) bool {
	for _, rows := range ranges {
		if row >= rows.First && row < rows.Last {
			return true
		}
	}

	return false
}
