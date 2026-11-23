package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/drivers"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/profiles"
	"journal-agent/serving"
)

// The start scenarios run the host's real start code on the messages the journal really sends, which both test
// suites keep as files under tests/Contracts (the journal's side is checked by Tests\Support\Agents\HostContract).
// Docker is the one part that is swapped: a stand-in program that records what it is asked and runs a pretend driver.
// The normal test run never talks to a real Docker.

// contractFolder holds the messages of one scenario, the same files the journal's tests read and write.
const contractFolder = "../../../../tests/Contracts/host-start/protected-headless-claude"

// realDockerSwitch names the real Docker program for the installation suite, which runs these scenarios on purpose
// and never as part of the normal tests.
const realDockerSwitch = "JOURNAL_SCENARIOS_DOCKER"

// standInDocker is a docker program for a scenario: it writes each call's arguments as one line to the calls file (a line
// break inside an argument, as in settings given inline, becomes a space),
// answers a version check as the agent image's clients would, an inspect as a container that is not running, the
// daemon's facts as one that holds budgets and the image asked for, and for
// the start of a created container prints the turn a pretend Claude Code runs on the model its command names.
const standInDocker = `#!/bin/sh
call=$(printf '%s' "$*" | tr '\n' ' ')
printf '%s\n' "$call" >> "$CALLS"
case "$1" in
    run)
        case "$*" in
            *"--entrypoint codex"*"--version") echo "codex-cli 0.165.0" ;;
            *"--version") echo "2.1.323 (Claude Code)" ;;
        esac ;;
    create) printf '%s\n' "$call" > "$CALLS.created"; echo "container-1" ;;
    inspect) echo "false" ;;
    info) echo "cgroupfs" ;;
    image) echo "$4" ;;
    start)
        model=$(sed -n 's/.* --model \([^ ]*\).*/\1/p' "$CALLS.created")
        echo "journal-init: ready"
        echo "{\"type\":\"system\",\"subtype\":\"init\",\"model\":\"$model\"}"
        echo '{"type":"result","subtype":"success","is_error":false,"uuid":"result-1"}' ;;
esac
exit 0
`

// scenarioDocker is the Docker of a scenario and the file its calls are written to.
func scenarioDocker(t *testing.T, image string) (host.Containers, string) {
	t.Helper()
	if os.Getenv(realDockerSwitch) != "" {
		t.Fatalf("%s is set: the normal tests never talk to a real Docker", realDockerSwitch)
	}
	folder := t.TempDir()
	calls := filepath.Join(folder, "calls.log")
	docker := filepath.Join(folder, "docker")
	if err := os.WriteFile(docker, []byte(standInDocker), 0o755); err != nil {
		t.Fatal(err)
	}
	t.Setenv("CALLS", calls)
	rules := host.ContainerRules{Arrangement: host.Contained, InstallationName: "acme", AgentImage: image}

	return host.Containers{Docker: docker, Rules: rules}, calls
}

// callsOf are the calls a scenario's Docker got so far, one per line.
func callsOf(t *testing.T, calls string) []string {
	t.Helper()
	content, err := os.ReadFile(calls)
	if err != nil {
		t.Fatal(err)
	}

	return strings.Split(strings.TrimSpace(string(content)), "\n")
}

// readContract reads one of the scenario's messages into the type the host's client decodes it into.
func readContract(t *testing.T, name string, into any) {
	t.Helper()
	content, err := os.ReadFile(filepath.Join(contractFolder, name))
	if err != nil {
		t.Fatalf("the contract %s is missing: %v", name, err)
	}
	if err := json.Unmarshal(content, into); err != nil {
		t.Fatalf("the contract %s is not what the host reads: %v", name, err)
	}
}

