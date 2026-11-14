package launch

import (
	"errors"
	"strings"
	"testing"
)

func TestTheHeaderBarNamesTheEnvironmentTheAgentAndTheViewerLink(t *testing.T) {
	header := HeaderBar("development", 7, "http://127.0.0.1:8420/?key=abc")
	for _, part := range []string{"development", "agent 7", "http://127.0.0.1:8420/?key=abc"} {
		if !strings.Contains(header, part) {
			t.Fatalf("the bar %q lacks %q", header, part)
		}
	}
}

func TestEachSystemOpensALinkWithItsOwnProgram(t *testing.T) {
	if OpenCommand("darwin") != "open" || OpenCommand("linux") != "xdg-open" || OpenCommand("windows") != "explorer" {
		t.Fatal("a system opens its links with another program")
	}
}

func TestTheViewerIsOpenedOnceWithItsLinkAndAFailureOnlySaysSo(t *testing.T) {
	var opened []string
	if line := OpenViewer("http://127.0.0.1:1/?key=k", func(program string, arguments ...string) error {
		opened = append(opened, arguments...)
		return nil
	}); line != "" || len(opened) != 1 || opened[0] != "http://127.0.0.1:1/?key=k" {
		t.Fatalf("opened %v and said %q", opened, line)
	}
	if line := OpenViewer("http://x", func(string, ...string) error { return errors.New("no browser") }); !strings.Contains(line, "no browser") {
		t.Fatalf("a failure said %q", line)
	}
	if OpenViewer("", func(string, ...string) error { t.Fatal("opened with no link"); return nil }) != "" {
		t.Fatal("an empty link gave a line")
	}
}
