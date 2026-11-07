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

type ProgressListing struct {
	Line     string
	Position int
	Pattern  string
	Options  ListingOptions
}

// Script is the shell script that runs the parts of a line one after another, each part's output in its own file and
// its status written when it ends. The runner only follows the files, so a run that moves to the background goes on
// without it. The output files are opened for appending, so the runner can cut them while they grow.
func Script(parts []Part, folder string, listings ...ProgressListing) string {
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
		for _, listing := range listings {
			if listing.Position == part.Position {
				script.WriteString(ProgressCount(folder, listing.Line, part.Position, listing.Pattern, listing.Options))
			}
		}
		fmt.Fprintf(&script, "%s__journal_status\n", indent)
		writeRun(&script, part, indent, grouped("{", part.Text, "}"), fmt.Sprintf(">> %s 2>&1", partFile(outputSuffix)))
		fmt.Fprintf(&script, "%sprintf '%%s' \"$__journal_code\" > %s\n", indent, partFile("status"))
		if indent != "" {
			script.WriteString("fi\n")
		}
	}
	script.WriteString("exit \"$__journal_code\"\n")
	return script.String()
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
