package main

import (
	"bytes"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
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
