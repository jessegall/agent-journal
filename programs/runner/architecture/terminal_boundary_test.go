package architecture

import (
	"go/parser"
	"go/token"
	"io/fs"
	"os/exec"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"testing"
)

func TestTheRunnerDoesNotImportTheTerminalOrScreen(t *testing.T) {
	for _, tags := range [][]string{nil, {"-tags", "mock"}} {
		arguments := append([]string{"list", "-deps"}, tags...)
		arguments = append(arguments, "./cmd/journal-runner")
		list := exec.Command("go", arguments...)
		list.Dir = ".."
		packages, err := list.CombinedOutput()
		if err != nil {
			t.Fatalf("listing the runner's imports: %v\n%s", err, packages)
		}
		for _, name := range strings.Fields(string(packages)) {
			if slices.Contains([]string{"journal-runner/screen", "journal-runner/terminal"}, name) {
				t.Errorf("journal-runner imports %s through its packages", name)
			}
		}
	}
}

func TestOnlyTheExecutorAndTerminalImportPty(t *testing.T) {
	err := filepath.WalkDir("..", func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() || !strings.HasSuffix(path, ".go") {
			return nil
		}
		folder := filepath.Dir(path)
		if slices.Contains([]string{filepath.Join("..", "executor"), filepath.Join("..", "terminal")}, folder) {
			return nil
		}
		files := token.NewFileSet()
		source, err := parser.ParseFile(files, path, nil, parser.ImportsOnly)
		if err != nil {
			return err
		}
		for _, imported := range source.Imports {
			name, _ := strconv.Unquote(imported.Path.Value)
			if name == "github.com/creack/pty" {
				t.Errorf("%s imports the PTY library outside executor or terminal", files.Position(imported.Pos()))
			}
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}
