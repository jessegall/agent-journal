package classify

import "testing"

func TestASavedCommandThatRunsAnInnerScriptStaysSaved(t *testing.T) {
	classifier := NewClassifier(LoadTable(""))
	classifier.aliasLines = map[string]string{"frontend-build": "sh /p/tools/container-run.sh app -- sh -c 'WAYFINDER_GENERATED=1 npm run build:frontend'"}
	classifier.savedCommands = []string{"frontend-build"}
	classifier.savedCommandsKnown = true
	prepared := classifier.Line("journal frontend-build --tail 20")
	if len(prepared.Parts) != 1 || prepared.Parts[0].SavedCommand != "frontend-build" || prepared.Parts[0].ReadFlag != "tail:20" {
		t.Fatalf("prepared line %+v", prepared)
	}
}
