package edits

import (
	"bufio"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// A recorded Edit, MultiEdit or Write of the corpus: the text it was handed and what Claude handed back after it ran.
type recordedEdit struct {
	ToolName  string `json:"tool_name"`
	ToolInput struct {
		Content    *string `json:"content"`
		OldString  string  `json:"old_string"`
		NewString  string  `json:"new_string"`
		ReplaceAll bool    `json:"replace_all"`
		Edits      []struct {
			OldString  string `json:"old_string"`
			NewString  string `json:"new_string"`
			ReplaceAll bool   `json:"replace_all"`
		} `json:"edits"`
	} `json:"tool_input"`
	ToolResponse struct {
		OriginalFile *string `json:"originalFile"`
	} `json:"tool_response"`
}

// Every edit and write of the recorded corpus is applied to a file in a temporary folder, and the count of the diff
// equals git diff --numstat's. Claude hands back the original text cut short for a long file, so an edit whose old
// text is not in it is applied to that old text with a line of context on either side.
func TestEveryCorpusEditCountsAsGitDiffNumstat(t *testing.T) {
	compared := 0
	for _, event := range []string{"PreToolUse", "PostToolUse"} {
		for number, edit := range recordedEdits(t, filepath.Join("..", "testdata", "recorded", "claude", event+".jsonl")) {
			existing, changed := editTexts(edit)
			count := Counted("file", existing, changed)
			original := ""
			if existing != nil {
				original = *existing
			}
			added, removed, present := gitNumstat(t, original, changed)
			if !present {
				t.Skip("git is not at hand")
			}
			compared++
			if count.LinesAdded != added || count.LinesRemoved != removed {
				t.Errorf("%s %s edit %d: the diff counts +%d -%d, git diff --numstat +%d -%d", event, edit.ToolName, number+1, count.LinesAdded, count.LinesRemoved, added, removed)
			}
		}
	}
	if compared == 0 {
		t.Fatal("the corpus holds no edit or write")
	}
	t.Logf("%d recorded edits and writes count as git diff --numstat counts them", compared)
}

// editTexts are the file's text before the tool ran, nil for a file it made, and after.
func editTexts(edit recordedEdit) (*string, string) {
	if edit.ToolName == "Write" {
		return edit.ToolResponse.OriginalFile, *edit.ToolInput.Content
	}
	replacements := []Replacement{{Old: edit.ToolInput.OldString, New: edit.ToolInput.NewString, All: edit.ToolInput.ReplaceAll}}
	if edit.ToolName == "MultiEdit" {
		replacements = nil
		for _, row := range edit.ToolInput.Edits {
			replacements = append(replacements, Replacement{Old: row.OldString, New: row.NewString, All: row.ReplaceAll})
		}
	}
	original := "line above\n" + replacements[0].Old + "\nline below\n"
	if recorded := edit.ToolResponse.OriginalFile; recorded != nil && strings.Contains(*recorded, replacements[0].Old) {
		original = *recorded
	}
	return &original, Replaced(original, replacements)
}

func recordedEdits(t *testing.T, path string) []recordedEdit {
	t.Helper()
	opened, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer opened.Close()
	scanner := bufio.NewScanner(opened)
	scanner.Buffer(make([]byte, 0, 1<<20), 64<<20)
	var collected []recordedEdit
	for scanner.Scan() {
		var edit recordedEdit
		if json.Unmarshal(scanner.Bytes(), &edit) != nil || !isFileTool(edit) {
			continue
		}
		collected = append(collected, edit)
	}
	return collected
}

func isFileTool(edit recordedEdit) bool {
	return edit.ToolName == "Edit" || edit.ToolName == "MultiEdit" || edit.ToolName == "Write" && edit.ToolInput.Content != nil
}
