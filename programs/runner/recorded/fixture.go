package recorded

import (
	"path/filepath"
	"testing"

	"journal-runner/recording"
)

// MustTerminal reads the first terminal exchange of the scenario and the fixture made from it.
func MustTerminal(t testing.TB, driver, name string) (Exchange, recording.Fixture) {
	t.Helper()
	for _, exchange := range MustLoad(t, driver, name).ExchangesOn(recording.WireDriver) {
		fixture := mustFixture(t, exchange.Folder)
		if fixture.Mode == recording.TerminalMode {
			return exchange, fixture
		}
	}
	t.Fatalf("the recording %s/%s has no terminal exchange", driver, name)
	return Exchange{}, recording.Fixture{}
}

// MustProbe reads a program's recorded probe under its pinned build.
func MustProbe(t testing.TB, driver, name string) recording.Fixture {
	t.Helper()
	root, err := Root()
	if err != nil {
		t.Fatal(err)
	}
	build, err := buildOf(root, driver)
	if err != nil {
		t.Fatal(err)
	}
	return mustFixture(t, filepath.Join(root, "resources/recordings", driver, build, "exchanges", name))
}

func mustFixture(t testing.TB, folder string) recording.Fixture {
	t.Helper()
	fixture, err := recording.Load(folder)
	if err != nil {
		t.Fatal(err)
	}
	return fixture
}
