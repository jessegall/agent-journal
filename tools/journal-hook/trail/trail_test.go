package trail

import (
	"fmt"
	"os"
	"reflect"
	"strings"
	"testing"
)

func names(trail *Trail) []string {
	var named []string
	for _, pair := range strings.Split(trail.Text(), ";") {
		name, _, _ := strings.Cut(pair, "=")
		named = append(named, name)
	}
	return named
}

func TestAStartedTrailKeepsGoStartFirstAndEachStampAfterIt(t *testing.T) {
	trail := Started()
	trail.Stamp("go_sent")
	trail.Stamp("go_resent")
	if got, want := names(trail), []string{"go_start", "go_sent", "go_resent"}; !reflect.DeepEqual(got, want) {
		t.Fatalf("names %v, want %v", got, want)
	}
}

func TestTheHeaderTextIsNameEqualsMicrosecondsJoinedBySemicolons(t *testing.T) {
	trail := Started()
	trail.Stamp("go_sent")
	for _, pair := range strings.Split(trail.Text(), ";") {
		name, value, found := strings.Cut(pair, "=")
		if !found || name == "" || strings.Trim(value, "0123456789") != "" || len(value) != 16 {
			t.Fatalf("pair %q is not a name and a microsecond count", pair)
		}
	}
}

func TestTheRequestIdIsThePidAndTheGoStart(t *testing.T) {
	trail := Started()
	goStart := strings.TrimPrefix(strings.Split(trail.Text(), ";")[0], "go_start=")
	if got, want := trail.RequestID(), fmt.Sprintf("%d-%s", os.Getpid(), goStart); got != want {
		t.Fatalf("request id %q, want %q", got, want)
	}
}
