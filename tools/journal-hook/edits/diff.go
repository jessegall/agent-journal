// Package edits counts the lines an edit or a write adds and removes, as git diff --numstat counts them.
package edits

import (
	"os"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
	"github.com/sergi/go-diff/diffmatchpatch"
)

// How long one diff may take before it settles for a diff that is not the shortest; a hook has five seconds in all.
const diffTimeLimit = 500 * time.Millisecond

// LineDiff counts the lines added and removed between two texts with a Myers diff over whole lines, a line's ending
// part of the line, as git diff --numstat counts them.
func LineDiff(before, after string) (added, removed int) {
	matcher := diffmatchpatch.New()
	matcher.DiffTimeout = diffTimeLimit
	beforeLines, afterLines, _ := matcher.DiffLinesToRunes(before, after)
	for _, difference := range matcher.DiffMainRunes(beforeLines, afterLines, false) {
		lines := utf8.RuneCountInString(difference.Text)
		switch difference.Type {
		case diffmatchpatch.DiffInsert:
			added += lines
		case diffmatchpatch.DiffDelete:
			removed += lines
		}
	}
	return added, removed
}

// Counted is the diff of a file whose text was before, or which did not exist when before is nil, and is after.
func Counted(path string, before *string, after string) *event.DiffCount {
	original := ""
	if before != nil {
		original = *before
	}
	added, removed := LineDiff(original, after)
	return &event.DiffCount{Path: path, Existed: before != nil, LinesAdded: added, LinesRemoved: removed}
}

// OnDisk is the text of a file as it stands, or nil when there is none.
func OnDisk(path string) *string {
	text, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	found := string(text)
	return &found
}

// Replacement is one replace of an edit tool: the text it looks for, what it puts in its place, and whether it
// replaces every place the text stands or only the first.
type Replacement struct {
	Old string
	New string
	All bool
}

// Replaced is the text after the replacements, applied one after the other as an edit tool applies them; a text that
// is not found changes nothing, as the tool then fails.
func Replaced(text string, replacements []Replacement) string {
	for _, replacement := range replacements {
		if replacement.All {
			text = strings.ReplaceAll(text, replacement.Old, replacement.New)
		} else {
			text = strings.Replace(text, replacement.Old, replacement.New, 1)
		}
	}
	return text
}

var (
	patchAdded   = regexp.MustCompile(`(?m)^\+`)
	patchTripled = regexp.MustCompile(`(?m)^\+\+\+`)
	patchRemoved = regexp.MustCompile(`(?m)^-`)
	patchDashes  = regexp.MustCompile(`(?m)^---`)
	patchFile    = regexp.MustCompile(`(?m)^\*\*\* (Add|Update|Delete) File: (.+?)\s*$`)
)

// Patched counts a Codex apply_patch from its own lines, which are the diff: a + line added and a - line removed, as
// version 4's LineCount.patch counts them, and a deleted file's lines read from the file on disk. It names the first
// file the patch touches, and whether that file existed; the counts are those of every file in the patch.
func Patched(patch string, onDisk func(string) *string) *event.DiffCount {
	files := patchFile.FindAllStringSubmatch(patch, -1)
	if len(files) == 0 {
		return nil
	}
	count := &event.DiffCount{Path: files[0][2], Existed: files[0][1] != "Add"}
	count.LinesAdded = len(patchAdded.FindAllStringIndex(patch, -1)) - len(patchTripled.FindAllStringIndex(patch, -1))
	count.LinesRemoved = len(patchRemoved.FindAllStringIndex(patch, -1)) - len(patchDashes.FindAllStringIndex(patch, -1))
	for _, file := range files {
		if file[1] != "Delete" {
			continue
		}
		if text := onDisk(file[2]); text != nil {
			_, removed := LineDiff(*text, "")
			count.LinesRemoved += removed
		}
	}
	return count
}
