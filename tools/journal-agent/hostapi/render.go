package hostapi

import (
	"encoding/json"
	"io/fs"
	"os"
	"path/filepath"
	"slices"
	"time"

	"journal-agent/recording"
	"journal-agent/screen"
)

// FramesFileName is the file beside a recording's fixture that holds the frames its output draws.
const FramesFileName = "frames.json"

// RenderedFrame is one frame of a recording, at its offset from the recording's start.
type RenderedFrame struct {
	Offset time.Duration `json:"offset"`
	Frame  Frame         `json:"frame"`
}

// RenderFixture is the frame the screen shows after each output chunk that changed it, timed by the chunks' offsets.
// A recording of pipes has no screen, so none.
func RenderFixture(fixture recording.Fixture) ([]RenderedFrame, error) {
	frames := []RenderedFrame{}
	if fixture.Mode != recording.TerminalMode {
		return frames, nil
	}
	geometry := fixture.StartGeometry()
	shown, err := newScreen(int(geometry.Columns), int(geometry.Rows))
	if err != nil {
		return nil, err
	}
	resizes := fixture.Resizes
	for _, chunk := range fixture.Output {
		for len(resizes) > 0 && resizes[0].Offset <= chunk.Offset {
			if err := shown.reader.Resize(int(resizes[0].Geometry.Columns), int(resizes[0].Geometry.Rows)); err != nil {
				return nil, err
			}
			resizes = resizes[1:]
		}
		shown.Feed(chunk.Bytes, chunk.Offset.Milliseconds())
		frame := shown.Frame(chunk.Offset.Milliseconds())
		if len(frames) > 0 && slices.Equal(frames[len(frames)-1].Frame.Rows, frame.Rows) {
			continue
		}
		frames = append(frames, RenderedFrame{Offset: chunk.Offset, Frame: frame})
	}
	return frames, nil
}

// RenderFolder writes frames.json beside every fixture under the folder and answers the fixtures it rendered.
func RenderFolder(folder string) ([]string, error) {
	rendered := []string{}
	err := filepath.WalkDir(folder, func(path string, entry fs.DirEntry, err error) error {
		if err != nil || entry.Name() != recording.FileName {
			return err
		}
		encoded, err := RenderedFramesOf(filepath.Dir(path))
		if err != nil {
			return err
		}
		rendered = append(rendered, filepath.Dir(path))
		return os.WriteFile(filepath.Join(filepath.Dir(path), FramesFileName), encoded, 0o644)
	})
	return rendered, err
}

// RenderedFramesOf is the frames.json a recording folder's fixture renders to.
func RenderedFramesOf(recordingFolder string) ([]byte, error) {
	fixture, err := recording.Load(recordingFolder)
	if err != nil {
		return nil, err
	}
	frames, err := RenderFixture(fixture)
	if err != nil {
		return nil, err
	}
	encoded, err := json.MarshalIndent(frames, "", "  ")
	if err != nil {
		return nil, err
	}
	return append(encoded, '\n'), nil
}

func newScreen(columns, rows int) (*Screen, error) {
	reader, err := screen.NewEmulatorReader(columns, rows, screen.DefaultLimits, nil)
	if err != nil {
		return nil, err
	}
	return &Screen{reader: reader}, nil
}
