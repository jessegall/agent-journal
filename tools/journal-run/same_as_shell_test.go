package main

import (
	"bytes"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"testing"
)

// sameAsShellLines are lines that must print and exit as they do when a shell runs them whole.
var sameAsShellLines = []string{
	"cat <<EOF | grep x\nax\nb\nEOF",
	"cat <<EOF && echo done\nbody\nEOF\necho after",
	"cat <<'EOF' | tr a-z A-Z\nbody\nEOF",
	"echo one &\nwait",
	"echo bg-part & wait; echo fg-part",
	"false; echo \"code=$?\"",
	"(exit 3); echo \"code=$?\"; echo \"code=$?\"",
	"true; echo \"code=$?\"",
	"false || echo fallback; echo next",
	"false && echo skipped; echo \"code=$?\"",
	"false | true; echo \"code=${pipestatus[1]}${PIPESTATUS[0]}\"",
	"eval 'false' || echo fallback-text-that-is-longer",
	"echo piped-long-line-of-text | eval 'cat'",
	"eval 'echo hi' | tr a-z A-Z",
	"true && echo first & wait",
	"x=1; echo \"$x\"",
	"cd /tmp && pwd",
	"(cd /tmp); pwd",
	"echo 'a|b' | cut -d'|' -f2",
	"echo a; # a comment",
	"cat <<'EOF'\nEOF\necho after",
	"cat <<EOF && echo done\nEOF\necho after",
	"cat <<-EOF\n\tEOF\necho after",
	"false && echo skipped || echo fallback",
	"false && echo skipped || echo fallback && echo next",
	"true && false || echo fallback; echo next",
	"true && echo first || echo fallback",
	"foreach ($file in $files) {",
	"and (.signature | length > 0)",
	"echo one\\",
	"echo one; echo two\\",
}

func runThroughShell(t *testing.T, folder, shellPath, line string) (string, int) {
	t.Helper()
	command := exec.Command(shellPath, "-c", line)
	command.Dir = folder
	var output bytes.Buffer
	command.Stdout, command.Stderr = &output, &output
	code := 0
	if err := command.Run(); err != nil {
		exit, isExit := err.(*exec.ExitError)
		if !isExit {
			t.Fatal(err)
		}
		code = exit.ExitCode()
	}
	return output.String(), code
}

func TestALinePrintsAndExitsAsInAShell(t *testing.T) {
	for _, shellPath := range []string{"/bin/zsh", "/bin/bash"} {
		if _, err := os.Stat(shellPath); err != nil {
			continue
		}
		for index, line := range sameAsShellLines {
			t.Run(filepath.Base(shellPath)+" "+line, func(t *testing.T) {
				setup := options(t, line)
				setup.Shell = shellPath
				setup.Home = filepath.Join(os.TempDir(), "journal-run-same-as-shell", strconv.Itoa(os.Getpid()), strconv.Itoa(index), filepath.Base(shellPath), ".journal")
				working := t.TempDir()
				t.Chdir(working)
				want, wantCode := runThroughShell(t, working, shellPath, line)
				output, code := run(t, setup, newClient())
				if comparable(output, working) != comparable(want, working) || code != wantCode {
					t.Fatalf("the runner gave %q, exit %d; the shell gave %q, exit %d", output, code, want, wantCode)
				}
			})
		}
	}
}

func TestAStrippedLinePrintsAndExitsAsInAShell(t *testing.T) {
	cases := []struct{ name, line, listed, want string }{
		{"stderr goes past the pipe", `{ echo out; echo err >&2; } | tr a-z A-Z`, `{ echo out; echo err >&2; }`, "err\nOUT\n"},
		{"jq reads stdout alone", `{ echo '{"ok":1}'; echo progress >&2; } | jq -c . && echo chain-went-on`, `{ echo '{"ok":1}'; echo progress >&2; }`, "progress\n{\"ok\":1}\nchain-went-on\n"},
		{"exec stays in the pipe", `exec echo one | tail -1 && echo next-part`, `exec echo one`, "one\nnext-part\n"},
		{"cd stays in the pipe", `{ cd /; echo moved; } | tail -1; pwd | grep -c '^/$'`, `{ cd /; echo moved; }`, "moved\n0\n"},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			if output, _ := run(t, stripped(t, testCase.line, testCase.listed), newClient()); output != testCase.want {
				t.Fatalf("the runner gave %q", output)
			}
		})
	}
}

