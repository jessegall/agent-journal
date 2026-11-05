package main

import (
	"strconv"
	"strings"
)

// readingVariable carries what the agent reads of each part of a saved command, such as 2:tail:5,4:cut:10-20.
const readingVariable = "JOURNAL_RUN_READING"

// parseReading reads the variable into the reading of each position.
func parseReading(text string) map[int]string {
	selection := map[int]string{}
	for _, item := range strings.Split(text, ",") {
		position, flag, found := strings.Cut(item, ":")
		if number, err := strconv.Atoi(position); found && err == nil {
			selection[number] = flag
		}
	}
	return selection
}

// readLines is the lines of an output a reading asks for: tail:N, head:N or cut:A-B, counted from 1.
func readLines(text, selection string) string {
	kind, value, _ := strings.Cut(selection, ":")
	lines := strings.SplitAfter(strings.TrimSuffix(text, "\n"), "\n")
	first, last := 0, len(lines)
	switch kind {
	case "tail":
		count, _ := strconv.Atoi(value)
		first = max(0, len(lines)-count)
	case "head":
		count, _ := strconv.Atoi(value)
		last = min(len(lines), count)
	case "cut":
		start, end, _ := strings.Cut(value, "-")
		from, _ := strconv.Atoi(start)
		endLine, _ := strconv.Atoi(end)
		first, last = max(0, from-1), min(len(lines), endLine)
	}
	if first >= last {
		return ""
	}
	return strings.TrimSuffix(strings.Join(lines[first:last], ""), "\n") + "\n"
}
