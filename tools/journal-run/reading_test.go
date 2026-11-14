package main

import (
	"strings"
	"testing"
)

const countedLines = "one\ntwo\nthree\nfour\nfive\n"

func TestReadLines(t *testing.T) {
	cases := []struct{ selection, shown string }{
		{"tail:2", "four\nfive\n"},
		{"tail:99", countedLines},
		{"head:2", "one\ntwo\n"},
		{"head:99", countedLines},
		{"cut:2-3", "two\nthree\n"},
		{"cut:4-99", "four\nfive\n"},
		{"cut:9-12", ""},
		{"tail:0", ""},
	}
	for _, testCase := range cases {
		t.Run(testCase.selection, func(t *testing.T) {
			if shown := readLines(countedLines, testCase.selection); shown != testCase.shown {
				t.Fatalf("shown %q", shown)
			}
		})
	}
}

func TestAReadingIsParsedPerPosition(t *testing.T) {
	selection := parseReading("2:tail:5,4:cut:10-20")
	if selection[2] != "tail:5" || selection[4] != "cut:10-20" || len(selection) != 2 {
		t.Fatalf("reading %v", selection)
	}
}

func TestAPartWithAReadingShowsOnlyThoseLinesAndStoresEverything(t *testing.T) {
	setup := options(t, `printf 'one\ntwo\nthree\n'`)
	setup.ReadFlags = map[int]string{1: "tail:1"}
	output, _ := run(t, setup, newClient())
	if output != "three\n" || !strings.Contains(readFile(t, folderOf(setup)+"/1.out"), "one\ntwo\nthree\n") {
		t.Fatalf("printed %q", output)
	}
}
