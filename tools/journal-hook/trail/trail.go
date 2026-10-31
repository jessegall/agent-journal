// Package trail keeps the named wall clock stamps, in microseconds since 1970, that one request collects in
// the hook or the client before it is sent to the server in the Journal-Trail header.
package trail

import (
	"fmt"
	"os"
	"strings"
	"time"
)

const Header = "Journal-Trail"

type stamp struct {
	name string
	at   int64
}

type Trail struct {
	stamps []stamp
}

func Started() *Trail {
	trail := &Trail{}
	trail.Stamp("go_start")
	return trail
}

func (trail *Trail) Stamp(name string) {
	trail.stamps = append(trail.stamps, stamp{name, time.Now().UnixMicro()})
}

func (trail *Trail) Text() string {
	pairs := make([]string, len(trail.stamps))
	for index, stamp := range trail.stamps {
		pairs[index] = fmt.Sprintf("%s=%d", stamp.name, stamp.at)
	}
	return strings.Join(pairs, ";")
}

func (trail *Trail) RequestID() string {
	return fmt.Sprintf("%d-%d", os.Getpid(), trail.stamps[0].at)
}
