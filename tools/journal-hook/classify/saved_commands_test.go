package classify

import "testing"

func TestSavedCommandsShareTheirProgramAndWorkingFolder(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	for _, sample := range []struct {
		saved, candidate string
		duplicate        bool
	}{
		{".venv/bin/python3 -m pytest {args}", "python3 -m pytest tests/unit", true},
		{".venv/bin/python3 -m pytest {args}", ".venv/bin/pytest -q", true},
		{"pytest", "npx vitest run", false},
		{"our-tests", "our-tests", false},
		{"go -C tools/hook test", "cd tools/hook && go test ./...", true},
		{"go -C tools/hook test", "cd tools/run && go test ./...", false},
		{"cd src/viewer && npm run build", "npm --prefix src/viewer run build", true},
		{"cd src/viewer && npm run build", "cd src/other && npm run build", false},
		{"pytest", "sh -c 'python3 -m pytest tests/unit'", true},
	} {
		t.Run(sample.candidate, func(t *testing.T) {
			name := classifier.SavedCommandConflict(sample.candidate, map[string]string{"saved": sample.saved})
			if (name == "saved") != sample.duplicate {
				t.Fatalf("conflict = %q, want duplicate %v", name, sample.duplicate)
			}
		})
	}
}

// a saved command run by its own name with no arguments is still that saved command, though another saved command has the same line
func TestASavedCommandWithNoArgumentsKeepsItsName(t *testing.T) {
	for _, definition := range []string{"python3 -m pytest {args}", "python3 -m pytest -q {args}", "python3 -m pytest"} {
		classifier := NewClassifier(LoadTable(""))
		classifier.aliasLines = map[string]string{"pytest-run": definition, "python-run": definition}
		classifier.savedCommands = []string{"pytest-run", "python-run"}
		classifier.savedCommandsKnown = true
		prepared := classifier.Line("journal pytest-run")
		if prepared.ParseError != "" || len(prepared.Parts) != 1 || prepared.Parts[0].SavedCommand != "pytest-run" {
			t.Fatalf("%q: prepared line %+v", definition, prepared)
		}
	}
}
