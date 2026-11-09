package filescan

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"
)

// checkout is a folder under git with one committed file, and a first scan taken.
func checkout(t *testing.T) (root, state string) {
	t.Helper()
	root, state = t.TempDir(), t.TempDir()
	writeFile(t, root, "cart.py", "TOTAL = 0\n")
	for _, arguments := range [][]string{{"init", "-q"}, {"add", "."}, {"-c", "user.name=a", "-c", "user.email=a@b", "commit", "-qm", "first"}} {
		if output, err := exec.Command("git", append([]string{"-C", root}, arguments...)...).CombinedOutput(); err != nil {
			t.Skipf("git is not at hand: %s", output)
		}
	}
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("the first scan only sets what later scans compare with, it found %v", changes)
	}
	return root, state
}

func writeFile(t *testing.T, root, path, text string) {
	t.Helper()
	absolutePath := filepath.Join(root, path)
	if err := os.MkdirAll(filepath.Dir(absolutePath), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(absolutePath, []byte(text), 0o600); err != nil {
		t.Fatal(err)
	}
	moved := time.Now().Add(time.Duration(sequence()) * time.Millisecond)
	if err := os.Chtimes(absolutePath, moved, moved); err != nil {
		t.Fatal(err)
	}
}

var fileCount int

func sequence() int {
	fileCount++
	return fileCount
}

func scanned(t *testing.T, root, state string) []Change {
	t.Helper()
	changes, err := Scan(root, state)
	if err != nil {
		t.Fatal(err)
	}
	return changes
}

func expectOne(t *testing.T, changes []Change, path string, added, removed int, existed bool) Change {
	t.Helper()
	if len(changes) != 1 {
		t.Fatalf("want one change, got %v", changes)
	}
	diff := changes[0].Diff
	if diff.Path != path || diff.LinesAdded != added || diff.LinesRemoved != removed || diff.Existed != existed {
		t.Fatalf("want %s +%d -%d existed %v, got %+v", path, added, removed, existed, diff)
	}
	return changes[0]
}

func TestAnEditOfACommittedFileCountsAgainstTheCommit(t *testing.T) {
	root, state := checkout(t)
	writeFile(t, root, "cart.py", "TOTAL = 1\n")
	change := expectOne(t, scanned(t, root, state), "cart.py", 1, 1, true)
	if len(change.Rows) != 2 || change.Rows[0].LineType != "del" || change.Rows[1].Text != "TOTAL = 1" {
		t.Fatalf("the rows are %+v", change.Rows)
	}
}

func TestFourEditsOfOneFileAreFourEditsEachAgainstTheOneBefore(t *testing.T) {
	root, state := checkout(t)
	text := "TOTAL = 0\n"
	for number := 1; number <= 4; number++ {
		text += fmt.Sprintf("LINE = %d\n", number)
		writeFile(t, root, "cart.py", text)
		expectOne(t, scanned(t, root, state), "cart.py", 1, 0, true)
	}
}

func TestAFileThatWasAlreadyChangedCountsOnlyWhatThisLineChanged(t *testing.T) {
	root, state := checkout(t)
	writeFile(t, root, "cart.py", "TOTAL = 1\n")
	scanned(t, root, state)
	writeFile(t, root, "cart.py", "TOTAL = 1\nTAX = 2\n")
	expectOne(t, scanned(t, root, state), "cart.py", 1, 0, true)
}

func TestANewFileIsNewAndADeletedFileCountsItsLines(t *testing.T) {
	root, state := checkout(t)
	writeFile(t, root, "fresh.py", "ONE = 1\nTWO = 2\n")
	expectOne(t, scanned(t, root, state), "fresh.py", 2, 0, false)
	if err := os.Remove(filepath.Join(root, "fresh.py")); err != nil {
		t.Fatal(err)
	}
	expectOne(t, scanned(t, root, state), "fresh.py", 0, 2, true)
}

func TestATouchedFileWithTheSameTextIsNoEdit(t *testing.T) {
	root, state := checkout(t)
	writeFile(t, root, "cart.py", "TOTAL = 0\n")
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("a touch is no edit: %v", changes)
	}
}

func TestLeftOutFoldersAndIgnoredFilesAreNotRead(t *testing.T) {
	root, state := checkout(t)
	writeFile(t, root, ".gitignore", "*.log\n/build\n")
	scanned(t, root, state)
	writeFile(t, root, "run.log", "a\n")
	writeFile(t, root, "build/out.txt", "a\n")
	writeFile(t, root, "node_modules/a.js", "a\n")
	writeFile(t, root, "web/dist/a.js", "a\n")
	writeFile(t, root, "graphify-out/graph.json", "{}\n")
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("these are no edits: %v", changes)
	}
}

func TestALineThatChangesManyFilesIsNoEdit(t *testing.T) {
	root, state := checkout(t)
	for number := 0; number <= ChangedFilesMost; number++ {
		writeFile(t, root, fmt.Sprintf("file%d.py", number), "A = 1\n")
	}
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("a merge or a checkout is no edit: %d changes", len(changes))
	}
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("the next scan starts from them: %d changes", len(changes))
	}
}

func TestABinaryFileIsNoEdit(t *testing.T) {
	root, state := checkout(t)
	writeFile(t, root, "image.png", "a\x00b")
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("a binary file is no edit: %v", changes)
	}
}

func TestOnlyOneScanRunsAndALineThatEndsMeanwhileAsksForAnother(t *testing.T) {
	state := t.TempDir()
	if !Acquire(state) {
		t.Fatal("the first scan takes it")
	}
	if Acquire(state) {
		t.Fatal("a second scan waits")
	}
	if !MustRepeat(state) {
		t.Fatal("the first scan goes round again")
	}
	if MustRepeat(state) {
		t.Fatal("once")
	}
	Release(state)
	if !Acquire(state) {
		t.Fatal("it can be taken again")
	}
}

func TestTheRootIsFoundFromAFolderBelowIt(t *testing.T) {
	root, _ := checkout(t)
	folder := filepath.Join(root, "src", "cart")
	if err := os.MkdirAll(folder, 0o700); err != nil {
		t.Fatal(err)
	}
	if repository, inRepository := RepositoryRoot(folder); !inRepository || repository != root {
		t.Fatalf("got %s, want %s", repository, root)
	}
}
