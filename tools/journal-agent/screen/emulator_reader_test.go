package screen

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"journal-agent/recording"
	"journal-agent/screen/contracts"
)

func newReader(t *testing.T, columns, rows int) *EmulatorReader {
	t.Helper()
	reader, err := NewEmulatorReader(columns, rows, DefaultLimits, map[string][2]int{"top": {0, 1}})
	if err != nil {
		t.Fatal(err)
	}

	return reader
}

// terminalFixtures are the recordings made in terminal mode, the ones that drew a screen.
func terminalFixtures(t *testing.T) []recording.Fixture {
	t.Helper()
	folders, _ := filepath.Glob("../testdata/recordings/*/*/*")
	var fixtures []recording.Fixture

	for _, folder := range folders {
		if _, err := os.Stat(filepath.Join(folder, recording.FileName)); err != nil {
			continue
		}
		fixture, err := recording.Load(folder)
		if err != nil {
			t.Fatal(err)
		}
		if fixture.Mode == recording.TerminalMode {
			fixtures = append(fixtures, fixture)
		}
	}

	return fixtures
}

func TestEveryRecordingReadsTheSameWhenSplitAtEveryByte(t *testing.T) {
	fixtures := terminalFixtures(t)
	if len(fixtures) == 0 {
		t.Skip("no terminal recording yet")
	}

	for _, fixture := range fixtures {
		whole, bytewise := newReader(t, 120, 40), newReader(t, 120, 40)

		for _, chunk := range fixture.Output {
			if err := whole.Feed(chunk.Bytes); err != nil {
				t.Fatal(err)
			}
			for index := range chunk.Bytes {
				if err := bytewise.Feed(chunk.Bytes[index : index+1]); err != nil {
					t.Fatal(err)
				}
			}
		}

		if !reflect.DeepEqual(whole.Snapshot(), bytewise.Snapshot()) {
			t.Fatalf("%s %s: a byte-by-byte replay reads a different screen", fixture.Program, fixture.Profile)
		}
	}
}

func TestCursorMovesEraseAndTheAlternateScreen(t *testing.T) {
	reader := newReader(t, 20, 5)
	reader.Feed([]byte("hello world\x1b[2;3Hxy\x1b[1;7H\x1b[K"))

	snapshot := reader.Snapshot()
	if snapshot.Rows[0] != "hello" || snapshot.Rows[1] != "  xy" {
		t.Fatalf("rows %q", snapshot.Rows[:2])
	}
	if snapshot.Cursor.Row != 0 || snapshot.Cursor.Column != 6 {
		t.Fatalf("cursor %+v", snapshot.Cursor)
	}

	reader.Feed([]byte("\x1b[?1049h\x1b[2J\x1b[Hmenu"))
	if snapshot := reader.Snapshot(); snapshot.Buffer != contracts.AlternateBuffer || snapshot.Rows[0] != "menu" {
		t.Fatalf("alternate screen %+v", snapshot)
	}

	reader.Feed([]byte("\x1b[?1049l"))
	if snapshot := reader.Snapshot(); snapshot.Buffer != contracts.NormalBuffer || snapshot.Rows[0] != "hello" {
		t.Fatalf("back on the normal screen %+v", snapshot)
	}
}

func TestResizeAndRegionGenerations(t *testing.T) {
	reader := newReader(t, 20, 5)
	before := reader.Generation("top")
	reader.Feed([]byte("line one"))
	if reader.Generation("top") != before+1 {
		t.Fatal("a change of the top row did not raise its generation")
	}
	reader.Feed([]byte("\x1b[3;1Hlower"))
	if reader.Generation("top") != before+1 {
		t.Fatal("a change outside the top row raised its generation")
	}

	if err := reader.Resize(40, 10); err != nil {
		t.Fatal(err)
	}
	if snapshot := reader.Snapshot(); snapshot.Columns != 40 || snapshot.Height != 10 {
		t.Fatalf("size after resize %dx%d", snapshot.Columns, snapshot.Height)
	}
	if err := reader.Resize(0, 10); err == nil {
		t.Fatal("a size of zero columns was accepted")
	}
}

func TestWideAndCombiningCharacters(t *testing.T) {
	reader := newReader(t, 20, 2)
	reader.Feed([]byte("界a éb"))
	snapshot := reader.Snapshot()
	if snapshot.Rows[0] != "界a e\u0301b" {
		t.Fatalf("row %q", snapshot.Rows[0])
	}
	if snapshot.Cursor.Column != 6 {
		t.Fatalf("a wide character takes two cells and a combining mark none: the cursor is at %d, not 6", snapshot.Cursor.Column)
	}
}

func TestAChunkOverTheLimitIsUnreadable(t *testing.T) {
	reader, _ := NewEmulatorReader(20, 5, Limits{MaxChunkBytes: 4, MaxColumns: 100, MaxRows: 100}, nil)

	if err := reader.Feed([]byte("12345")); err == nil {
		t.Fatal("a chunk over the limit was read")
	} else if _, isUnreadable := err.(ScreenUnreadable); !isUnreadable {
		t.Fatalf("got %T", err)
	}
}
