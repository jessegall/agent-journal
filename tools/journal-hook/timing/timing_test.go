package timing

import (
	"fmt"
	"os"
	"reflect"
	"strings"
	"testing"
)

func names(timing *Timing) []string {
	var stampNames []string
	for _, pair := range strings.Split(timing.Text(), ";") {
		name, _, _ := strings.Cut(pair, "=")
		stampNames = append(stampNames, name)
	}
	return stampNames
}

func TestStampOrder(t *testing.T) {
	timing := Started()
	timing.Stamp("go_sent")
	timing.Stamp("go_resent")
	if actual, expected := names(timing), []string{"go_start", "go_sent", "go_resent"}; !reflect.DeepEqual(actual, expected) {
		t.Fatalf("names %v, want %v", actual, expected)
	}
}

func TestHeaderText(t *testing.T) {
	timing := Started()
	timing.Stamp("go_sent")
	for _, pair := range strings.Split(timing.Text(), ";") {
		name, value, hasValue := strings.Cut(pair, "=")
		if !hasValue || name == "" || strings.Trim(value, "0123456789") != "" || len(value) != 16 {
			t.Fatalf("pair %q is not a name and a microsecond count", pair)
		}
	}
}

func TestRequestID(t *testing.T) {
	timing := Started()
	firstStamp := strings.TrimPrefix(strings.Split(timing.Text(), ";")[0], "go_start=")
	if actual, expected := timing.RequestID(), fmt.Sprintf("%d-%s", os.Getpid(), firstStamp); actual != expected {
		t.Fatalf("request id %q, want %q", actual, expected)
	}
}
