package main

import (
	"fmt"
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

func stripped(t *testing.T, line, command string) Options {
	t.Helper()
	setup := options(t, line)
	setup.Stripped = []string{command}
	return setup
}

func TestPartsStripOnlyAListedCommandWhosePipesAllFilter(t *testing.T) {
	cases := []struct {
		name, line, listed, command, filters string
	}{
		{"one filter", "npm test | tail -5", "npm test", "npm test", "tail -5"},
		{"three filters", "go test ./... | grep FAIL | sort | uniq -c", "go test ./...", "go test ./...", "grep FAIL | sort | uniq -c"},
		{"stderr into the pipe", "npm test 2>&1 | tail -5", "npm test 2>&1", "npm test 2>&1", "tail -5"},
		{"not a test or a build", "cat a.log | grep x", "", "", ""},
		{"a read over ssh", "ssh host cat f | head", "", "", ""},
		{"no pipe", "npm test", "npm test", "", ""},
		{"tee does work of its own", "npm test | tee log.txt", "npm test", "", ""},
		{"xargs does work of its own", "npm test | xargs echo", "npm test", "", ""},
		{"a filter before tee", "npm test | tail -5 | tee log.txt", "npm test", "", ""},
		{"a filter that writes a file", "npm test | tail -5 > log.txt", "npm test", "", ""},
		{"sed in place", "npm test | sed -i s/a/b/ f", "npm test", "", ""},
		{"an unknown program", "npm test | summarize", "npm test", "", ""},
		{"a fallback", "npm test | tail -5 || echo failed", "npm test", "", ""},
		{"a part in the background", "npm test | tail -5 &", "npm test", "", ""},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			part := Parts(testCase.line, testCase.listed)[0]
			if part.Command != testCase.command || part.Filters != testCase.filters {
				t.Fatalf("command %q, filters %q", part.Command, part.Filters)
			}
		})
	}
}

func TestEveryFilterProgramIsStripped(t *testing.T) {
	for _, program := range filterPrograms {
		if part := Parts("npm test | "+program, "npm test")[0]; part.Filters != program {
			t.Errorf("%s stayed in the command: %+v", program, part)
		}
	}
}

func TestAPartKeepsTheTextTheAgentWrote(t *testing.T) {
	if part := Parts("npm test | tail -5", "npm test")[0]; part.Text != "npm test | tail -5" {
		t.Fatalf("the text is %q", part.Text)
	}
}

func TestOnlyTheListedPartOfAChainIsStripped(t *testing.T) {
	parts := Parts("cat a | grep x && npm test | tail -5 && git log | head", "npm test")
	if len(parts) != 3 || parts[0].Filters != "" || parts[1].Filters != "tail -5" || parts[2].Filters != "" {
		t.Fatalf("parts %+v", parts)
	}
}

func TestAHereDocumentKeepsItsPipe(t *testing.T) {
	line := "cat <<EOF | tail -1\none\nEOF"
	if part := Parts(line, "cat <<EOF")[0]; part.Filters != "" {
		t.Fatalf("part %+v", part)
	}
}

func TestAStrippedPartStoresTheWholeOutputAndTheAgentGetsItsPipes(t *testing.T) {
	setup := stripped(t, fiveLines+" | tail -2", fiveLines)
	output, code := run(t, setup, newClient())
	if code != 0 || output != "four\nfive\n" {
		t.Fatalf("printed %q with code %d", output, code)
	}
	if text := readFile(t, folderOf(setup)+"/1.out"); text != "one\ntwo\nthree\nfour\nfive\n" {
		t.Fatalf("stored %q", text)
	}
}

func TestSeveralPipesRunInTheirOrderOverTheStoredOutput(t *testing.T) {
	setup := stripped(t, fiveLines+" | grep e | sort | head -1", fiveLines)
	if output, _ := run(t, setup, newClient()); output != "five\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestANotStrippedPipeKeepsTodaysFile(t *testing.T) {
	setup := options(t, fiveLines+" | tail -2")
	output, _ := run(t, setup, newClient())
	if output != "four\nfive\n" || readFile(t, folderOf(setup)+"/1.out") != output || exists(folderOf(setup)+"/1.filtered") {
		t.Fatalf("printed %q", output)
	}
}

