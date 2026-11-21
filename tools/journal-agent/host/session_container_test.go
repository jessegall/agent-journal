package host

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

// sessionDocker writes a docker stand-in for a session container: it logs every call without the --host pair, keeps
// whether the container runs in a state file, answers a cgroup driver, an absent network and the given wait answer.
func sessionDocker(t *testing.T, running bool, waited string) (SessionContainer, string) {
	t.Helper()
	folder := t.TempDir()
	log := filepath.Join(folder, "calls.log")
	state := filepath.Join(folder, "running")
	if running {
		if err := os.WriteFile(state, []byte("true"), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	script := `#!/bin/sh
[ "$1" = --host ] && shift 2
echo "$*" >> ` + log + `
case "$1" in
info) echo cgroupfs ;;
network) [ "$2" = inspect ] && exit 1; exit 0 ;;
volume) exit 0 ;;
create) echo c1 ;;
start) echo true > ` + state + ` ;;
stop) rm -f ` + state + ` ;;
inspect) case "$3" in *OOMKilled*) echo true ;; *) [ -f ` + state + ` ] && echo true || echo false ;; esac ;;
wait) rm -f ` + state + `; echo ` + waited + ` ;;
*) exit 0 ;;
esac
`
	path := filepath.Join(folder, "docker")
	if err := os.WriteFile(path, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
	containers := Containers{Docker: path, Host: "unix:///run/agent-docker/docker.sock", Rules: containedRules}
	labels := accountLabels("7")

	return SessionContainer{Containers: containers, Name: "journal-session-7", Labels: labels}, log
}

func attachableManifest() ContainerManifest {
	attachable := containedManifest()
	attachable.Network = "journal-session-7"
	attachable.Attachable = true

	return attachable
}

func TestASessionContainerRunsItsProgramAsItsOwnTerminalProcess(t *testing.T) {
	container, log := sessionDocker(t, false, "0")
	process := ContainerProcess{Command: []string{"claude", "--settings", "{}"}, Environment: []string{"HOME=/home/journal"}}

	attach, err := container.Open(context.Background(), attachableManifest(), process)
	if err != nil {
		t.Fatal(err)
	}

	made := calls(t, log)
	create := made[slices.IndexFunc(made, func(call string) bool { return strings.HasPrefix(call, "create ") })]
	for _, want := range []string{"--interactive --tty", "--network journal-session-7", "--env HOME=/home/journal",
		"journal/helper@sha256:abc claude --settings {}", "journal.account=7"} {
		if !strings.Contains(create, want) {
			t.Fatalf("the create lacks %q: %s", want, create)
		}
	}
	if !slices.Contains(made, "network create --label journal.installation=install-1 --label journal.session=session-7 journal-session-7") {
		t.Fatalf("the session's own network was not made: %v", made)
	}
	if !slices.Contains(made, "start journal-session-7") {
		t.Fatalf("the container was not started: %v", made)
	}
	if strings.Join(attach[1:], " ") != "--host unix:///run/agent-docker/docker.sock attach --sig-proxy=false journal-session-7" {
		t.Fatalf("the attach is %v", attach)
	}
}

func TestARunningSessionContainerIsAttachedAgainAfterARestart(t *testing.T) {
	container, log := sessionDocker(t, true, "0")

	attach, err := container.Open(context.Background(), attachableManifest(), ContainerProcess{Command: []string{"claude"}})
	if err != nil {
		t.Fatal(err)
	}

	if slices.ContainsFunc(calls(t, log), func(call string) bool { return strings.HasPrefix(call, "create ") }) {
		t.Fatalf("a running session container was created again: %v", calls(t, log))
	}
	if attach[len(attach)-1] != "journal-session-7" {
		t.Fatalf("the attach is %v", attach)
	}
}

func TestAContainerWithoutATerminalIsNoSessionContainer(t *testing.T) {
	container, log := sessionDocker(t, false, "0")

	_, err := container.Open(context.Background(), containedManifest(), ContainerProcess{Command: []string{"claude"}})
	if !errors.Is(err, ErrSessionContainerUnattachable) {
		t.Fatalf("an unattachable manifest gave %v", err)
	}
	if _, statErr := os.Stat(log); statErr == nil {
		t.Fatalf("docker was called: %v", calls(t, log))
	}
}

func TestAStopIsProvenAndRemovesTheContainerAndItsNetworkButKeepsTheVolumes(t *testing.T) {
	container, log := sessionDocker(t, true, "0")

	if err := container.Stop(context.Background(), "journal-session-7"); err != nil {
		t.Fatal(err)
	}

	made := calls(t, log)
	for _, want := range []string{"stop --time 10 journal-session-7", "rm --volumes journal-session-7",
		"network rm journal-session-7"} {
		if !slices.Contains(made, want) {
			t.Fatalf("the stop lacks %q: %v", want, made)
		}
	}
	if slices.ContainsFunc(made, func(call string) bool { return strings.HasPrefix(call, "volume rm") }) {
		t.Fatalf("a session volume was removed: %v", made)
	}
}

func TestAnOutOfMemoryKillIsTheRuntimesExit(t *testing.T) {
	container, log := sessionDocker(t, true, "137")

	exit, err := container.Wait(context.Background(), "journal-session-7")
	if err != nil {
		t.Fatal(err)
	}

	if exit.Code != 137 || !exit.OutOfMemory || !strings.Contains(exit.Evidence(), "memory") {
		t.Fatalf("the exit is %+v: %s", exit, exit.Evidence())
	}
	if !slices.Contains(calls(t, log), "network rm journal-session-7") {
		t.Fatalf("the ended container's network stayed: %v", calls(t, log))
	}
}
