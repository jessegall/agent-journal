package classify

import "testing"

func TestTheTextOfAHeredocIsNeverReadAsCommandsOfTheLine(t *testing.T) {
	bodies := []string{
		"| a | wait for the cart |",
		"| a | kill it |",
		"| # | (a) first case; main takes the cart | \"ask the person\" | yes |",
		"it's one row | rm the old total | (b) > 5",
	}
	for _, body := range bodies {
		for _, line := range []string{
			"journal doc edit 12 --section Totals --body - <<'EOF'\n" + body + "\nEOF",
			"cd /work/shop; journal doc edit 12 --replace \"| a | b |\" --with - <<EOF\n" + body + "\nEOF",
		} {
			actual := shippedClassifier.ClassifyLine(line)
			if actual.Category != "journal" || actual.Uncertain || actual.has(writesFiles) || actual.has(deletesFiles) {
				t.Errorf("%q: %+v, want a journal line that is not uncertain and writes no file", line, actual)
			}
		}
	}
}

func TestAPipeAfterAHeredocStillSplitsTheLine(t *testing.T) {
	stagesOfLine := commands("cat <<'EOF' | grep cart\na | b\nEOF")
	if len(stagesOfLine) != 2 {
		t.Errorf("the line has %d commands, want 2: %q", len(stagesOfLine), stagesOfLine)
	}
}
