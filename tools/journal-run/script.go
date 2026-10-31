package main

import (
	"fmt"
	"strings"
)

// Script is the shell script that runs the parts of a line one after another, each part's output in its own file and
// its status written when it ends. The runner only follows the files, so a run that moves to the background goes on
// without it.
func Script(parts []Part, folder string) string {
	var script strings.Builder
	script.WriteString("__journal_code=0\n")
	for index, part := range parts {
		position := index + 1
		outputFile, statusFile := quoted(fmt.Sprintf("%s/%d.out", folder, position)), quoted(fmt.Sprintf("%s/%d.status", folder, position))
		indent := ""
		if index > 0 && parts[index-1].JoinedBy == "&&" {
			script.WriteString("if [ \"$__journal_code\" -eq 0 ]; then\n")
			indent = "  "
		}
		if part.JoinedBy == "&&" {
			fmt.Fprintf(&script, "%s__journal_code=0\n%s{ %s\n} > %s 2>&1 || __journal_code=$?\n", indent, indent, part.Text, outputFile)
		} else {
			fmt.Fprintf(&script, "%s{ %s\n} > %s 2>&1\n%s__journal_code=$?\n", indent, part.Text, outputFile, indent)
		}
		fmt.Fprintf(&script, "%sprintf '%%s' \"$__journal_code\" > %s\n", indent, statusFile)
		if indent != "" {
			script.WriteString("fi\n")
		}
	}
	script.WriteString("exit \"$__journal_code\"\n")
	return script.String()
}

func quoted(path string) string {
	return "'" + strings.ReplaceAll(path, "'", `'\''`) + "'"
}
