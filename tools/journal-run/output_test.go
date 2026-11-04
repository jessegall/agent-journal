package main

import (
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

const fiveLines = `printf 'one\ntwo\nthree\nfour\nfive\n'`

func TestAPartKeepsTheTextTheAgentWrote(t *testing.T) {
	if part := Parts("npm test | tail -5")[0]; part.Text != "npm test | tail -5" {
		t.Fatalf("the text is %q", part.Text)
	}
}

func TestSizesCountALastLineWithNoNewline(t *testing.T) {
	path := t.TempDir() + "/1.out"
	if err := os.WriteFile(path, []byte("one\ntwo"), 0o644); err != nil {
		t.Fatal(err)
	}
	if size := fileSize(path); size.Lines != 2 || size.Bytes != 7 {
		t.Fatalf("size %+v", size)
	}
}

func TestAMissingFileHasNoSize(t *testing.T) {
	if size := fileSize(t.TempDir() + "/none"); size != (OutputSize{}) {
		t.Fatalf("size %+v", size)
	}
}

func outputFolder(t *testing.T, text string) Folder {
	t.Helper()
	folder := Folder{Path: t.TempDir()}
	if err := os.WriteFile(folder.outputPath(1), []byte(text), 0o644); err != nil {
		t.Fatal(err)
	}
	return folder
}

func TestAnOutputUnderTheLimitIsNotCut(t *testing.T) {
	folder := outputFolder(t, "short\n")
	folder.CutOutput(1, 100)
	if folder.Output(1) != "short\n" {
		t.Fatalf("output %q", folder.Output(1))
	}
}

func TestAnOutputPastTheLimitKeepsItsEndAndSaysItWasCut(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("old\n", 100)+"the last line\n")
	folder.CutOutput(1, 100)
	if text := folder.Output(1); len(text) > 150 || !strings.HasPrefix(text, cutLine) || !strings.HasSuffix(text, "the last line\n") {
		t.Fatalf("output %q", text)
	}
}

func TestNoLimitCutsNothing(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("old\n", 100))
	folder.CutOutput(1, 0)
	if len(folder.Output(1)) != 400 {
		t.Fatal("a limit of 0 cut the output")
	}
}

func TestACommandStillRunningGoesOnWritingAfterACut(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("old\n", 100))
	writer, err := os.OpenFile(folder.outputPath(1), os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		t.Fatal(err)
	}
	defer writer.Close()
	folder.CutOutput(1, 100)
	if _, err := writer.WriteString("after the cut\n"); err != nil {
		t.Fatal(err)
	}
	if text := folder.Output(1); !strings.HasSuffix(text, "old\nafter the cut\n") || len(text) > 150 {
		t.Fatalf("output %q", text)
	}
}

func TestOnlyTheEndOfAHugeOutputIsReadIntoMemory(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", mostReadBytes+10)+"\nthe end\n")
	text, size := folder.OutputEnd(1, mostReadBytes)
	if len(text) != mostReadBytes || !strings.HasSuffix(text, "the end\n") || size.Bytes != mostReadBytes+19 {
		t.Fatalf("read %d characters, size %+v", len(text), size)
	}
}

func TestTheScriptAppendsSoACutFileKeepsItsEnd(t *testing.T) {
	script := Script([]Part{{Text: "make", Position: 1}, {Text: "make", JoinedBy: "&&", Position: 2}}, "/folder")
	if strings.Count(script, ">> '/folder/") != 2 {
		t.Fatalf("script %s", script)
	}
}

func TestPythonWritesEachLineAsItComesUnlessTheLineChoseOtherwise(t *testing.T) {
	if output, _ := run(t, options(t, `printf '%s' "$PYTHONUNBUFFERED"`), newClient()); output != "1" {
		t.Fatalf("printed %q", output)
	}
	t.Setenv(unbufferedPython, "")
	if output, _ := run(t, options(t, `printf '%s' "[$PYTHONUNBUFFERED]"`), newClient()); output != "[]" {
		t.Fatalf("printed %q", output)
	}
}

func TestAMovedFollowerKeepsTheOutputLimit(t *testing.T) {
	flags, err := ParseFlags([]string{"--follow", "--process", "4", "--folder", "/home", "--parts", "1", "--most-output", "2048"})
	if err != nil || flags.MostOutput != 2048 {
		t.Fatalf("flags %+v, error %v", flags, err)
	}
}

func TestAnOutputOfExactlyTheLimitIsNotCut(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", 100))
	folder.CutOutput(1, 100)
	if strings.HasPrefix(folder.Output(1), cutLine) {
		t.Fatal("an output of the limit was cut")
	}
}

func TestAMissingOutputIsNotCut(t *testing.T) {
	folder := Folder{Path: t.TempDir()}
	folder.CutOutput(1, 100)
	if exists(folder.outputPath(1)) {
		t.Fatal("a cut made a file")
	}
}

func TestAnOutputCutTwiceSaysItOnceAtItsStart(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("old\n", 100))
	folder.CutOutput(1, 100)
	if file, err := os.OpenFile(folder.outputPath(1), os.O_WRONLY|os.O_APPEND, 0o644); err == nil {
		_, _ = file.WriteString(strings.Repeat("new\n", 100))
		file.Close()
	}
	folder.CutOutput(1, 100)
	if text := folder.Output(1); !strings.HasPrefix(text, cutLine) || strings.Count(text, cutLine) != 1 {
		t.Fatalf("output %q", text)
	}
}