func TestAStrippedCommandReportsItsOwnCodeAndTheAgentGetsThePipes(t *testing.T) {
	client := newClient()
	if _, code := run(t, stripped(t, "(exit 3) | tail -1", "(exit 3)"), client); code != 0 {
		t.Fatalf("the agent got exit %d, the pipe's code is 0", code)
	}
	if !slices.Contains(client.reported(), "process part-end 4 --position 1 --exit-code 3") {
		t.Fatalf("the part's own code was not reported: %v", client.reported())
	}
}

func TestADiscardedOutputIsStoredAndNeverShown(t *testing.T) {
	printsBoth := "{ echo out; echo err >&2; }"
	cases := []struct {
		name, line, want string
		code             int
	}{
		{"stdout", printsBoth + " > /dev/null", "err\n", 0},
		{"stderr", printsBoth + " 2>/dev/null", "out\n", 0},
		{"both", printsBoth + " >/dev/null 2>&1", "", 0},
		{"both in one", printsBoth + " &>/dev/null", "", 0},
		{"stderr left on stdout", printsBoth + " 2>&1 >/dev/null", "err\n", 0},
		{"the code stays the command's", "(echo out; exit 3) > /dev/null", "the command failed and its pipes printed nothing: journal output read 4 --summary\n", 3},
		{"before a pipe", printsBoth + " 2>/dev/null | tr a-z A-Z", "OUT\n", 0},
		{"after a pipe", printsBoth + " | tail -1 > /dev/null", "err\n", 0},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			name := strings.TrimSpace(strings.Split(testCase.line, "|")[0])
			setup := stripped(t, testCase.line, name)
			output, code := run(t, setup, newClient())
			if output != testCase.want || code != testCase.code {
				t.Fatalf("printed %q, exit %d", output, code)
			}
			if complete := readFile(t, folderOf(setup)+"/1.out"); !strings.Contains(complete, "out") && !strings.Contains(testCase.line, "exit") {
				t.Fatalf("the complete output is %q", complete)
			}
		})
	}
}

func TestADiscardOnALineNotListedStays(t *testing.T) {
	if part := Parts("cat notes > /dev/null", "npm test")[0]; part.Command != "" {
		t.Fatalf("part %+v", part)
	}
}

func TestPartsKeepWhatAShellMustSeeWhole(t *testing.T) {
	cases := []struct {
		name, line string
		count      int
	}{
		{"an & takes its && chain", "sleep 1 && echo x &", 1},
		{"a here-document keeps the commands on its line", "cat <<EOF && echo done\nbody\nEOF\necho after", 2},
		{"a line reading pipestatus", "false | true; echo ${pipestatus[1]}", 1},
		{"an eval mixed with a pipe", "eval 'echo hi' | tr a-z A-Z", 1},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			if parts := Parts(testCase.line); len(parts) != testCase.count {
				t.Fatalf("parts %+v", parts)
			}
		})
	}
}

func TestEndlessAndWritingFormsKeepTheirPipes(t *testing.T) {
	lines := []string{"rollup -cw | head -1", "gradle build --continuous | head -1", "gradle -t build | head -1", "pytest --looponfail | head -1",
		"pytest -f | head -1", "npm test | tail +1f", "npm test | sed -n 'w /dev/stdout'", "npm test | sed 'w out.txt'", "npm test | sed -n '1w out.txt'"}
	for _, line := range lines {
		if part := Parts(line, strings.TrimSpace(strings.Split(line, "|")[0]))[0]; part.Filters != "" {
			t.Errorf("%s was stripped: %+v", line, part)
		}
	}
}
