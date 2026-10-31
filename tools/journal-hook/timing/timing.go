// Package timing keeps the named wall clock stamps, in microseconds since 1970, that one request collects in
// the hook or the client before it is sent to the server in the Journal-Timing header.
package timing

import (
	"fmt"
	"os"
	"strings"
	"time"
)

const Header = "Journal-Timing"

type stamp struct {
	name         string
	microseconds int64
}

type Timing struct {
	stamps []stamp
}

func Started() *Timing {
	timing := &Timing{}
	timing.Stamp("go_start")
	return timing
}

func (timing *Timing) Stamp(name string) {
	timing.stamps = append(timing.stamps, stamp{name, time.Now().UnixMicro()})
}

func (timing *Timing) Text() string {
	pairs := make([]string, len(timing.stamps))
	for index, stamp := range timing.stamps {
		pairs[index] = fmt.Sprintf("%s=%d", stamp.name, stamp.microseconds)
	}
	return strings.Join(pairs, ";")
}

func (timing *Timing) RequestID() string {
	return fmt.Sprintf("%d-%d", os.Getpid(), timing.stamps[0].microseconds)
}
