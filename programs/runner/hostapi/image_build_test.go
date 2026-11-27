package hostapi

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/moby/moby/client"

	"journal-runner/dockermock"
	"journal-runner/host"
)

// buildInstruction is the committed build_image of the conformance vectors, signed as the journal signs it.
func buildInstruction(t *testing.T) Instruction {
	t.Helper()
	vectors, _ := loadConformance(t)
	instruction := vectors.Instructions[1].Instruction
	instruction.ExpiresAt = testNow.Add(5 * time.Second)
	instruction.Signature = Sign(testSecret, instruction)
	return instruction
}

// nameOf is the name the committed build gives its image.
func nameOf(t *testing.T) string {
	t.Helper()
	plan, err := DecodePayload[host.ImageBuild](buildInstruction(t))
	if err != nil {
		t.Fatal(err)
	}
	return plan.Name
}

// answerOf is the answer the dispatch gives the instruction over a table of the containers given.
func answerOf(t *testing.T, containers host.Containers, instruction Instruction) Answer {
	t.Helper()
	record, err := OpenAnsweredRecord(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	var answer Answer
	table := &ProcessTable{containers: containers}
	dispatcher := NewDispatcher(testVerifier(), record, Executors(testInstructions{ProcessTable: table}),
		func(_ Instruction, given Answer) { answer = given })
	dispatcher.Submit(t.Context(), instruction)
	dispatcher.Wait()
	return answer
}

func TestAnAlteredBuildNeverReachesDocker(t *testing.T) {
	calls := 0
	server := httptest.NewServer(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { calls++ }))
	t.Cleanup(server.Close)
	daemon, err := client.New(client.WithHost("tcp://" + strings.TrimPrefix(server.URL, "http://")))
	if err != nil {
		t.Fatal(err)
	}
	altered := buildInstruction(t)
	altered.Payload = strings.Replace(altered.Payload, `"Dockerfile"`, `"Dockerfile.other"`, 1)

	answer := answerOf(t, host.Containers{Daemon: daemon}, altered)

	if answer.Refusal != Unsafe || calls != 0 {
		t.Fatalf("an altered build was answered %+v after %d calls to Docker", answer, calls)
	}
}

func TestABuildOnAHostWithoutADaemonIsAnImageFaultAboutItsName(t *testing.T) {
	answer := answerOf(t, host.Containers{}, buildInstruction(t))

	if answer.Refusal != ImageFault || answer.Facts["fault"] != "daemon_unavailable" || answer.Facts["reference"] != nameOf(t) {
		t.Fatalf("a build without a daemon was answered %+v", answer)
	}
}

func TestABuiltImageIsNotAllowedUntilTheJournalAllowsIt(t *testing.T) {
	daemon := dockermock.StartBuilds(t)
	played, err := client.New(client.WithHost(daemon.Host()))
	if err != nil {
		t.Fatal(err)
	}
	allowed := host.NewAllowedImages()
	containers := host.Containers{Daemon: played, Rules: host.ContainerRules{Arrangement: host.Contained, Allowed: allowed}}

	answer := answerOf(t, containers, buildInstruction(t))

	if answer.Status != Done || answer.Facts["image"] != dockermock.RecordedBuildImage {
		t.Fatalf("the recorded build was answered %+v", answer)
	}
	if allowed.Permits(dockermock.RecordedBuildImage) || allowed.Permits(nameOf(t)) {
		t.Fatal("a built image is allowed before allow_images names it")
	}
}