func TestTheExitCodeOfAStrippedPartIsItsLastPipes(t *testing.T) {
	cases := []struct {
		line, command string
		code          int
	}{
		{"false | wc -l", "false", 0},
		{"printf x | grep y", "printf x", 1},
		{"printf x | grep x", "printf x", 0},
	}
	for _, testCase := range cases {
		if _, code := run(t, stripped(t, testCase.line, testCase.command), newClient()); code != testCase.code {
			t.Errorf("%s gave code %d", testCase.line, code)
		}
	}
}

func TestAChainGoesOnFromTheCodeOfThePipes(t *testing.T) {
	setup := stripped(t, "false | tail -1 && echo next", "false")
	if output, code := run(t, setup, newClient()); code != 0 || !strings.Contains(output, "next") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestAFailingPipeSkipsTheNextAndPart(t *testing.T) {
	setup := stripped(t, "printf x | grep y && echo next", "printf x")
	if output, code := run(t, setup, newClient()); code != 1 || strings.Contains(output, "next") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestSetEStillRunsThePipesOfAFailedCommand(t *testing.T) {
	setup := stripped(t, "set -e; false | wc -l; echo next", "false")
	if output, _ := run(t, setup, newClient()); !strings.Contains(output, "0") || !strings.Contains(output, "next") {
		t.Fatalf("printed %q", output)
	}
}

func TestACdInAnEarlierPartReachesThePipes(t *testing.T) {
	setup := stripped(t, "cd / && pwd | sed s/x/y/", "pwd")
	if output, _ := run(t, setup, newClient()); output != "/\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestStderrOfTheCommandIsStored(t *testing.T) {
	setup := stripped(t, "echo problem >&2 | wc -l", "echo problem >&2")
	run(t, setup, newClient())
	if text := readFile(t, folderOf(setup)+"/1.out"); text != "problem\n" {
		t.Fatalf("stored %q", text)
	}
}

func movedRun(t *testing.T, command, rest string) (Options, string) {
	t.Helper()
	release := t.TempDir() + "/release"
	waited := fmt.Sprintf("(%s; while [ ! -e %s ]; do :; done)", command, release)
	setup := stripped(t, waited+" "+rest, waited)
	setup.Background = true
	client := newClient()
	output, code := run(t, setup, client)
	if code != 0 {
		t.Fatalf("code %d, printed %q", code, output)
	}
	if err := os.WriteFile(release, nil, 0o644); err != nil {
		t.Fatal(err)
	}
	waitForReportedEnd(t, client)
	return setup, output
}

func waitForReportedEnd(t *testing.T, client *recordingClient) {
	t.Helper()
	waitFor(t, 10*secondInTest, "the report of the end", func() bool {
		return strings.Contains(strings.Join(client.reported(), "\n"), "process end 4")
	})
}

func TestAMovedRunKeepsTheWholeOutputAndTheChainGoesTheWayTheAgentWrote(t *testing.T) {
	marker := t.TempDir() + "/marker"
	setup, _ := movedRun(t, "echo passed", fmt.Sprintf("| grep -q FAILED && touch %s", marker))
	if exists(marker) {
		t.Fatal("the chain went on although the pipe found nothing")
	}
	if readFile(t, folderOf(setup)+"/1.out") != "passed\n" {
		t.Fatal("the whole output is gone")
	}
}

func TestAMovedChainGoesOnWhenThePipeFindsItsLine(t *testing.T) {
	marker := t.TempDir() + "/marker"
	movedRun(t, "echo FAILED", fmt.Sprintf("| grep -q FAILED && touch %s", marker))
	if !exists(marker) {
		t.Fatal("the chain stopped although the pipe found its line")
	}
}

func TestTheCodeOfAMovedRunIsThatOfItsPipes(t *testing.T) {
	setup, _ := movedRun(t, "echo passed", "| grep -q FAILED")
	if code, _ := NewFolder(setup.Home, setup.Process).End(); code != 1 {
		t.Fatalf("code %d", code)
	}
}

func TestARunThatMovesTellsTheAgentNothingOfTheUnpipedOutput(t *testing.T) {
	setup, output := movedRun(t, "echo secret", "| tail -1")
	if strings.Contains(output, "secret") || !strings.Contains(output, "moved to the background") {
		t.Fatalf("printed %q", output)
	}
	if readFile(t, folderOf(setup)+"/1.out") != "secret\n" {
		t.Fatal("the whole output is gone")
	}
}

func TestTheAgentsCapStillCutsWhatThePipesPrint(t *testing.T) {
	setup := stripped(t, "seq 1 500 | tail -400", "seq 1 500")
	setup.CapCharacters = 100
	output, _ := run(t, setup, newClient())
	if len(output) > 200 || !strings.Contains(output, "journal output read 4 --piped") {
		t.Fatalf("printed %d characters: %q", len(output), output)
	}
}

func TestTheOutputSizeNamesTheFileTheAgentReads(t *testing.T) {
	setup := stripped(t, "seq 1 500 | tail -400", "seq 1 500")
	setup.CapCharacters = 100
	output, _ := run(t, setup, newClient())
	if !strings.Contains(output, "output 4 is 400 lines") {
		t.Fatalf("printed %q", output)
	}
}

func TestSizesCountTheWholeStoredOutput(t *testing.T) {
	setup := stripped(t, "seq 1 500 | tail -1", "seq 1 500")
	client := newClient()
	run(t, setup, client)
	if !strings.Contains(strings.Join(client.reported(), "\n"), "--lines 500") {
		t.Fatalf("reported %q", client.reported())
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

func TestARunningCommandIsCutAndKeepsGoingToItsEnd(t *testing.T) {
	release := t.TempDir() + "/release"
	setup := options(t, fmt.Sprintf("seq 1 400000; while [ ! -e %s ]; do :; done; echo finished", release))
	setup.Line = fmt.Sprintf("(seq 1 400000; while [ ! -e %s ]; do :; done; echo finished)", release)
	setup.MostOutputBytes = 100000
	setup.Background = true
	client := newClient()
	if output, code := run(t, setup, client); code != 0 {
		t.Fatalf("printed %q with code %d", output, code)
	}
	waitFor(t, 10*secondInTest, "the first cut", func() bool {
		text, _ := os.ReadFile(folderOf(setup) + "/1.out")
		return strings.HasPrefix(string(text), cutLine)
	})
	if err := os.WriteFile(release, nil, 0o644); err != nil {
		t.Fatal(err)
	}
	waitForReportedEnd(t, client)
	text := readFile(t, folderOf(setup)+"/1.out")
	if !strings.HasPrefix(text, cutLine) || !strings.HasSuffix(text, "400000\nfinished\n") {
		t.Fatalf("stored %d characters ending %q", len(text), text[len(text)-30:])
	}
}

func TestOnlyTheEndOfAHugeOutputIsReadIntoMemory(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", mostReadBytes+10)+"\nthe end\n")
	text, size := folder.Result(1, mostReadBytes)
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

func TestAStrippedPartRunsItsCommandAndThenItsFiltersInTheScript(t *testing.T) {
	script := Script([]Part{{Text: "make | tail -5", Command: "make", Filters: "tail -5", Position: 1}}, "/folder")
	if strings.Contains(script, "make | tail") {
		t.Fatalf("the script runs the pipe with the command: %s", script)
	}
	checks := []string{"( make\n", "> '/folder/1.command'", "{ tail -5\n", "< '/folder/1.stdout' >> '/folder/1.filtered'"}
	for _, check := range checks {
		if !strings.Contains(script, check) {
			t.Errorf("no %q in %s", check, script)
		}
	}
}

func TestTheOutputPipesLiveOutsideTheRunFolder(t *testing.T) {
	script := Script([]Part{{Text: "make | tail -5", Command: "make", Filters: "tail -5", Position: 1}}, "/folder")
	if strings.Contains(script, ".fifo") || !strings.Contains(script, `"${TMPDIR:-/tmp}/journal-run-$$-1"`) {
		t.Fatalf("script %s", script)
	}
}

func TestVariablesCarryTheStrippedCommandsAndTheOutputLimit(t *testing.T) {
	t.Setenv(strippedVariable, "npm test"+strippedSeparator+"make")
	t.Setenv(mostOutputVariable, "1024")
	setup := Flags{}.runOptions("/home", "/bin/sh")
	if fmt.Sprint(setup.Stripped) != "[npm test make]" || setup.MostOutputBytes != 1024 {
		t.Fatalf("options %+v", setup)
	}
	if os.Getenv(strippedVariable) != "" || os.Getenv(mostOutputVariable) != "" {
		t.Fatal("a run inside this one would inherit them")
	}
}

func TestNoVariablesMeanNothingStrippedAndTheDefaultLimit(t *testing.T) {
	if stripped, most := outputSettings(); stripped != nil || most != 0 {
		t.Fatalf("stripped %v, most %d", stripped, most)
	}
}

func TestParsingEdgeCasesOfAStrippedPipeline(t *testing.T) {
	cases := []struct {
		name, line, listed, command, filters string
	}{
		{"a pipe inside quotes is no pipe", "npm test -t 'a|b'", "npm test -t 'a|b'", "", ""},
		{"a quoted pipe before a real one", "npm test -t 'a|b' | tail -1", "npm test -t 'a|b'", "npm test -t 'a|b'", "tail -1"},
		{"a quoted pipe inside the filter", "npm test | grep 'a|b'", "npm test", "npm test", "grep 'a|b'"},
		{"a pipe at the end of a line", "npm test |\n  tail -1", "npm test", "npm test", "tail -1"},
		{"a pipe of stderr too", "npm test |& tail -1", "npm test", "npm test", "tail -1"},
		{"a subshell", "(npm test) | tail -1", "(npm test)", "(npm test)", "tail -1"},
		{"a dropped stderr", "npm test 2>/dev/null | tail -1", "npm test 2>/dev/null", "npm test", "tail -1"},
		{"a variable before the command", "CI=1 npm test | tail -1", "CI=1 npm test", "CI=1 npm test", "tail -1"},
		{"a variable before a filter", "npm test | LC_ALL=C sort", "npm test", "", ""},
		{"sed in place written apart", "npm test | sed -e s/a/b/ -i f", "npm test", "", ""},
		{"sed that only prints", "npm test | sed -n 1,5p", "npm test", "npm test", "sed -n 1,5p"},
		{"awk that prints", "npm test | awk '{print $1}'", "npm test", "npm test", "awk '{print $1}'"},
		{"an unlisted spelling", "npm  test | tail -1", "npm test", "", ""},
		{"nothing listed", "npm test | tail -1", "", "", ""},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			part := Parts(testCase.line, testCase.listed)[0]
			if part.Command != testCase.command || part.Filters != testCase.filters {
				t.Fatalf("command %q, filters %q", part.Command, part.Filters)
			}
		})
	}
}

func TestAQuotedPipeRunsAsTheAgentWroteIt(t *testing.T) {
	setup := stripped(t, "printf 'a|b\\nc\\n' | grep 'a|b'", `printf 'a|b\nc\n'`)
	if output, _ := run(t, setup, newClient()); output != "a|b\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAnEmptyOutputGivesAnEmptyResult(t *testing.T) {
	setup := stripped(t, "true | tail -1", "true")
	if output, code := run(t, setup, newClient()); output != "" || code != 0 {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestAnOutputWithNoLastNewlineIsStoredAsItIs(t *testing.T) {
	setup := stripped(t, "printf last | tail -1", "printf last")
	output, _ := run(t, setup, newClient())
	if output != "last" || readFile(t, folderOf(setup)+"/1.out") != "last" {
		t.Fatalf("printed %q", output)
	}
}

func TestBytesThatAreNoTextPassUntouched(t *testing.T) {
	setup := stripped(t, `printf '\377\376\n' | cat`, `printf '\377\376\n'`)
	if output, _ := run(t, setup, newClient()); output != "\xff\xfe\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAFilterThatFailsReachesTheAgent(t *testing.T) {
	setup := stripped(t, "true | sed 'not a command'", "true")
	output, code := run(t, setup, newClient())
	if code == 0 || output == "" {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestASemicolonGoesOnAfterAFilterFindsNothing(t *testing.T) {
	setup := stripped(t, "printf x | grep y; echo next", "printf x")
	if output, code := run(t, setup, newClient()); output != "next\n" || code != 0 {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestEachStrippedPartHasItsOwnFiles(t *testing.T) {
	setup := options(t, "printf 'a\\nb\\n' | tail -1; printf 'c\\nd\\n' | tail -1")
	setup.Stripped = []string{`printf 'a\nb\n'`, `printf 'c\nd\n'`}
	output, _ := run(t, setup, newClient())
	if output != "b\nd\n" || readFile(t, folderOf(setup)+"/1.out") != "a\nb\n" || readFile(t, folderOf(setup)+"/3.out") != "c\nd\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestOnlyTheListedPartOfARunIsStoredWhole(t *testing.T) {
	setup := options(t, "printf 'a\\nb\\n' | tail -1 && printf 'c\\nd\\n' | tail -1")
	setup.Stripped = []string{`printf 'c\nd\n'`}
	output, _ := run(t, setup, newClient())
	if output != "b\nd\n" || readFile(t, folderOf(setup)+"/1.out") != "b\n" || readFile(t, folderOf(setup)+"/3.out") != "c\nd\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAVariableOfTheLineReachesThePipes(t *testing.T) {
	setup := stripped(t, "N=2; seq 1 5 | tail -$N", "seq 1 5")
	if output, _ := run(t, setup, newClient()); output != "4\n5\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAJournalCommandIsNeverListedSoItKeepsItsPipe(t *testing.T) {
	if part := Parts("journal task list | tail -1")[0]; part.Filters != "" {
		t.Fatalf("part %+v", part)
	}
}

func TestAPartOfAChainThatFailsLeavesNoFilteredFileBehindTheNext(t *testing.T) {
	setup := stripped(t, "false && printf x | tail -1", "printf x")
	if _, code := run(t, setup, newClient()); code != 1 || exists(folderOf(setup)+"/2.filtered") {
		t.Fatalf("code %d", code)
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

func TestAResultPrefersWhatThePipesPrinted(t *testing.T) {
	folder := outputFolder(t, "whole\n")
	if err := os.WriteFile(folder.filteredPath(1), []byte("cut\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if text, size := folder.Result(1, mostReadBytes); text != "cut\n" || size.Bytes != 4 {
		t.Fatalf("result %q, size %+v", text, size)
	}
}

func TestAnEmptyPipeResultIsNotReplacedByTheWholeOutput(t *testing.T) {
	folder := outputFolder(t, "whole\n")
	if err := os.WriteFile(folder.filteredPath(1), nil, 0o644); err != nil {
		t.Fatal(err)
	}
	if text, _ := folder.Result(1, mostReadBytes); text != "" {
		t.Fatalf("result %q", text)
	}
}

func TestSetEStopsAtAPipeThatFails(t *testing.T) {
	setup := stripped(t, "set -e; printf x | grep y; echo next", "printf x")
	output, code := run(t, setup, newClient())
	if code == 0 || strings.Contains(output, "next") {
		t.Fatalf("printed %q with code %d", output, code)
	}
}

func TestPipefailKeepsTheWholeLineAsWritten(t *testing.T) {
	setup := stripped(t, "set -o pipefail; false | tail -1 && echo next", "false")
	shell := setup.Shell
	setup.Shell = "/bin/bash"
	if part := Parts(setup.Line, setup.Stripped...)[1]; part.Filters != "" {
		t.Fatalf("part %+v", part)
	}
	if output, code := run(t, setup, newClient()); code == 0 || strings.Contains(output, "next") {
		t.Fatalf("printed %q with code %d, shell %s", output, code, shell)
	}
}

func TestFormsThatAreNoFiltersKeepTheirPipe(t *testing.T) {
	lines := []string{
		"npm test | tail -f", "npm test | tail -F", "npm test | tail -n5 -f", "npm test | tail --follow",
		"npm test | sort -o results.txt", "npm test | sort --output=results.txt", "npm test | sed 's/a/b/w log'",
		"npm test | sed --in-place s/a/b/ f", "npm test | sed -ni s/a/b/ f",
		"npm test | awk '{system(\"rm x\")}'", "npm test | awk '{print | \"sh\"}'",
	}
	for _, line := range lines {
		if part := Parts(line, "npm test")[0]; part.Filters != "" {
			t.Errorf("%s was stripped: %+v", line, part)
		}
	}
}

func TestPlainFormsOfThoseProgramsAreFilters(t *testing.T) {
	lines := []string{"npm test | tail -n 5", "npm test | tail -5", "npm test | sort -u", "npm test | sed 's/a/b/g'", "npm test | sed -n 1,5p", "npm test | awk '{print $1}'"}
	for _, line := range lines {
		if part := Parts(line, "npm test")[0]; part.Filters == "" {
			t.Errorf("%s kept its pipe", line)
		}
	}
}

func TestAWatchCommandKeepsItsPipe(t *testing.T) {
	for _, line := range []string{"npm run build -- --watch | head -20", "vitest -w | head -20"} {
		listed := strings.TrimSpace(strings.Split(line, "|")[0])
		if part := Parts(line, listed)[0]; part.Filters != "" {
			t.Errorf("%s was stripped", line)
		}
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

func TestAPartAfterAPipeWritesTheFileItsReaderOpens(t *testing.T) {
	setup := stripped(t, "printf 'a\\nb\\n' | wc -l && "+fiveLines+" | tail -1", fiveLines)
	output, code := run(t, setup, newClient())
	if code != 0 || !strings.HasSuffix(output, "five\n") {
		t.Fatalf("printed %q with code %d", output, code)
	}
	if !strings.Contains(readFile(t, folderOf(setup)+"/3.out"), "one") || exists(folderOf(setup)+"/2.out") {
		t.Fatal("the test's output is not in the file of its position")
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

func TestAFailedCommandWhosePipesPrintNothingNamesItsOutput(t *testing.T) {
	setup := stripped(t, "(echo build error; false) | grep FAIL", "(echo build error; false)")
	output, _ := run(t, setup, newClient())
	if !strings.Contains(output, "journal output read 4 --summary") || !strings.Contains(readFile(t, folderOf(setup)+"/1.out"), "build error") {
		t.Fatalf("printed %q", output)
	}
}

func TestAFailedCommandsStderrPassesItsPipes(t *testing.T) {
	setup := stripped(t, "(echo build error >&2; false) | grep FAIL", "(echo build error >&2; false)")
	if output, _ := run(t, setup, newClient()); output != "build error\n" {
		t.Fatalf("printed %q", output)
	}
}

func TestAPassingCommandWhosePipesPrintNothingStaysSilent(t *testing.T) {
	setup := stripped(t, "true | grep FAIL", "true")
	if output, _ := run(t, setup, newClient()); output != "" {
		t.Fatalf("printed %q", output)
	}
}

func TestAJournalLineReadsMoreThanTheCappedEnd(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", mostReadBytes+10))
	if text, _ := folder.Result(1, DefaultMostOutputBytes); len(text) != mostReadBytes+10 {
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

func TestTheFileAFinishedCommandsPipesReadIsNotCut(t *testing.T) {
	folder := outputFolder(t, strings.Repeat("x", 500))
	stdout := filepath.Join(folder.Path, "1."+stdoutSuffix)
	if err := os.WriteFile(stdout, []byte(strings.Repeat("x", 500)), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(folder.Path, "1."+commandSuffix), []byte("0"), 0o644); err != nil {
		t.Fatal(err)
	}
	folder.CutOutput(1, 100)
	if len(readFile(t, stdout)) != 500 || !strings.HasPrefix(folder.Output(1), cutLine) {
		t.Fatalf("stdout %d bytes, output %d bytes", len(readFile(t, stdout)), len(folder.Output(1)))
	}
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

func TestPipefailInEverySpellingKeepsThePipe(t *testing.T) {
	for _, line := range []string{"set -o pipefail; npm test | tail -1", "setopt PIPE_FAIL; npm test | tail -1", "setopt pipe_fail; npm test | tail -1"} {
		parts := Parts(line, "npm test")
		if parts[len(parts)-1].Filters != "" {
			t.Errorf("%s was stripped", line)
		}
	}
}

func TestEveryWatchSpellingKeepsItsPipe(t *testing.T) {
	for _, command := range []string{"jest --watchAll", "npm run test:watch", "tsc --watch", "vitest watch", "cargo watch -x test"} {
		if part := Parts(command+" | head -20", command)[0]; part.Filters != "" {
			t.Errorf("%s was stripped", command)
		}
	}
}
