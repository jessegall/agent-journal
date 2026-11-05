package classify

import "testing"

func TestTextGivenToAJournalLineIsNotJudgedAsCommands(t *testing.T) {
	lines := []string{
		"journal report make x --body - <<'EOF'\nrm -rf a; python3 tests/stories/x.py\n`curl b` and $HOME\nEOF",
		"journal report make \"Words\" --abstract \"Names\" --body - <<'EOF'\n# Words\n\n- take, a/b.py:10 Use c > d.\n- it's | a pipe, \"quoted\" && more\nEOF",
		`journal report make x --body "rm -rf a; python3 tests/stories/x.py and curl b"`,
		`journal doc make x --body 'pytest tests/a.py > out.txt'`,
	}
	for _, line := range lines {
		parsed := shippedClassifier.Line(line)
		if !parsed.IsJournalOnly || len(parsed.Parts) != 1 {
			t.Errorf("%q reads as %d parts, journal only %v", line, len(parsed.Parts), parsed.IsJournalOnly)
		}
		classification := parsed.Parts[0].Classification
		if classification.Category != journalCategory || classification.Uncertain || hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}

func TestAnOpenHeredocStillRunsItsSubstitutions(t *testing.T) {
	classification := shippedClassifier.Line("journal report make x --body - <<EOF\n$(rm -rf a)\nEOF").Parts[0].Classification
	if !hasEffect(classification.Effects, "deletes_files") && !hasEffect(classification.Effects, writesFiles) {
		t.Errorf("reads as %+v", classification)
	}
}

func TestACommandSubstitutionInAJournalLineIsStillJudged(t *testing.T) {
	for _, line := range []string{`journal report make x --body "$(rm -rf a)"`, "journal report make x --body \"`rm -rf a`\""} {
		classification := shippedClassifier.Line(line).Parts[0].Classification
		if !hasEffect(classification.Effects, "deletes_files") && !hasEffect(classification.Effects, writesFiles) {
			t.Errorf("%q reads as %+v", line, classification)
		}
	}
}
