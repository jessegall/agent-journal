package host

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"journal-agent/client"
)

// projectFixture makes a project folder with a folder, two files, a hidden .git folder, a symlink inside the project
// and one pointing outside it.
func projectFixture(t *testing.T) ProjectReader {
	t.Helper()
	outside := t.TempDir()
	root := t.TempDir()
	write := func(path, content string) {
		full := filepath.Join(root, path)
		if err := os.MkdirAll(filepath.Dir(full), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(full, []byte(content), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	write("src/main.go", "package main\n")
	write("README.md", "hello\n")
	write(".git/config", "secret\n")
	if err := os.WriteFile(filepath.Join(outside, "secret.txt"), []byte("outside\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(filepath.Join(outside, "secret.txt"), filepath.Join(root, "escape.txt")); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(filepath.Join(root, "README.md"), filepath.Join(root, "inside.md")); err != nil {
		t.Fatal(err)
	}
	return ProjectReader{Root: root}
}

func folderRead(path string, limit int) client.ProjectRead {
	return client.ProjectRead{ID: "read", Type: client.ProjectReadDirectory, Path: path, EntriesLimit: limit, TextLimit: 100}
}

func fileRead(path string, limit int) client.ProjectRead {
	return client.ProjectRead{ID: "read", Type: client.ProjectReadFile, Path: path, EntriesLimit: 10, TextLimit: limit}
}

func TestTheRootListsFoldersFirstAndHidesTheGitFolder(t *testing.T) {
	report := projectFixture(t).Answer(folderRead("", 10))

	var names []string
	for _, entry := range report.Entries {
		names = append(names, entry.Name)
	}
	if strings.Join(names, ",") != "src,README.md,escape.txt,inside.md" || !report.Entries[0].IsFolder {
		t.Fatalf("listed %v", report.Entries)
	}
	if report.Entries[1].Size != 6 || report.Failure != "" || report.Truncated {
		t.Fatalf("report %+v", report)
	}
}

func TestAListingStopsAtItsLimitAndSaysItWasCut(t *testing.T) {
	report := projectFixture(t).Answer(folderRead("", 2))

	if len(report.Entries) != 2 || !report.Truncated {
		t.Fatalf("report %+v", report)
	}
}

func TestAFileReadAnswersItsTextDigestAndSize(t *testing.T) {
	report := projectFixture(t).Answer(fileRead("src/main.go", 100))

	if report.Text == nil || *report.Text != "package main\n" || len(report.Digest) != 64 || *report.Size != 13 {
		t.Fatalf("report %+v", report)
	}
}

func TestAPathThatLeavesTheRootIsOutside(t *testing.T) {
	reader := projectFixture(t)
	for _, path := range []string{"../secret.txt", "/etc/passwd", "escape.txt", ".git/config", "src/../../x"} {
		if report := reader.Answer(fileRead(path, 100)); report.Failure != ProjectReadOutside {
			t.Fatalf("%s gave %+v", path, report)
		}
	}
}

func TestASymlinkInsideTheRootIsRead(t *testing.T) {
	report := projectFixture(t).Answer(fileRead("inside.md", 100))

	if report.Text == nil || *report.Text != "hello\n" {
		t.Fatalf("report %+v", report)
	}
}

func TestAMissingPathAndTheWrongTypeAreNamed(t *testing.T) {
	reader := projectFixture(t)

	if report := reader.Answer(fileRead("nothing.txt", 100)); report.Failure != ProjectReadMissing {
		t.Fatalf("missing gave %+v", report)
	}
	if report := reader.Answer(fileRead("src", 100)); report.Failure != ProjectReadNotFile {
		t.Fatalf("a folder read as a file gave %+v", report)
	}
	if report := reader.Answer(folderRead("README.md", 10)); report.Failure != ProjectReadNotDirectory {
		t.Fatalf("a file read as a folder gave %+v", report)
	}
}

func TestALongFileIsCutAtARuneAndMarkedCut(t *testing.T) {
	reader := projectFixture(t)
	if err := os.WriteFile(filepath.Join(reader.Root, "long.txt"), []byte("abé"), 0o644); err != nil {
		t.Fatal(err)
	}

	report := reader.Answer(fileRead("long.txt", 3))

	if report.Text == nil || *report.Text != "ab" || !report.Truncated || *report.Size != 4 {
		t.Fatalf("report %+v", report)
	}
}

func TestAFileWithANulByteIsBinary(t *testing.T) {
	reader := projectFixture(t)
	if err := os.WriteFile(filepath.Join(reader.Root, "image.bin"), []byte{'P', 'N', 0, 'G'}, 0o644); err != nil {
		t.Fatal(err)
	}

	if report := reader.Answer(fileRead("image.bin", 100)); report.Failure != ProjectReadBinary {
		t.Fatalf("report %+v", report)
	}
}

func TestAHostWithoutAProjectAnswersUnreadable(t *testing.T) {
	if report := (ProjectReader{}).Answer(folderRead("", 10)); report.Failure != ProjectReadUnreadable {
		t.Fatalf("report %+v", report)
	}
}
