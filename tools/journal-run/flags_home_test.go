package main

import "testing"

func TestAProgramInABinFolderBelongsToTheJournalAroundIt(t *testing.T) {
	if home := binaryHome("/project/.journal/bin/journal-run"); home != "/project/.journal" {
		t.Errorf("home %q", home)
	}
}

func TestAProgramElsewhereBelongsToNoJournal(t *testing.T) {
	if home := binaryHome("/tmp/go-build/journal-run.test"); home != "" {
		t.Errorf("home %q", home)
	}
}
