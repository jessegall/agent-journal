package keyscripts

import "time"

// WallClock is the real time a live run waits on.
type WallClock struct{}

func (WallClock) Now() time.Time { return time.Now() }

func (WallClock) Sleep(duration time.Duration) { time.Sleep(duration) }
