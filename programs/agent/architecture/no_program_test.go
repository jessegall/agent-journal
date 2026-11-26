// Package architecture holds tests of the shape of the Go code itself.
package architecture

import (
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"testing"
)

// programWords are the words that name a program, its screens or its menus; the host knows none of them, as every
// program decision is the journal's. The list is fixed, written once from the PHP profiles and layouts.
var programWords = regexp.MustCompile(`(?i)claude|codex|anthropic|openai|folder[-_ ]?trust|onboarding|theme[-_ ]?picker`)

// exempt are the folders allowed to name a program: the helpers that run inside a program's image, the hook binary
// that is a program's entry point, recordings and other test data, and this test.
var exempt = []string{
	"cmd/journal-init", "cmd/journal-exec", "cmd/journal-shell", "cmd/journal-hook", "testdata", "architecture",
}

func TestNoGoFileNamesAProgram(t *testing.T) {
	for file, line := range filesNamingAProgram(t) {
		t.Errorf("%s:%d names a program, which only the journal may know: move that knowledge to PHP", file, line)
	}
}

// filesNamingAProgram is each Go file that names a program, with the first line that does.
func filesNamingAProgram(t *testing.T) map[string]int {
	t.Helper()
	root := ".."
	naming := map[string]int{}
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
		if entry.IsDir() || !strings.HasSuffix(relative, ".go") {
			return nil
		}
		if line := lineNamingAProgram(t, path); line > 0 {
			naming[relative] = line
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

// lineNamingAProgram is the number of the file's first line that names a program, or 0 when none does.
func lineNamingAProgram(t *testing.T, path string) int {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	for number, line := range strings.Split(string(content), "\n") {
		if programWords.MatchString(line) {
			return number + 1
		}
	}
	return 0
}
