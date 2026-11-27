package recording

import (
	"fmt"
	"io"
	"time"
)

// Clock is the time a replay advances; a fake clock makes a replay instant and repeatable.
type Clock interface {
	Now() time.Time
	Sleep(duration time.Duration)
}

// FakeClock moves only when a replay sleeps, so nothing waits and no real time passes.
type FakeClock struct {
	current time.Time
}

// NewFakeClock starts a fake clock at the given time.
func NewFakeClock(start time.Time) *FakeClock {
	return &FakeClock{current: start}
}

func (clock *FakeClock) Now() time.Time {
	return clock.current
}

func (clock *FakeClock) Sleep(duration time.Duration) {
	clock.current = clock.current.Add(duration)
}

// Replay writes the fixture's output chunks to the sink in recorded order and timing, on the clock. The sink is
// inert: nothing is started, no vendor account is used and no network is reached. It gives the chunks it wrote.
func Replay(fixture Fixture, sink io.Writer, clock Clock) ([]OutputChunk, error) {
	replayed := make([]OutputChunk, 0, len(fixture.Output))
	var elapsed time.Duration

	for _, chunk := range fixture.Output {
		if chunk.Offset > elapsed {
			clock.Sleep(chunk.Offset - elapsed)
			elapsed = chunk.Offset
		}

		if _, err := sink.Write(chunk.Bytes); err != nil {
			return replayed, fmt.Errorf("replaying the chunk at %s: %w", chunk.Offset, err)
		}

		replayed = append(replayed, chunk)
	}

	return replayed, nil
}
