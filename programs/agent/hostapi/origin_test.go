package hostapi

import (
	"errors"
	"testing"
)

func TestARemoteHostNeedsHttps(t *testing.T) {
	cases := map[string]error{
		"https://journal.example":  nil,
		"http://localhost:8080":    nil,
		"http://127.0.0.1:8080":    nil,
		"http://journal.example":   ErrInsecureOrigin,
		"http://192.168.1.20:8080": ErrInsecureOrigin,
	}
	for origin, want := range cases {
		if err := CheckOrigin(origin, false); !errors.Is(err, want) {
			t.Errorf("%s: %v, want %v", origin, err, want)
		}
	}
	if err := CheckOrigin("http://app:8000", true); err != nil {
		t.Errorf("a contained host's journal in its own network is refused: %v", err)
	}
}
