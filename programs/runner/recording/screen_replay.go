package recording

import (
	"time"

	"journal-runner/screen/contracts"
)

// FeedScreen feeds every recorded output chunk into the screen reader, in order.
func (fixture Fixture) FeedScreen(reader contracts.ScreenReader) error {
	for _, chunk := range fixture.Output {
		if err := reader.Feed(chunk.Bytes); err != nil {
			return err
		}
	}

	return nil
}

// MarkCheckpoints replays the output into the screen reader and stores, after each typed input, the screen it
// settled on once settleTime has passed: the evidence of what each key did. Earlier checkpoints are replaced.
func (fixture *Fixture) MarkCheckpoints(reader contracts.ScreenReader, settleTime time.Duration) error {
	fixture.Checkpoints = nil
	next := 0
	for _, input := range fixture.Inputs {
		until := input.Offset + settleTime
		for ; next < len(fixture.Output) && fixture.Output[next].Offset <= until; next++ {
			if err := reader.Feed(fixture.Output[next].Bytes); err != nil {
				return err
			}
		}
		fixture.Checkpoints = append(fixture.Checkpoints, checkpointOf(until, reader.Snapshot()))
	}

	return nil
}

func checkpointOf(offset time.Duration, snapshot contracts.Snapshot) ScreenCheckpoint {
	return ScreenCheckpoint{
		Offset:       offset,
		Rows:         snapshot.Rows,
		CursorRow:    snapshot.Cursor.Row,
		CursorColumn: snapshot.Cursor.Column,
	}
}
