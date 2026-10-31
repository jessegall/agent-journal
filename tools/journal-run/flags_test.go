package main

import "testing"

func TestTheRewrittenCommandLineIsReadIntoItsFlagsAndLine(t *testing.T) {
	flags, err := ParseFlags([]string{"--process", "7", "--limit", "30", "--background", "--", "make test && echo done"})
	if err != nil || flags.Process != 7 || flags.Limit != 30 || !flags.Background || flags.Line != "make test && echo done" {
		t.Fatalf("read %+v, %v", flags, err)
	}
}

func TestAMissingProcessLineOrNumberIsRefused(t *testing.T) {
	for name, arguments := range map[string][]string{
		"no process":     {"--limit", "30", "--", "ls"},
		"no line":        {"--process", "7", "--limit", "30"},
		"a bad number":   {"--process", "x", "--", "ls"},
		"an unknown one": {"--process", "7", "--now", "--", "ls"},
	} {
		if _, err := ParseFlags(arguments); err == nil {
			t.Errorf("%s was accepted", name)
		}
	}
}

func TestADetachedTrackerNeedsNoLine(t *testing.T) {
	flags, err := ParseFlags([]string{"--follow", "--process", "7", "--folder", "/work/.journal", "--parts", "3"})
	if err != nil || !flags.Follow || flags.Parts != 3 || flags.Folder != "/work/.journal" {
		t.Fatalf("read %+v, %v", flags, err)
	}
}
