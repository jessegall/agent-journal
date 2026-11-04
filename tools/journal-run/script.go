package main

import (
	"fmt"
	"strings"
)

// scriptSetup sets the last part's code again before a part runs, so $? in the part is that code; under set -e the shell
// would end on it, so it stays 0 there.
const scriptSetup = `__journal_code=0
__journal_status() {
  case "$-" in *e*) return 0 ;; *) return "$__journal_code" ;; esac
}
`

// Script is the shell script that runs the parts of a line one after another, each part's output in its own file and
// its status written when it ends. The runner only follows the files, so a run that moves to the background goes on
// without it. A part stripped of its pipes keeps its whole output; the pipes then run once over its stdout, also in a
// moved run, so the code a chain goes on from stays the one the agent wrote, and its stderr shows above what they
// print, as it passes a pipe in a shell. The output files are opened for appending, so the runner can cut them while
// they grow.
func Script(parts []Part, folder string) string {
	var script strings.Builder
	script.WriteString(scriptSetup)
	for index, part := range parts {
		partFile := func(suffix string) string { return quoted(fmt.Sprintf("%s/%d.%s", folder, part.Position, suffix)) }
		indent := ""
		if index > 0 && parts[index-1].JoinedBy == "&&" {
			script.WriteString("if [ \"$__journal_code\" -eq 0 ]; then\n")
			indent = "  "
		}
		fmt.Fprintf(&script, "%s: > %s\n", indent, partFile("started"))
		if part.Command != "" {
			writeStrippedCommand(&script, part, indent, partFile)
			stdin, stderr := partFile(stdoutSuffix), partFile(stderrSuffix)
			if part.DropStdout {
				stdin = "/dev/null"
			}
			if part.DropStderr {
				stderr = "/dev/null"
			}
			fmt.Fprintf(&script, "%scat %s > %s\n", indent, stderr, partFile(filteredSuffix))
			if part.Filters != "" {
				writeRun(&script, part, indent, grouped("{", part.Filters, "}"), fmt.Sprintf("< %s >> %s 2>&1", stdin, partFile(filteredSuffix)))
			} else {
				fmt.Fprintf(&script, "%scat %s >> %s\n", indent, stdin, partFile(filteredSuffix))
			}
		} else {
			fmt.Fprintf(&script, "%s__journal_status\n", indent)
			writeRun(&script, part, indent, grouped("{", part.Text, "}"), fmt.Sprintf(">> %s 2>&1", partFile(outputSuffix)))
		}
		fmt.Fprintf(&script, "%sprintf '%%s' \"$__journal_code\" > %s\n", indent, partFile("status"))
		if indent != "" {
			script.WriteString("fi\n")
		}
	}
	script.WriteString("exit \"$__journal_code\"\n")
	return script.String()
}

// writeStrippedCommand runs a stripped part's command as a pipe would, in a subshell. Its stdout and stderr each go to
// the complete output and to a file of their own, because only stdout goes into the pipes the agent wrote. The script
// opens both ends of both pipes before tee starts: opened for reading and writing a pipe never waits for its other side,
// and a tee that opened its own end could miss a quick command and wait for ever. The script holds the writing ends
// until the command is done, so tee ends even when the command never starts. The pipes live in the temp folder: inside
// the project a grep -r would open one and wait on it.
func writeStrippedCommand(script *strings.Builder, part Part, indent string, partFile func(string) string) {
	stdoutFifo, stderrFifo := `"$__journal_pipes.stdout"`, `"$__journal_pipes.stderr"`
	fmt.Fprintf(script, "%s__journal_pipes=\"${TMPDIR:-/tmp}/journal-run-$$-%d\"\n", indent, part.Position)
	fmt.Fprintf(script, "%smkfifo %s %s\n", indent, stdoutFifo, stderrFifo)
	fmt.Fprintf(script, "%sexec 8<> %s 9<> %s 6< %s 7< %s\n", indent, stdoutFifo, stderrFifo, stdoutFifo, stderrFifo)
	fmt.Fprintf(script, "%stee -a %s %s <&6 > /dev/null 6<&- 7<&- 8>&- 9>&- &\n%s__journal_stdout=$!\n", indent, partFile(outputSuffix), partFile(stdoutSuffix), indent)
	fmt.Fprintf(script, "%stee -a %s %s <&7 > /dev/null 6<&- 7<&- 8>&- 9>&- &\n%s__journal_stderr=$!\n", indent, partFile(outputSuffix), partFile(stderrSuffix), indent)
	fmt.Fprintf(script, "%sexec 6<&- 7<&-\n%s__journal_status\n", indent, indent)
	writeGuardedRun(script, indent, grouped("(", part.Command, ")"), ">&8 2>&9 8>&- 9>&-")
	fmt.Fprintf(script, "%sexec 8>&- 9>&-\n%swait \"$__journal_stdout\" \"$__journal_stderr\"\n%srm -f %s %s\n", indent, indent, indent, stdoutFifo, stderrFifo)
	fmt.Fprintf(script, "%sprintf '%%s' \"$__journal_code\" > %s\n", indent, partFile(commandSuffix))
}

// writeRun runs one piece of a part and keeps its code. Before && a failure may not end a shell under set -e, as the
// shell's own && lets it fail.
func writeRun(script *strings.Builder, part Part, indent, text, redirects string) {
	if part.JoinedBy == "&&" {
		writeGuardedRun(script, indent, text, redirects)
		return
	}
	fmt.Fprintf(script, "%s%s %s\n%s__journal_code=$?\n", indent, text, redirects, indent)
}

// writeGuardedRun keeps the code of a piece whose failure must not end the script; the test sits right after the line
// that set $?, so the piece still reads it.
func writeGuardedRun(script *strings.Builder, indent, text, redirects string) {
	fmt.Fprintf(script, "%sif %s %s; then\n%s  __journal_code=0\n%selse\n%s  __journal_code=$?\n%sfi\n", indent, text, redirects, indent, indent, indent, indent)
}

// grouped closes a group on a line of its own after an empty one, so text that ends in a comment, a here-document or a
// backslash stays closed.
func grouped(opening, text, closing string) string {
	return fmt.Sprintf("%s %s\n\n%s", opening, text, closing)
}

func quoted(path string) string {
	return "'" + strings.ReplaceAll(path, "'", `'\''`) + "'"
}
