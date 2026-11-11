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
	changes, err := Scan(root, state, time.Time{})
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

// hourAgo is a moment well before any scan of a test, for a file that was there before the line that is scanned.
var hourAgo = time.Now().Add(-time.Hour)

func writeOldFile(t *testing.T, root, path, text string) {
	t.Helper()
	writeFile(t, root, path, text)
	if err := os.Chtimes(filepath.Join(root, path), hourAgo, hourAgo); err != nil {
		t.Fatal(err)
	}
}

func runGit(t *testing.T, folder string, arguments ...string) {
	t.Helper()
	if output, err := exec.Command("git", append([]string{"-C", folder}, arguments...)...).CombinedOutput(); err != nil {
		t.Skipf("git is not at hand: %s", output)
	}
}

func committedRepository(t *testing.T, folder string) {
	t.Helper()
	runGit(t, folder, "init", "-q")
	runGit(t, folder, "add", ".")
	runGit(t, folder, "-c", "user.name=a", "-c", "user.email=a@b", "commit", "-qm", "first")
}

// outerProject is a project folder that is no repository and holds a journal, a loose file and two inner repositories,
// tako and site, each with a committed file; it returns the journal's folder.
func outerProject(t *testing.T) (project, home string) {
	t.Helper()
	project = t.TempDir()
	home = filepath.Join(project, ".journal")
	writeOldFile(t, project, ".journal/journal.db", "rows\n")
	writeOldFile(t, project, "notes.md", "one\ntwo\n")
	writeOldFile(t, project, "tako/src/Tako/Node.cs", "class Node {}\n")
	writeOldFile(t, project, "site/index.html", "<p>old</p>\n")
	committedRepository(t, filepath.Join(project, "tako"))
	committedRepository(t, filepath.Join(project, "site"))
	return project, home
}

func editedOuterProject(t *testing.T, project string) {
	t.Helper()
	writeFile(t, project, "tako/src/Tako/Node.cs", "class Node { int Id; }\n")
	writeFile(t, project, "site/index.html", "<p>new</p>\n<p>more</p>\n")
	writeFile(t, project, "notes.md", "one\n")
}

func expectCounts(t *testing.T, changes []Change, want map[string][3]int) {
	t.Helper()
	got := map[string][3]int{}
	for _, change := range changes {
		existed := 0
		if change.Diff.Existed {
			existed = 1
		}
		got[change.Diff.Path] = [3]int{change.Diff.LinesAdded, change.Diff.LinesRemoved, existed}
	}
	if fmt.Sprint(got) != fmt.Sprint(want) {
		t.Fatalf("want path: [added removed existed] %v, got %v", want, got)
	}
}

// outerEdits are the true counts of editedOuterProject, each file having been there before.
var outerEdits = map[string][3]int{"tako/src/Tako/Node.cs": {1, 1, 1}, "site/index.html": {2, 1, 1}, "notes.md": {0, 1, 1}}

func TestTheScanRootIsTheProjectFolderFromAnyFolderOfTheProject(t *testing.T) {
	project, home := outerProject(t)
	for _, folder := range []string{project, filepath.Join(project, "tako"), filepath.Join(project, "tako", "src", "Tako"), filepath.Join(project, "site"), t.TempDir()} {
		if root := ScanRoot(home, folder); root != project {
			t.Fatalf("from %s the root is %s, want %s", folder, root, project)
		}
	}
}

func TestTheScanRootOfAWorkerIsItsWorktree(t *testing.T) {
	project, home := outerProject(t)
	worktree := filepath.Join(home, "worktrees", "development", "worker-1")
	if err := os.MkdirAll(filepath.Join(worktree, "src"), 0o700); err != nil {
		t.Fatal(err)
	}
	for _, folder := range []string{worktree, filepath.Join(worktree, "src")} {
		if root := ScanRoot(home, folder); root != worktree {
			t.Fatalf("from %s the root is %s, want %s", folder, root, worktree)
		}
	}
	if root := ScanRoot(home, filepath.Join(home, "worktrees")); root != project {
		t.Fatalf("the worktrees folder itself is no worktree: %s", root)
	}
}

