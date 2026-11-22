package screen

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"
	"time"

	"journal-agent/screen/contracts"
)

// textOf joins a frame row's runs and cuts the trailing spaces, as a snapshot row is cut.
func textOf(runs []Run) string {
	var text strings.Builder
	for _, run := range runs {
		text.WriteString(run.Text)
	}

	return strings.TrimRight(text.String(), " ")
}

func requireFrameTextEqualsSnapshot(t *testing.T, reader *EmulatorReader, name string) {
	t.Helper()
	frame, snapshot := reader.Frame("epoch", 1, time.Now()), reader.Snapshot()
	if len(frame.Rows) != len(snapshot.Rows) {
		t.Fatalf("%s: the frame has %d rows, the snapshot %d", name, len(frame.Rows), len(snapshot.Rows))
	}
	for row, runs := range frame.Rows {
		if text := textOf(runs); text != snapshot.Rows[row] {
			t.Fatalf("%s row %d: the frame reads %q, the snapshot %q", name, row, text, snapshot.Rows[row])
		}
	}
}

func TestEveryRecordingGivesFramesWhoseTextIsTheScreen(t *testing.T) {
	fixtures := terminalFixtures(t)
	if len(fixtures) == 0 {
		t.Skip("no terminal recording yet")
	}

	for _, fixture := range fixtures {
		reader := newReader(t, 120, 40)
		for _, chunk := range fixture.Output {
			if err := reader.Feed(chunk.Bytes); err != nil {
				t.Fatal(err)
			}
			requireFrameTextEqualsSnapshot(t, reader, fixture.Driver+" "+fixture.Profile)
		}
	}
}

func TestColourBoldAndInverseBecomeRunsOfTheirStyle(t *testing.T) {
	reader := newReader(t, 30, 3)
	reader.Feed([]byte("plain \x1b[1;31mred bold\x1b[0m \x1b[7minverse\x1b[0m\r\n\x1b[3;4mslanted\x1b[0m\x1b[44m  \x1b[0m"))

	frame := reader.Frame("epoch", 7, time.Now())
	first := frame.Rows[0]
	if len(first) != 4 {
		t.Fatalf("first row runs %+v", first)
	}
	if first[0].Text != "plain " || first[0].Style != (Style{}) {
		t.Fatalf("plain run %+v", first[0])
	}
	if first[1].Text != "red bold" || !first[1].Style.Bold || first[1].Style.Foreground == "" {
		t.Fatalf("red bold run %+v", first[1])
	}
	if first[3].Text != "inverse" || !first[3].Style.Inverse {
		t.Fatalf("inverse run %+v", first[3])
	}

	second := frame.Rows[1]
	if second[0].Text != "slanted" || !second[0].Style.Italic || !second[0].Style.Underline {
		t.Fatalf("italic underlined run %+v", second)
	}
	if len(second) != 2 || second[1].Text != "  " || second[1].Style.Background == "" {
		t.Fatalf("spaces with a background stay a run of their own: %+v", second)
	}
	if len(frame.Rows[2]) != 0 {
		t.Fatalf("an empty row has no runs: %+v", frame.Rows[2])
	}
}

func TestAWideCharacterKeepsItsCellAndItsContinuationAddsNoText(t *testing.T) {
	reader := newReader(t, 20, 2)
	reader.Feed([]byte("界a 🙂b"))

	frame := reader.Frame("epoch", 1, time.Now())
	if text := textOf(frame.Rows[0]); text != "界a 🙂b" {
		t.Fatalf("row %q", text)
	}
	requireFrameTextEqualsSnapshot(t, reader, "wide characters")
}

func TestAFrameCarriesCursorBufferSizeAndItsNumbering(t *testing.T) {
	reader := newReader(t, 25, 4)
	captured := time.Date(2026, 11, 19, 12, 0, 0, 0, time.UTC)
	reader.Feed([]byte("abc\x1b[?25l"))

	frame := reader.Frame("host-1", 42, captured)
	if frame.Epoch != "host-1" || frame.Sequence != 42 || !frame.Captured.Equal(captured) {
		t.Fatalf("numbering %q %d %v", frame.Epoch, frame.Sequence, frame.Captured)
	}
	if frame.Columns != 25 || len(frame.Rows) != 4 {
		t.Fatalf("size %dx%d", frame.Columns, len(frame.Rows))
	}
	if frame.Cursor != (contracts.Cursor{Row: 0, Column: 3, Visible: false}) {
		t.Fatalf("cursor %+v", frame.Cursor)
	}
	if frame.Buffer != contracts.NormalBuffer {
		t.Fatalf("buffer %q", frame.Buffer)
	}

	reader.Feed([]byte("\x1b[?1049h"))
	if frame := reader.Frame("host-1", 43, captured); frame.Buffer != contracts.AlternateBuffer {
		t.Fatalf("buffer on the alternate screen %q", frame.Buffer)
	}
}

func TestAFrameUnderTheLimitComesBackUnchanged(t *testing.T) {
	reader := newReader(t, 20, 2)
	reader.Feed([]byte("\x1b[31mred\x1b[0m"))
	frame := reader.Frame("epoch", 1, time.Now())

	bounded := frame.Bounded(FrameLimit)
	if bounded.Plain || bounded.TooLarge || bounded.Rows[0][0].Style.Foreground == "" {
		t.Fatalf("a small frame was changed: %+v", bounded)
	}
}

func TestAFrameOverTheLimitComesBackPlainWithTheSameText(t *testing.T) {
	reader := newReader(t, 40, 6)
	for row := range 6 {
		var line strings.Builder
		fmt.Fprintf(&line, "\x1b[%d;1H", row+1)
		for column := range 40 {
			fmt.Fprintf(&line, "\x1b[3%d;4%dmx", column%8, (column+row)%8)
		}
		reader.Feed([]byte(line.String()))
	}
	frame := reader.Frame("epoch", 9, time.Now())
	styled, _ := json.Marshal(frame)
	limit := len(styled) / 4

	bounded := frame.Bounded(limit)
	if !bounded.Plain || bounded.TooLarge || bounded.Sequence != 9 {
		t.Fatalf("plain %v, too large %v, sequence %d", bounded.Plain, bounded.TooLarge, bounded.Sequence)
	}
	if plain, _ := json.Marshal(bounded); len(plain) > limit {
		t.Fatalf("the plain frame takes %d bytes, over the limit of %d", len(plain), limit)
	}
	for row, runs := range bounded.Rows {
		if len(runs) != 1 || runs[0].Style != (Style{}) || runs[0].Text != textOf(frame.Rows[row]) {
			t.Fatalf("row %d is not one plain run of the same text: %+v", row, runs)
		}
	}
}

func TestAFrameOverTheLimitEvenPlainComesBackAsTheMarker(t *testing.T) {
	reader := newReader(t, 40, 10)
	for row := range 10 {
		reader.Feed([]byte(fmt.Sprintf("\x1b[%d;1H%s", row+1, strings.Repeat("x", 40))))
	}
	frame := reader.Frame("epoch", 3, time.Now())

	marker := frame.Bounded(300)
	if !marker.TooLarge || len(marker.Rows) != 0 || marker.Columns != 40 || marker.Sequence != 3 {
		t.Fatalf("marker %+v", marker)
	}
}
