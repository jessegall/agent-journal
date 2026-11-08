from pathlib import Path

root = Path(__file__).resolve().parents[1] / "tools" / "journal-hook" / "classify"
test = root / "saved_commands_test.go"
text = test.read_text()
text += '''
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
'''
test.write_text(text)

import sys
if len(sys.argv) < 2:
    print("test only", flush=True)
    raise SystemExit
line = root / "line.go"
body = line.read_text()
old = "		if run.line != strings.TrimSpace(command.Text) {"
assert old in body
line.write_text(body.replace(old, "		if strings.TrimSpace(run.line) != strings.TrimSpace(command.Text) {", 1))
print("done", flush=True)