func TestAnOuterFolderWithTwoRepositoriesCountsEveryEditFromTheOuterFolder(t *testing.T) {
	project, home := outerProject(t)
	root := ScanRoot(home, project)
	state := StateFolder(home, root)
	if changes := scanned(t, root, state); len(changes) != 0 {
		t.Fatalf("the first scan with no moment named takes the project as it is: %v", changes)
	}
	editedOuterProject(t, project)
	expectCounts(t, scanned(t, root, state), outerEdits)
}

func TestAnEditFromInsideAnInnerRepositoryCountsTheSameAsFromTheOuterFolder(t *testing.T) {
	project, home := outerProject(t)
	root := ScanRoot(home, filepath.Join(project, "tako", "src"))
	if root != project || StateFolder(home, root) != StateFolder(home, ScanRoot(home, project)) {
		t.Fatalf("one root and one state for the whole project, got %s", root)
	}
	state := StateFolder(home, root)
	scanned(t, root, state)
	editedOuterProject(t, project)
	expectCounts(t, scanned(t, root, state), outerEdits)
}

func TestAProjectWithNoRepositoryCountsAnEditAgainstTheTextKeptAtTheFirstScan(t *testing.T) {
	root, state := t.TempDir(), t.TempDir()
	writeOldFile(t, root, "notes.md", "one\ntwo\n")
	writeOldFile(t, root, "plan/steps.md", "a\nb\nc\n")
	scanned(t, root, state)
	writeFile(t, root, "plan/steps.md", "a\nB\nc\n")
	expectCounts(t, scanned(t, root, state), map[string][3]int{"plan/steps.md": {1, 1, 1}})
	writeFile(t, root, "plan/fresh.md", "x\ny\n")
	expectCounts(t, scanned(t, root, state), map[string][3]int{"plan/fresh.md": {2, 0, 0}})
}

func TestTheFirstScanOfAProjectKeepsTheEditThatStartedIt(t *testing.T) {
	project, home := outerProject(t)
	root := ScanRoot(home, project)
	since := time.Now()
	writeFile(t, project, "tako/src/Tako/Node.cs", "class Node { int Id; }\n")
	writeFile(t, project, "site/new.html", "<p>a</p>\n")
	expectCounts(t, mustScan(t, root, StateFolder(home, root), since), map[string][3]int{"tako/src/Tako/Node.cs": {1, 1, 1}, "site/new.html": {1, 0, 0}})
	writeFile(t, project, "notes.md", "one\ntwo\nthree\n")
	expectCounts(t, mustScan(t, root, StateFolder(home, root), since), map[string][3]int{"notes.md": {1, 0, 1}})
}

func mustScan(t *testing.T, root, state string, since time.Time) []Change {
	t.Helper()
	changes, err := Scan(root, state, since)
	if err != nil {
		t.Fatal(err)
	}
	return changes
}

func TestAnInnerRepositorysIgnoreFileHoldsForItsOwnFilesOnly(t *testing.T) {
	project, home := outerProject(t)
	writeOldFile(t, project, "tako/.gitignore", "bin\n/build\n*.log\n")
	root := ScanRoot(home, project)
	state := StateFolder(home, root)
	scanned(t, root, state)
	for _, path := range []string{"tako/bin/Tako.dll.txt", "tako/build/out.txt", "tako/src/run.log", "site/bin/page.txt", "site/build/out.txt", "site/run.log"} {
		writeFile(t, project, path, "a\n")
	}
	expectCounts(t, scanned(t, root, state), map[string][3]int{"site/bin/page.txt": {1, 0, 0}, "site/build/out.txt": {1, 0, 0}, "site/run.log": {1, 0, 0}})
}

func TestAFileOfALineThatChangedManyFilesCountsItsNextEditAgainstItsNewText(t *testing.T) {
	root, state := checkout(t)
	for number := 0; number <= ChangedFilesMost; number++ {
		writeFile(t, root, fmt.Sprintf("file%d.py", number), "A = 1\n")
	}
	scanned(t, root, state)
	writeFile(t, root, "file0.py", "A = 1\nB = 2\n")
	expectOne(t, scanned(t, root, state), "file0.py", 1, 0, true)
}
