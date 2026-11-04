package main

import (
	"fmt"
	"strings"
)

// Script is the shell script that runs the parts of a line one after another, each part's output in its own file and
// its status written when it ends. The runner only follows the files, so a run that moves to the background goes on
// without it. A part stripped of its pipes keeps its whole output; the pipes then run once over that file, also in a
// moved run, so the code a chain goes on from stays the one the agent wrote. The output file is opened for appending,
// so the runner can cut it while it grows.
func Script(parts []Part, folder string) string {
	var script strings.Builder
	script.WriteString("__journal_code=0\n")
	for index, part := range parts {
		position := part.Position
		outputFile, statusFile := quoted(fmt.Sprintf("%s/%d.out", folder, position)), quoted(fmt.Sprintf("%s/%d.status", folder, position))
		startedFile := quoted(fmt.Sprintf("%s/%d.started", folder, position))
		indent := ""
		if index > 0 && parts[index-1].JoinedBy == "&&" {
			script.WriteString("if [ \"$__journal_code\" -eq 0 ]; then\n")
			indent = "  "
		}
		fmt.Fprintf(&script, "%s: > %s\n", indent, startedFile)
		if part.Filters != "" {
			fmt.Fprintf(&script, "%s__journal_code=0\n%s{ %s\n} >> %s 2>&1 || __journal_code=$?\n", indent, indent, part.Command, outputFile)
			fmt.Fprintf(&script, "%sprintf '%%s' \"$__journal_code\" > %s\n", indent, quoted(fmt.Sprintf("%s/%d.%s", folder, position, commandSuffix)))
			filteredFile := quoted(fmt.Sprintf("%s/%d.%s", folder, position, filteredSuffix))
			if part.JoinedBy == "&&" {
				fmt.Fprintf(&script, "%s__journal_code=0\n%s{ %s\n} < %s > %s 2>&1 || __journal_code=$?\n", indent, indent, part.Filters, outputFile, filteredFile)
			} else {
				fmt.Fprintf(&script, "%s{ %s\n} < %s > %s 2>&1\n%s__journal_code=$?\n", indent, part.Filters, outputFile, filteredFile, indent)
			}
		} else if part.JoinedBy == "&&" {
			fmt.Fprintf(&script, "%s__journal_code=0\n%s{ %s\n} >> %s 2>&1 || __journal_code=$?\n", indent, indent, part.Text, outputFile)
		} else {
			fmt.Fprintf(&script, "%s{ %s\n} >> %s 2>&1\n%s__journal_code=$?\n", indent, part.Text, outputFile, indent)
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
