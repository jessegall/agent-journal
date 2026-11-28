package hostapi

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/moby/moby/client"

	"journal-runner/dockermock"
	"journal-runner/host"
)

func imagesInstruction(images string) Instruction {
	return Instruction{ID: "allow", Type: "allow_images", Payload: `{"images":[` + images + `]}`}
}

// imagesTable is a contained host's table over a mock daemon that holds the images given.
func imagesTable(t *testing.T, allowed *host.AllowedImages, images ...string) *ProcessTable {
	t.Helper()
	daemon, err := client.New(client.WithHost(dockermock.Start(t, images...).Host()))
	if err != nil {
		t.Fatal(err)
	}
	rules := host.ContainerRules{Arrangement: host.Contained, Allowed: allowed}
	return &ProcessTable{containers: host.Containers{Daemon: daemon, Rules: rules}}
}

func TestAllowImagesReplacesTheImagesAContainedHostRunsAndAnswersThoseItLacks(t *testing.T) {
	allowed := host.NewAllowedImages()
	table := imagesTable(t, allowed, "agent@sha256:aaaa")

	facts, err := carry(testInstructions{ProcessTable: table}, "allow_images")(context.Background(),
		imagesInstruction(`"agent@sha256:aaaa","driver@sha256:cccc"`))
	if err != nil {
		t.Fatal(err)
	}

	if !allowed.Permits("agent@sha256:aaaa") || !allowed.Permits("driver@sha256:cccc") || allowed.Permits("agent@sha256:bbbb") {
		t.Fatal("the instruction did not make its images the only ones allowed")
	}
	if absent := facts["absent"].([]any); len(absent) != 1 || absent[0] != "driver@sha256:cccc" {
		t.Fatalf("the absent images were answered %v", facts["absent"])
	}
}

func TestAnImageHeldUnderAnotherDigestOrADaemonOutOfReachIsAnImageFaultAboutTheImage(t *testing.T) {
	daemon := dockermock.Start(t)
	daemon.Images["agent@sha256:aaaa"] = dockermock.Image{ID: "sha256:bbbb"}
	held, err := client.New(client.WithHost(daemon.Host()))
	if err != nil {
		t.Fatal(err)
	}
	gone, err := client.New(client.WithHost("tcp://127.0.0.1:1"))
	if err != nil {
		t.Fatal(err)
	}
	rules := host.ContainerRules{Arrangement: host.Contained, Allowed: host.NewAllowedImages()}

	faults := []string{}
	for _, daemon := range []*client.Client{held, gone} {
		table := &ProcessTable{containers: host.Containers{Daemon: daemon, Rules: rules}}
		_, err := carry(testInstructions{ProcessTable: table}, "allow_images")(context.Background(), imagesInstruction(`"agent@sha256:aaaa"`))
		var refusal RefusalError
		if !errors.As(err, &refusal) || refusal.Refusal != ImageFault || refusal.Facts["reference"] != "agent@sha256:aaaa" {
			t.Fatalf("the image was answered %v", err)
		}
		faults = append(faults, refusal.Facts["fault"].(string))
	}

	if strings.Join(faults, " ") != "digest_mismatch daemon_unavailable" {
		t.Fatalf("the faults were %v", faults)
	}
}

func TestAnImageThatIsNoDigestOrAHostWithNoSetRefusesTheInstruction(t *testing.T) {
	contained := &ProcessTable{containers: host.Containers{Rules: host.ContainerRules{Arrangement: host.Contained, Allowed: host.NewAllowedImages()}}}
	local := &ProcessTable{containers: host.Containers{Rules: host.ContainerRules{Arrangement: host.Local}}}

	_, tagged := carry(testInstructions{ProcessTable: contained}, "allow_images")(context.Background(), imagesInstruction(`"agent:latest"`))
	_, unset := carry(testInstructions{ProcessTable: local}, "allow_images")(context.Background(), imagesInstruction(`"agent@sha256:aaaa"`))

	var refusal RefusalError
	if !errors.As(tagged, &refusal) || !errors.As(unset, &refusal) {
		t.Fatalf("a tag or a host with no set did not refuse: %v, %v", tagged, unset)
	}
}
