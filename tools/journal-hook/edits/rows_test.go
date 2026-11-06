package edits

import (
	"strings"
	"testing"
)

func TestSectionRowsNumberEachLineInItsOwnFile(t *testing.T) {
	rows := SectionRows([]Section{{OldStart: 10, NewStart: 12, Lines: []string{" same", "-gone", "+new", "+more", " after"}}})
	want := []struct {
		category string
		line int
		text string
	}{{"ctx", 12, "same"}, {"del", 11, "gone"}, {"add", 13, "new"}, {"add", 14, "more"}, {"ctx", 15, "after"}}
	if len(rows) != len(want) {
		t.Fatalf("got %d rows", len(rows))
	}
	for index, row := range rows {
		if row.LineType != want[index].category || row.Line != want[index].line || row.Text != want[index].text {
			t.Errorf("row %d is %+v", index, row)
		}
	}
}

func TestANewFilesLinesAreAllAdded(t *testing.T) {
	rows := NewFileRows("one\ntwo\n")
	if len(rows) != 2 || rows[1].LineType != "add" || rows[1].Line != 2 || rows[1].Text != "two" {
		t.Fatalf("got %+v", rows)
	}
}

func TestPatchRowsKeepOnlyTheFirstFile(t *testing.T) {
	rows := PatchRows("*** Begin Patch\n*** Update File: a.py\n@@\n same\n-old\n+new\n*** Update File: b.py\n+other\n*** End Patch")
	if len(rows) != 3 || rows[0].LineType != "ctx" || rows[1].Text != "old" || rows[2].Text != "new" {
		t.Fatalf("got %+v", rows)
	}
}

func TestALargeChangeIsCutWithARowSayingHowManyAreLeftOut(t *testing.T) {
	rows := NewFileRows(strings.Repeat("line\n", rowsMost+5))
	last := rows[len(rows)-1]
	if len(rows) != rowsMost+1 || last.LineType != "fold" || last.Hidden != 5 {
		t.Fatalf("got %d rows, last %+v", len(rows), last)
	}
}

func TestALongLineIsCutAndStaysValidText(t *testing.T) {
	rows := NewFileRows(strings.Repeat("é", rowTextBytes))
	if len(rows[0].Text) > rowTextBytes || !strings.HasPrefix(rows[0].Text, "é") || strings.ContainsRune(rows[0].Text, 0xFFFD) {
		t.Fatalf("got %q", rows[0].Text)
	}
}
