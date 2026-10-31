package launch

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func logLines(t *testing.T, path string) []string {
	t.Helper()
	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return strings.Split(strings.TrimSuffix(string(content), "\n"), "\n")
}

func TestTheTerminalLogNumbersEachLineWithoutItsColoursAndKeepsTheLastLines(t *testing.T) {
	path := filepath.Join(t.TempDir(), "terminals", "16.log")
	log, err := OpenTerminalLog(path)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Fprint(log, "\x1b[32mready\x1b[0m\r\nhalf")
	fmt.Fprint(log, " a line\n")
	for number := 3; number <= TerminalLineLimit+10; number++ {
		fmt.Fprintf(log, "line %d\n", number)
	}
	if err := log.Close(); err != nil {
		t.Fatal(err)
	}
	lines := logLines(t, path)
	if len(lines) != TerminalLineLimit || lines[0] != "11\tline 11" || lines[len(lines)-1] != fmt.Sprintf("%d\tline %d", TerminalLineLimit+10, TerminalLineLimit+10) {
		t.Fatalf("the log kept %d lines, from %q to %q", len(lines), lines[0], lines[len(lines)-1])
	}
	short := filepath.Join(t.TempDir(), "17.log")
	log, _ = OpenTerminalLog(short)
	fmt.Fprint(log, "\x1b[32mready\x1b[0m\r\nhalf")
	fmt.Fprint(log, " a line\n")
	log.Close()
	if lines := logLines(t, short); len(lines) != 2 || lines[0] != "1\tready" || lines[1] != "2\thalf a line" {
		t.Fatalf("the log holds %q", lines)
	}
}

func TestAProgramRunsInAPseudoTerminalAndItsOutputReachesTheLog(t *testing.T) {
	path := filepath.Join(t.TempDir(), "16.log")
	log, err := OpenTerminalLog(path)
	if err != nil {
		t.Fatal(err)
	}
	var screen bytes.Buffer
	command := exec.Command("sh", "-c", `test -t 1 && echo "in a terminal"; echo done`)
	if err := RunInTerminal(command, strings.NewReader(""), &screen, log); err != nil {
		t.Fatal(err)
	}
	log.Close()
	lines := logLines(t, path)
	if len(lines) != 2 || lines[0] != "1\tin a terminal" || lines[1] != "2\tdone" || !strings.Contains(screen.String(), "done") {
		t.Fatalf("the log holds %q and the screen %q", lines, screen.String())
	}
}
