// Package architecture holds tests of the shape of the Go code itself.
package architecture

import (
	"bufio"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"testing"
)

// programWords are the words that name a program, its screens or its menus; the host knows none of them, as every
// program decision is the journal's (doc 135). The list is fixed, written once from the PHP profiles and layouts.
var programWords = regexp.MustCompile(`(?i)claude|codex|anthropic|openai|folder[-_ ]?trust|onboarding|theme[-_ ]?picker`)

// exempt are the folders allowed to name a program: the helpers that run inside a program's image, the hook binary
// that is a program's entry point, recordings and other test data, and this test.
var exempt = []string{
	"cmd/journal-init", "cmd/journal-exec", "cmd/journal-shell", "cmd/journal-hook", "testdata", "architecture",
}

// baselinePath lists the files that still name a program today; each phase of plan 80 removes its own, so the list
// only shrinks, and task 3454 empties it.
const baselinePath = "testdata/program_words_baseline.txt"

func TestNoGoFileOutsideTheBaselineNamesAProgram(t *testing.T) {
	baseline := readBaseline(t)
	naming := filesNamingAProgram(t)

	for _, file := range naming {
		if !slices.Contains(baseline, file) {
			t.Errorf("%s names a program, which only the journal may know: move that knowledge to PHP", file)
		}
	}
	for _, file := range baseline {
		if !slices.Contains(naming, file) {
			t.Errorf("%s no longer names a program: remove it from %s", file, baselinePath)
		}
	}
}

func filesNamingAProgram(t *testing.T) []string {
	t.Helper()
	root := ".."
	naming := []string{}
	err := filepath.WalkDir(root, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		relative, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		relative = filepath.ToSlash(relative)
		if entry.IsDir() && isExempt(relative) {
			return filepath.SkipDir
		}
		if !entry.IsDir() && strings.HasSuffix(relative, ".go") && namesAProgram(t, path) {
			naming = append(naming, relative)
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return naming
}

func isExempt(relative string) bool {
	return slices.ContainsFunc(exempt, func(folder string) bool {
		return relative == folder || strings.HasSuffix(relative, "/"+folder)
	})
}

func namesAProgram(t *testing.T, path string) bool {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return programWords.Match(content)
}

func readBaseline(t *testing.T) []string {
	t.Helper()
	file, err := os.Open(baselinePath)
	if err != nil {
		t.Fatal(err)
	}
	defer file.Close()
	files := []string{}
	lines := bufio.NewScanner(file)
	for lines.Scan() {
		if line := strings.TrimSpace(lines.Text()); line != "" {
			files = append(files, line)
		}
	}
	return files
}
