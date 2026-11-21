package host

import (
	"os"
	"testing"
)

// TestMain lets the test binary stand in for a program a test starts: Codex's app-server, or the local project
// protection probe; otherwise it runs the tests.
func TestMain(m *testing.M) {
	if os.Getenv("FAKE_CODEX_APP_SERVER") != "" {
		serveFakeAppServer()
		os.Exit(0)
	}
	if os.Getenv(probeVariable) == "1" {
		if err := RunProtectionProbe(os.Args[len(os.Args)-2], os.Args[len(os.Args)-1]); err != nil {
			os.Exit(1)
		}
		os.Exit(0)
	}
	os.Exit(m.Run())
}
