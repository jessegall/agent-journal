package socket

import (
	"net/http"
	"testing"
)

func TestTransportDisablesKeepAlives(t *testing.T) {
	transport, ok := Transport("/tmp/journal-test.sock").(*http.Transport)
	if !ok || !transport.DisableKeepAlives {
		t.Fatalf("the socket transport keeps its connections alive, so each one sits idle on the server")
	}
}
