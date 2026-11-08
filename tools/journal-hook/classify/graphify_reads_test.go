package classify

import "testing"

func TestGraphifyReadsAreReadCommands(t *testing.T) {
	for _, line := range []string{`graphify query "how does it work"`, `graphify path "A" "B"`, `graphify explain "A"`} {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if classification.Category != "read" || classification.Uncertain || hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}