// holdContract checks that what the host sends still is the scenario's file. A file that is missing is written, and
// UPDATE_CONTRACTS=1 writes it anew for a change that is meant; removing the file and running again does the same.
func holdContract(t *testing.T, name string, sent any) {
	t.Helper()
	content, err := json.MarshalIndent(sent, "", "    ")
	if err != nil {
		t.Fatal(err)
	}
	content = append(content, '\n')
	path := filepath.Join(contractFolder, name)
	if _, missing := os.Stat(path); os.Getenv("UPDATE_CONTRACTS") == "1" || os.IsNotExist(missing) {
		if err := os.WriteFile(path, content, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	kept, err := os.ReadFile(path)
	if err != nil || string(kept) != string(content) {
		t.Fatalf("the host no longer sends the contract %s (remove the file to write it anew): %v\n%s", name, err, content)
	}
}

// recordedReports keeps the protection reports a host would send the journal.
type recordedReports struct{ reports []client.ProtectionReport }

func (recorded *recordedReports) ReportProtection(_ context.Context, report client.ProtectionReport) error {
	recorded.reports = append(recorded.reports, report)

	return nil
}

// A contained host tells the journal how each program's protection stands in the agent image; for Claude Code under
// the protected-account profile, with no run recorded yet, every item has its mechanism and awaits its evidence.
func TestScenarioTheHostReportsTheProtectionOfTheAgentImage(t *testing.T) {
	containers, _ := scenarioDocker(t, "sha256:image")
	sent := &recordedReports{}

	err := host.ReportContainedProtection(context.Background(), containers, "", host.NativeEvidence{Folder: t.TempDir()}, sent)

	if err != nil {
		t.Fatal(err)
	}
	for _, report := range sent.reports {
		if report.Driver == "claude-code" && report.Platform == host.ProtectedContainerPlatform {
			holdContract(t, "protection-report.json", report)

			return
		}
	}
	t.Fatalf("no report for Claude Code under the protected-account profile was sent: %+v", sent.reports)
}

// A protected headless Claude Code start, from the journal's own grant and claim: a driver on the trial may start, a
// driver off it may not, and the turn's container is created as the protected profile asks, with no terminal, on
// the model the journal asked for and with Claude Code's own sandbox off.
func TestScenarioAProtectedHeadlessClaudeStartRunsItsTurnInItsContainer(t *testing.T) {
	var grant client.Grant
	var claim client.ClaimedStart
	readContract(t, "grant.json", &grant)
	readContract(t, "claim.json", &claim)
	prepared := host.PreparedStart{Grant: grant, Claim: claim}
	manifest, named, err := prepared.ContainerManifest()
	if err != nil || !named {
		t.Fatalf("the grant's container is not one the host reads: %v", err)
	}
	containers, calls := scenarioDocker(t, manifest.Image)
	state := t.TempDir()

	if err := containedPrerequisites(state, "", trialDrivers("codex"), containers)(grant, claim); err == nil {
		t.Fatal("a driver off the trial started with no evidence")
	}
	if err := containedPrerequisites(state, "", trialDrivers("claude-code"), containers)(grant, claim); err != nil {
		t.Fatalf("the trial driver's start was refused: %v", err)
	}

	opener := runtimeOpener{containers: containers, installation: "acme", sessionJournalURL: "http://journal.test"}
	runtime, err := opener.containedHeadlessRuntime("runtime-1", prepared, profiles.ClaudeCode{}, manifest)
	if err != nil {
		t.Fatal(err)
	}
	driver := runtime.(*containedRuntime).Runtime.(*drivers.HeadlessDriver)
	request := contracts.RequestIdentity{RuntimeID: "runtime-1", RequestID: "request-1"}
	result, err := driver.Deliver(context.Background(), contracts.Delivery{Request: request, Parts: contracts.TextParts("hi")})
	if err != nil {
		t.Fatalf("the turn was not started: %v", err)
	}
	select {
	case err := <-driver.Finished():
		if err != nil {
			t.Fatalf("the turn ended with %v", err)
		}
	case <-time.After(10 * time.Second):
		t.Fatal("the turn never ended")
	}

	if result.Progress == contracts.ProgressFailed {
		t.Fatalf("the turn's delivery failed: %+v", result)
	}
	// The journal keeps this id for the request it applied, whole (driver_requests.actual_binding).
	if len(driver.NativeIdentity()) != 36 {
		t.Fatalf("the turn's conversation is %q, want the driver's 36-character session id", driver.NativeIdentity())
	}
	created := ""
	for _, call := range callsOf(t, calls) {
		if strings.HasPrefix(call, "create ") {
			created = call
		}
	}
	for _, want := range []string{
		"--user 0:0", "--read-only", "--cap-add SETUID", "--cap-add SETGID", "--cap-add SETPCAP",
		"--security-opt no-new-privileges", "target=/home/journal/.account", "target=/workspace",
		"--model " + *grant.Runtime.Model, "CLAUDE_CODE_SHELL=/opt/journal/shell/bash", "--print", manifest.Image,
	} {
		if !strings.Contains(created, want) {
			t.Errorf("the turn's container was created without %q:\n%s", want, created)
		}
	}
	// The settings travel inline as indented JSON, so they are read with their spaces taken out.
	if !strings.Contains(strings.ReplaceAll(created, " ", ""), `"sandbox":{"enabled":false}`) {
		t.Errorf("the turn's settings keep Claude Code's own sandbox on:\n%s", created)
	}
	for _, refused := range []string{" --tty", " -t ", " --interactive", "--privileged"} {
		if strings.Contains(created, refused) {
			t.Errorf("the turn's container was created with %q:\n%s", refused, created)
		}
	}
}

// recordingJournal is the journal as the serving loop reports to it: it keeps every request report and exit.
type recordingJournal struct {
	requests chan client.RequestReport
	exits    chan client.LivenessReport
}

func (journal recordingJournal) ReportRequest(_ context.Context, report client.RequestReport) error {
	journal.requests <- report

	return nil
}

func (journal recordingJournal) ReportActivity(context.Context, client.ActivityReport) error {
	return nil
}

func (journal recordingJournal) ReportExit(_ context.Context, report client.LivenessReport) error {
	journal.exits <- report

	return nil
}

func (recordingJournal) ReportReplayed(context.Context, string, string, string) error { return nil }

func (recordingJournal) ReportStale(context.Context, string, client.EntryStaleReport) error {
	return nil
}

func (recordingJournal) RaiseNavigation(context.Context, string, client.NavigationRaise) (client.NavigationAnswer, error) {
	return client.NavigationAnswer{}, nil
}

func (recordingJournal) InterruptNavigation(context.Context, string) error { return nil }

// preparedFromContracts prepares a runtime as the host does, from the journal's grant and claim and behind the same
// prerequisites, with no call to a journal.
type preparedFromContracts struct {
	prepared      host.PreparedStart
	prerequisites host.StartPrerequisites
}

func (preparation preparedFromContracts) Prepare(context.Context, string) (host.PreparedStart, error) {
	if err := preparation.prerequisites(preparation.prepared.Grant, preparation.prepared.Claim); err != nil {
		return host.PreparedStart{}, err
	}

	return preparation.prepared, nil
}

// fixedConversation stands for the conversation id the driver makes anew on every run.
const fixedConversation = "00000000-0000-4000-8000-000000000000"

// The whole way of one claimed request through the host: the serving loop takes the journal's claimed delivery,
// prepares and opens the protected headless runtime, runs its turn in the container and reports it applied, with the
// conversation the journal then keeps. What it reports is the message the journal's own test takes back.
func TestScenarioTheHostServesTheClaimedDeliveryAndReportsItApplied(t *testing.T) {
	var grant client.Grant
	var claim client.ClaimedStart
	var claimed client.Claim
	readContract(t, "grant.json", &grant)
	readContract(t, "claim.json", &claim)
	readContract(t, "requests.json", &claimed)
	prepared := host.PreparedStart{Grant: grant, Claim: claim}
	manifest, _, err := prepared.ContainerManifest()
	if err != nil {
		t.Fatal(err)
	}
	containers, _ := scenarioDocker(t, manifest.Image)
	state := t.TempDir()
	opener := runtimeOpener{
		containers: containers, installation: "acme", sessionJournalURL: "http://journal.test", stateFolder: state,
		declared: []client.HostDescriptor{{Key: grant.Runtime.DriverKey, Build: grant.Runtime.DriverBuild}},
	}
	journal := recordingJournal{requests: make(chan client.RequestReport, 8), exits: make(chan client.LivenessReport, 8)}
	preparation := preparedFromContracts{
		prepared:      prepared,
		prerequisites: containedPrerequisites(state, "", trialDrivers("claude-code"), containers),
	}
	loop := serving.NewLoop(journal, preparation, opener.open)

	loop.Take(context.Background(), claimed.Requests)

	for {
		select {
		case report := <-journal.requests:
			if report.Progress != string(contracts.ProgressApplied) {
				if report.Progress == string(contracts.ProgressFailed) || report.RefusalReason != nil {
					t.Fatalf("the delivery was reported %+v", report)
				}

				continue
			}
			if report.ActualBinding == nil || len(*report.ActualBinding) != 36 {
				t.Fatalf("the applied delivery names the conversation %v", report.ActualBinding)
			}
			conversation := fixedConversation
			report.ActualBinding = &conversation
			holdContract(t, "request-report.json", report)

			return
		case exit := <-journal.exits:
			t.Fatalf("the runtime was reported ended: %+v", exit)
		case <-time.After(15 * time.Second):
			t.Fatal("the delivery was never reported applied")
		}
	}
}

// A start the host cannot carry out is refused by name, with the reason and that no process was made, so the journal
// ends the session instead of leaving it waiting: here a driver without a terminal handed a container with one.
func TestScenarioAStartTheHostCannotCarryOutIsReportedRefusedWithItsReason(t *testing.T) {
	var grant client.Grant
	var claim client.ClaimedStart
	var claimed client.Claim
	readContract(t, "grant.json", &grant)
	readContract(t, "claim.json", &claim)
	readContract(t, "requests.json", &claimed)
	grant.Container = json.RawMessage(strings.Replace(string(grant.Container), `"attachable": false`, `"attachable": true`, 1))
	prepared := host.PreparedStart{Grant: grant, Claim: claim}
	manifest, _, err := prepared.ContainerManifest()
	if err != nil || !manifest.Attachable {
		t.Fatalf("the scenario's container was not made attachable: %v", err)
	}
	containers, _ := scenarioDocker(t, manifest.Image)
	state := t.TempDir()
	opener := runtimeOpener{
		containers: containers, installation: "acme", sessionJournalURL: "http://journal.test", stateFolder: state,
		declared: []client.HostDescriptor{{Key: grant.Runtime.DriverKey, Build: grant.Runtime.DriverBuild}},
	}
	journal := recordingJournal{requests: make(chan client.RequestReport, 8), exits: make(chan client.LivenessReport, 8)}
	preparation := preparedFromContracts{
		prepared:      prepared,
		prerequisites: containedPrerequisites(state, "", trialDrivers("claude-code"), containers),
	}

	serving.NewLoop(journal, preparation, opener.open).Take(context.Background(), claimed.Requests)

	for {
		select {
		case report := <-journal.requests:
			if report.Progress == string(contracts.ProgressApplied) {
				t.Fatalf("the delivery was reported applied: %+v", report)
			}
			if report.RefusalReason == nil {
				continue
			}
			if *report.RefusalReason != string(contracts.RefusalContainerUnavailable) || !report.NoProcessCreated {
				t.Fatalf("the refusal was reported as %q, no process made: %t", *report.RefusalReason, report.NoProcessCreated)
			}

			return
		case <-time.After(15 * time.Second):
			t.Fatal("the start was never reported refused")
		}
	}
}
