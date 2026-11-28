package terminal

import (
	"fmt"
	"io"
	"time"

	"journal-runner/recording"
	"journal-runner/screen"
)

// checkpointSettleTime gives a recorded program time to finish answering a key.
const checkpointSettleTime = 1500 * time.Millisecond

// PrintScreen replays a terminal recording and prints its final screen.
func PrintScreen(folder string, output io.Writer) error {
	fixture, reader, err := recordingScreen(folder)
	if err != nil {
		return err
	}
	if err := fixture.FeedScreen(reader); err != nil {
		return err
	}
	snapshot := reader.Snapshot()
	for _, row := range snapshot.Rows {
		if _, err := fmt.Fprintln(output, row); err != nil {
			return err
		}
	}
	_, err = fmt.Fprintf(output, "-- %s, exit %d\n", snapshot.Status(), fixture.ExitCode)
	return err
}

// Annotate adds the screen each recorded key settled on to the fixture.
func Annotate(folder string) error {
	fixture, reader, err := recordingScreen(folder)
	if err != nil {
		return err
	}
	if err := fixture.MarkCheckpoints(reader, checkpointSettleTime); err != nil {
		return err
	}
	return fixture.Save(folder)
}

func recordingScreen(folder string) (recording.Fixture, *screen.EmulatorReader, error) {
	fixture, err := recording.Load(folder)
	if err != nil {
		return fixture, nil, err
	}
	size := fixture.StartGeometry()
	reader, err := screen.NewEmulatorReader(int(size.Columns), int(size.Rows), screen.DefaultLimits, nil)
	return fixture, reader, err
}
