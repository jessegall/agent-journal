package edits

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/event"
)

// Each pair of texts beside the counts git diff --numstat gives for it.
var lineDiffCases = []struct {
	name    string
	before  string
	after   string
	added   int
	removed int
}{
	{"one line changed", "a\nb\nc\n", "a\nB\nc\n", 1, 1},
	{"lines added in the middle", "a\nc\n", "a\nb1\nb2\nc\n", 2, 0},
	{"lines removed", "a\nb\nc\nd\n", "a\nd\n", 0, 2},
	{"a new file", "", "x\ny\n", 2, 0},
	{"the last line loses its ending", "a\nb\n", "a\nb", 1, 1},
	{"nothing changed", "same\n", "same\n", 0, 0},
	{"a block moved", "a\nb\nc\nd\ne\n", "c\nd\ne\na\nb\n", 2, 2},
}

func TestLineDiffCountsAsGitDiffNumstat(t *testing.T) {
	for _, sample := range lineDiffCases {
		added, removed := LineDiff(sample.before, sample.after)
		if added != sample.added || removed != sample.removed {
			t.Errorf("%s: +%d -%d, want +%d -%d", sample.name, added, removed, sample.added, sample.removed)
		}
		if gitAdded, gitRemoved, ok := gitNumstat(t, sample.before, sample.after); ok && (gitAdded != added || gitRemoved != removed) {
			t.Errorf("%s: git diff --numstat gives +%d -%d, the diff +%d -%d", sample.name, gitAdded, gitRemoved, added, removed)
		}
	}
}

func TestAnEditOfAFileOnDiskIsCountedFromTheFile(t *testing.T) {
	folder := t.TempDir()
	path := filepath.Join(folder, "app.py")
	write(t, path, "def a():\n    return 1\n\ndef b():\n    return 1\n")
	before := OnDisk(path)
	cases := []struct {
		name         string
		replacements []Replacement
		want         event.DiffCount
	}{
		{"one replace", []Replacement{{Old: "    return 1\n\ndef b", New: "    return 2\n\ndef b"}}, event.DiffCount{Path: path, Existed: true, LinesAdded: 1, LinesRemoved: 1}},
		{"a replace that is not found", []Replacement{{Old: "return 3", New: "return 4"}}, event.DiffCount{Path: path, Existed: true}},
		{"a replace of every place", []Replacement{{Old: "return 1", New: "return 0", All: true}}, event.DiffCount{Path: path, Existed: true, LinesAdded: 2, LinesRemoved: 2}},
		{"a multi-edit, one after the other", []Replacement{{Old: "def a():", New: "def first():"}, {Old: "def first():\n", New: "def first():\n    \"\"\"The first.\"\"\"\n"}}, event.DiffCount{Path: path, Existed: true, LinesAdded: 2, LinesRemoved: 1}},
	}
	for _, sample := range cases {
		if got := Counted(path, before, Replaced(*before, sample.replacements)); *got != sample.want {
			t.Errorf("%s: %+v, want %+v", sample.name, *got, sample.want)
		}
	}
}

func TestANewFileDidNotExist(t *testing.T) {
	path := filepath.Join(t.TempDir(), "new.md")
	if got := Counted(path, OnDisk(path), "# Title\n\nText.\n"); *got != (event.DiffCount{Path: path, Existed: false, LinesAdded: 3}) {
		t.Errorf("%+v", *got)
	}
}

func TestACodexPatchIsCountedFromItsOwnLines(t *testing.T) {
	folder := t.TempDir()
	write(t, filepath.Join(folder, "old.txt"), "1\n2\n3\n")
	onDisk := func(path string) *string { return OnDisk(filepath.Join(folder, path)) }
	patch := "*** Begin Patch\n*** Update File: a.go\n@@\n-x\n+y\n+z\n*** Add File: b.go\n+package b\n*** Delete File: old.txt\n*** End Patch"
	if got := Patched(patch, onDisk); *got != (event.DiffCount{Path: "a.go", Existed: true, LinesAdded: 3, LinesRemoved: 4}) {
		t.Errorf("%+v", *got)
	}
	if got := Patched("*** Begin Patch\n*** Add File: n.txt\n+one\n*** End Patch", onDisk); *got != (event.DiffCount{Path: "n.txt", Existed: false, LinesAdded: 1}) {
		t.Errorf("%+v", *got)
	}
	if Patched("not a patch", onDisk) != nil {
		t.Error("a text with no file header counted as a patch")
	}
}

// gitNumstat asks git for its counts of the two texts, within ten seconds; ok is false where git is not at hand.
func gitNumstat(t *testing.T, before, after string) (added, removed int, ok bool) {
	t.Helper()
	if _, err := exec.LookPath("git"); err != nil {
		return 0, 0, false
	}
	folder := t.TempDir()
	write(t, filepath.Join(folder, "before"), before)
	write(t, filepath.Join(folder, "after"), after)
	limit, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	output, _ := exec.CommandContext(limit, "git", "diff", "--no-index", "--numstat", filepath.Join(folder, "before"), filepath.Join(folder, "after")).Output()
	if strings.TrimSpace(string(output)) == "" {
		return 0, 0, true
	}
	if _, err := fmt.Sscanf(string(output), "%d\t%d", &added, &removed); err != nil {
		t.Fatalf("git diff --numstat said %q", output)
	}
	return added, removed, true
}

func write(t *testing.T, path, text string) {
	t.Helper()
	if err := os.WriteFile(path, []byte(text), 0o644); err != nil {
		t.Fatal(err)
	}
}
