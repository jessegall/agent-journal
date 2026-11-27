package host

import (
	"bytes"
	"context"
	"strings"
	"testing"

	"github.com/moby/moby/client"

	"journal-runner/dockermock"
)

// recordedBuilds are the containers of a daemon that plays the recorded builds of a driver's image folder.
func recordedBuilds(t *testing.T) (Containers, *dockermock.BuildDaemon) {
	t.Helper()
	daemon := dockermock.StartBuilds(t)
	played, err := client.New(client.WithHost(daemon.Host()))
	if err != nil {
		t.Fatal(err)
	}
	return Containers{Daemon: played}, daemon
}

func recordedBuild(version string) ImageBuild {
	return ImageBuild{Name: "journal-driver:recorded", Base: "journal-candidate:build", Context: []byte("signed context"),
		Dockerfile: "Dockerfile", BuildArguments: []BuildArgument{{Name: "VERSION", Value: version}}, DeadlineMs: 60000,
		OutputLimit: 1 << 20}
}

func TestABuildAnswersDockersDigestAndTheCreatedByOfEachLayer(t *testing.T) {
	containers, _ := recordedBuilds(t)

	built, err := containers.BuildImage(context.Background(), recordedBuild("0.165.0"))

	if err != nil || built.Image != dockermock.RecordedBuildImage || built.ExitCode != 0 {
		t.Fatalf("the recorded build answered %+v, %v", built, err)
	}
	newest := built.History[len(built.History)-1]
	if !strings.Contains(newest, "/opt/journal/checks/driver-image.sh") {
		t.Fatalf("the newest layer was created by %q, not the image's own check", newest)
	}
}

func TestAFailedBuildAnswersTheStepsOwnErrorAndNoImage(t *testing.T) {
	containers, _ := recordedBuilds(t)

	built, err := containers.BuildImage(context.Background(), recordedBuild(dockermock.RecordedFailingVersion))

	if err != nil || built.Image != "" || built.ExitCode != 1 {
		t.Fatalf("the failed build answered %+v, %v", built, err)
	}
	for _, printed := range []string{"no pinned digest for", "did not complete successfully: exit code: 1"} {
		if !strings.Contains(built.Stderr, printed) {
			t.Errorf("the failed build's stderr lacks %q:\n%s", printed, built.Stderr)
		}
	}
}

func TestDockerIsHandedOnlyTheSignedContextItsDockerfileNameAndArguments(t *testing.T) {
	containers, daemon := recordedBuilds(t)

	if _, err := containers.BuildImage(context.Background(), recordedBuild("0.165.0")); err != nil {
		t.Fatal(err)
	}

	queries, contexts := daemon.Asked()
	asked := queries[0]
	got := []string{asked.Get("t"), asked.Get("dockerfile"), asked.Get("version"), asked.Get("buildargs"), asked.Get("remote")}
	want := []string{"journal-driver:recorded", "Dockerfile", "2", `{"BASE":"journal-candidate:build","VERSION":"0.165.0"}`, ""}
	if strings.Join(got, "|") != strings.Join(want, "|") || !bytes.Equal(contexts[0], []byte("signed context")) {
		t.Fatalf("Docker was asked %v with the context %q, not %v", got, contexts[0], want)
	}
}
