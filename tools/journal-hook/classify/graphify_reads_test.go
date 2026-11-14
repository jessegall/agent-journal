package classify

import "testing"

func TestGraphifyReadsAreSearchCommands(t *testing.T) {
	for _, line := range []string{`graphify query "how does it work"`, `graphify path "A" "B"`, `graphify explain "A"`} {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if classification.Category != "search" || classification.Uncertain || hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}