func TestAPartIsNumberedByItsFirstCommand(t *testing.T) {
	parts := Parts("ls | wc -l && npm test | tail -5 && git status")
	if len(parts) != 3 || parts[0].Position != 1 || parts[1].Position != 3 || parts[2].Position != 5 {
		t.Fatalf("parts %+v", parts)
	}
	if PartCount(parts) != 5 {
		t.Fatalf("count %d", PartCount(parts))
	}
}

func TestPartsAreReportedByThePositionTheJournalKnows(t *testing.T) {
	client := newClient()
	run(t, options(t, "printf a | cat && echo next"), client)
	if reported := strings.Join(client.reported(), "\n"); !strings.Contains(reported, "--position 3") || strings.Contains(reported, "--position 2") {
		t.Fatalf("reported %s", reported)
	}
}

func TestTheAgentGetsPartsInOrderHoweverFastTheShellRuns(t *testing.T) {
	for attempt := 0; attempt < 20; attempt++ {
		setup := options(t, "echo one; echo two; echo three")
		if output, _ := run(t, setup, newClient()); output != "one\ntwo\nthree\n" {
			t.Fatalf("printed %q", output)
		}
	}
}

func TestAJournalLineReadsMoreThanTheCappedEnd(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", mostReadBytes+10))
	if text, _ := folder.OutputEnd(1, DefaultMostOutputBytes); len(text) != mostReadBytes+10 {
		t.Fatalf("read %d characters", len(text))
	}
}

func TestACutKeepsTheBytesItDropped(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", 500))
	folder.CutOutput(1, 100)
	folder.CutOutput(1, 100)
	if text := readFile(t, filepath.Join(folder.Path, "1."+cutBytesSuffix)); text != strconv.Itoa(500-50-len(cutLine)) {
		t.Fatalf("the cut bytes are %s", text)
	}
}

func TestAPartLeftBehindIsCutWhileItsGroupLives(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", 500))
	sleeper := exec.Command("/bin/sh", "-c", "read line")
	sleeper.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	stdin, err := sleeper.StdinPipe()
	if err != nil {
		t.Fatal(err)
	}
	if err := sleeper.Start(); err != nil {
		t.Fatal(err)
	}
	if err := folder.WritePid(sleeper.Process.Pid); err != nil {
		t.Fatal(err)
	}
	tracker := Tracker{Options: Options{MostOutputBytes: 100}, Folder: folder, Parts: 1}
	stopped := make(chan struct{})
	go func() {
		tracker.KeepCutting()
		close(stopped)
	}()
	waitFor(t, 5*time.Second, "the cut", func() bool { return strings.HasPrefix(folder.Output(1), cutLine) })
	stdin.Close()
	_ = sleeper.Wait()
	bounded(t, 5*time.Second, func() { <-stopped })
}

func TestAFollowerCutsAGrowingOutput(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("old\n", 100))
	if err := os.WriteFile(folder.Path+"/1.started", nil, 0o644); err != nil {
		t.Fatal(err)
	}
	tracker := Tracker{Options: Options{Process: 4, MostOutputBytes: 100}, Client: newClient(), Folder: folder, Parts: 1, Reported: map[int]bool{}}
	tracker.reportParts(io.Discard)
	if !strings.HasPrefix(folder.Output(1), cutLine) {
		t.Fatal("a follower did not cut")
	}
}

func TestAnEndedPartIsShownToTheAgent(t *testing.T) {
	folder := outputFolder(t, "whole\n")
	if err := os.WriteFile(folder.Path+"/1.status", []byte("0"), 0o644); err != nil {
		t.Fatal(err)
	}
	var shown strings.Builder
	tracker := Tracker{Options: Options{Process: 4, CapCharacters: 100, LimitSeconds: 15}, Client: newClient(), Folder: folder, Parts: 1, Reported: map[int]bool{}}
	tracker.reportParts(&shown)
	if shown.String() != "whole\n" {
		t.Fatalf("shown %q", shown.String())
	}
}

func TestTheFirstCommandOfAnEvalLineKeepsItsOwnPosition(t *testing.T) {
	parts := Parts("cd /x && eval 'npm test'")
	if len(parts) < 2 || parts[0].Position == parts[1].Position {
		t.Fatalf("parts %+v", parts)
	}
}

func TestPartsAreNumberedAsTheHookNumbersItsCommands(t *testing.T) {
	commands, _, err := shell.Split("cd /x && eval 'npm test' && ls | wc -l")
	if err != nil {
		t.Fatal(err)
	}
	parts := Parts("cd /x && eval 'npm test' && ls | wc -l")
	if PartCount(parts) > len(commands) {
		t.Fatalf("parts %+v against %d commands", parts, len(commands))
	}
}

func TestThePartsFileHasALinePerPositionSoEveryOutputCanBeFound(t *testing.T) {
	setup := options(t, "printf a | cat && echo next")
	run(t, setup, newClient())
	if lines := strings.Split(readFile(t, folderOf(setup)+"/parts"), "\n"); len(lines) != 3 || lines[2] != "echo next" {
		t.Fatalf("parts %q", lines)
	}
}
