package terminal

import (
	"bytes"
	"io/fs"
	"os"
	"path/filepath"
	"testing"

	"journal-runner/recording"
)

// recordingsFolder is where every program's recordings live: the journal's resources.
const recordingsFolder = "../../../resources/recordings"

func TestEveryRecordingHasItsCommittedFrames(t *testing.T) {
	assertFramesOf(t, recordingsFolder)
}

func assertFramesOf(t *testing.T, recordings string) {
	t.Helper()
	found := 0
	_ = filepath.WalkDir(recordings, func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.Name() != recording.FileName {
			return err
		}
		found++
		folder := filepath.Dir(path)
		rendered, err := RenderedFramesOf(folder)
		if err != nil {
			t.Fatalf("%s does not render: %v", folder, err)
		}
		committed, err := os.ReadFile(filepath.Join(folder, FramesFileName))
		if err != nil || !bytes.Equal(rendered, committed) {
			t.Errorf("%s: its frames.json differs from what it renders; run journal-runner recording render", folder)
		}
		return nil
	})
	if found == 0 {
		t.Errorf("%s holds no recording", recordings)
	}
}

func TestAChangedChunkChangesTheRenderedFrames(t *testing.T) {
	fixture := recording.Fixture{
		Mode:     recording.TerminalMode,
		Geometry: recording.Geometry{Columns: 20, Rows: 3},
		Output:   []recording.OutputChunk{{Stream: "stdout", Bytes: []byte("ready")}},
	}
	before, err := RenderFixture(fixture)
	if err != nil {
		t.Fatal(err)
	}
	fixture.Output[0].Bytes = []byte("ready?")
	after, err := RenderFixture(fixture)
	if err != nil {
		t.Fatal(err)
	}

	if before[0].Frame.Rows[0] == after[0].Frame.Rows[0] {
		t.Fatalf("a changed chunk rendered the same row %q", before[0].Frame.Rows[0])
	}
}
