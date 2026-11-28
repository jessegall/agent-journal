//go:build mock

package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"
	"testing"
	"time"

	"journal-runner/client"
	"journal-runner/dockermock"
	"journal-runner/host"
	"journal-runner/hostapi"
	"journal-runner/hostapitest"
	"journal-runner/recorded"
	"journal-runner/recording"
)

// replayDeadline is the longest a recorded scenario may take to play through the host whole.
const replayDeadline = 30 * time.Second

// recordedRules are the container rules of the host the scenario was recorded on, as its recorded plans show them: the
// data folder every daemon bind comes from and the installation name every volume starts with; the images it may run
// come from the recorded allow order, as on a host that starts.
func recordedRules(t *testing.T, scenario recorded.Scenario) host.ContainerRules {
	t.Helper()
	manifests := recordedManifests(t, scenario)
	sources := []string{}
	installation := ""
	for _, manifest := range manifests {
		for _, mount := range manifest.Mounts {
			switch mount.Type {
			case host.MountDaemonBind:
				sources = append(sources, mount.Source)
			case host.MountVolume:
				installation, _, _ = strings.Cut(mount.Source, "-")
			}
		}
	}
	return host.ContainerRules{Arrangement: host.Contained, Allowed: host.NewAllowedImages(),
		DataFolder: commonFolder(sources), InstallationName: host.InstallationName(installation)}
}

// recordedManifests are the containers the scenario's recorded plans open, with the containers that prepare them.
func recordedManifests(t *testing.T, scenario recorded.Scenario) []host.ContainerManifest {
	t.Helper()
	calls, err := scenario.Calls(recording.WireHost)
	if err != nil {
		t.Fatal(err)
	}
	manifests := []host.ContainerManifest{}
	for _, call := range calls {
		body, _ := base64.StdEncoding.DecodeString(call.Answered.Body)
		instructions, _ := hostapitest.ClaimedOf(call, body)
		for _, instruction := range instructions {
			var plan hostapi.OpenPlan
			if instruction.Type != "open_container" || json.Unmarshal([]byte(instruction.Payload), &plan) != nil || plan.Container == nil {
				continue
			}
			manifests = append(manifests, *plan.Container)
			for _, preparation := range plan.Container.Preparations {
				manifests = append(manifests, preparation.Manifest)
			}
		}
	}
	return manifests
}

// commonFolder is the deepest folder every path lies in.
func commonFolder(paths []string) string {
	if len(paths) == 0 {
		return ""
	}
	common := strings.Split(paths[0], "/")
	for _, other := range paths[1:] {
		parts := strings.Split(other, "/")
		length := 0
		for length < len(common) && length < len(parts) && common[length] == parts[length] {
			length++
		}
		common = common[:length]
	}
	return strings.Join(common, "/")
}

func recordedStartupImages(t *testing.T, scenario recorded.Scenario) host.PinnedImages {
	t.Helper()
	calls, err := scenario.Calls(recording.WireDocker)
	if err != nil {
		t.Fatal(err)
	}
	var images host.PinnedImages
	for _, call := range calls {
		_, reference, inspect := strings.Cut(call.Asked.Path, "/images/")
		if call.Asked.Method == http.MethodGet && inspect && strings.HasSuffix(reference, "/json") {
			images = append(images, strings.TrimSuffix(reference, "/json"))
			continue
		}
		if len(images) > 0 {
			break
		}
	}
	if len(images) == 0 {
		t.Fatal("the recorded host startup contains no pinned-image inspections")
	}
	return images
}

// TestARecordedTerminalTurnPlaysThroughTheHostWhole runs the host against the journal's side and the Docker daemon of
// a recorded Claude Code terminal turn, from the host's start, and waits until the host asked every call the journal
// answered.
func TestARecordedTerminalTurnPlaysThroughTheHostWhole(t *testing.T) {
	scenario := recorded.MustLoad(t, "claude-code", "terminal-turn")
	journalWire := hostapitest.Replay(t, scenario)
	docker := dockermock.Play(t, "claude-code", "terminal-turn")
	if err := verifyArrangement(host.Contained, recordedStartupImages(t, scenario), docker.Host(), ""); err != nil {
		t.Fatal(err)
	}
	containers, err := host.ContainersOn(docker.Host(), recordedRules(t, scenario))
	if err != nil {
		t.Fatal(err)
	}
	enrollment := client.Enrollment{JournalURL: journalWire.URL, HostID: "host", Secret: hostapitest.EnrollmentSecret}
	journal := client.New(enrollment).WithArrangement(string(host.Contained))
	ctx, stop := context.WithTimeout(t.Context(), replayDeadline)
	defer stop()

	if _, err := startHostProtocol(ctx, journal, enrollment, t.TempDir(), map[string]string{}, containers,
		"development", hostProtocolOptions{}); err != nil {
		t.Fatal(err)
	}

	for !journalWire.Calls.IsPlayedWhole() {
		select {
		case <-ctx.Done():
			journalWire.Calls.AssertPlayedWhole(t)
			return
		case <-time.After(100 * time.Millisecond):
		}
	}
}
