package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
	"time"

	"journal-agent/client"
	"journal-agent/dockerstandin"
	"journal-agent/drivers"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/profiles"
	"journal-agent/serving"

	"github.com/moby/moby/api/types/mount"
)

// The start scenarios run the host's real start code on the messages the journal really sends, which both test
// suites keep as files under tests/Contracts (the journal's side is checked by Tests\Support\Agents\HostContract).
// Docker is the one part that is swapped: a stand-in daemon the host's own Docker client talks to, which keeps what it
// is asked and runs a pretend driver. The normal test run never talks to a real Docker.

// contractFolder holds the messages of one scenario, the same files the journal's tests read and write.
const contractFolder = "../../../../tests/Contracts/host-start/protected-headless-claude"

// realDockerSwitch names the real Docker daemon for the installation suite, which runs these scenarios on purpose
// and never as part of the normal tests.
const realDockerSwitch = "JOURNAL_SCENARIOS_DOCKER"

// The turn a pretend Claude Code prints, after the line the protected-account init prints once it runs.
const (
	pretendInitLine   = "journal-init: ready\n"
	pretendResultLine = `{"type":"result","subtype":"success","is_error":false,"uuid":"result-1"}` + "\n"
)

// pretendDriver is what a scenario's containers run: a version check answers as the agent image's clients would, and
// a turn's own container prints the turn a pretend Claude Code runs on the model its command names.
func pretendDriver(created *dockerstandin.Container) dockerstandin.Program {
	command := created.Config.Cmd
	switch {
	case slices.Contains(command, "--version") && slices.Contains(created.Config.Entrypoint, "codex"):
		return dockerstandin.Printing("codex-cli 0.165.0\n", 0)
	case slices.Contains(command, "--version"):
		return dockerstandin.Printing("2.1.323 (Claude Code)\n", 0)
	case created.Name == "" || created.Config.Tty:
		return nil
	}

	model := ""
	if named := slices.Index(command, "--model"); named >= 0 && named+1 < len(command) {
		model = command[named+1]
	}
	started := `{"type":"system","subtype":"init","model":"` + model + `"}` + "\n"

	return dockerstandin.Printing(pretendInitLine+started+pretendResultLine, 0)
}

// scenarioDaemon is the Docker of a scenario: a stand-in daemon that holds the agent image and runs the pretend
// driver, and the host's containers on it.
func scenarioDaemon(t *testing.T, image string) (host.Containers, *dockerstandin.Daemon) {
	t.Helper()
	if os.Getenv(realDockerSwitch) != "" {
		t.Fatalf("%s is set: the normal tests never talk to a real Docker", realDockerSwitch)
	}
	daemon := dockerstandin.Start(t, image)
	daemon.Programs = pretendDriver
	rules := host.ContainerRules{Arrangement: host.Contained, InstallationName: "acme", AgentImage: image}
	containers, err := host.ContainersOn(daemon.Host(), rules)
	if err != nil {
		t.Fatal(err)
	}

	return containers, daemon
}

// turnContainer is the container the daemon was last asked to create under a name: a turn's own.
func turnContainer(t *testing.T, daemon *dockerstandin.Daemon) *dockerstandin.Container {
	t.Helper()
	created := daemon.Created()
	for index := len(created) - 1; index >= 0; index-- {
		if created[index].Name != "" {
			return created[index]
		}
	}
	t.Fatalf("no turn's container was created: %v", daemon.Requests())

	return nil
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

func (recorded *recordedReports) NotifyProtection(_ context.Context, report client.ProtectionReport) error {
	recorded.reports = append(recorded.reports, report)

	return nil
}

// A contained host tells the journal how each program's protection stands in the agent image; for Claude Code under
// the protected-account profile, with no run recorded yet, every item has its mechanism and awaits its evidence.
func TestScenarioTheHostReportsTheProtectionOfTheAgentImage(t *testing.T) {
	containers, _ := scenarioDaemon(t, "sha256:image")
	sent := &recordedReports{}

	err := host.NotifyContainedProtection(context.Background(), containers, "", host.NativeEvidence{Folder: t.TempDir()}, sent)

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
	skill := client.StartFile{Path: "skills/journal/SKILL.md", Content: "# Journal\n"}
	grant.Folders = []client.StartFolder{
		{Name: "journal-skills", Arguments: []string{"--plugin-dir"}, Files: []client.StartFile{skill}},
	}
	prepared := host.PreparedStart{Grant: grant, Claim: claim}
	manifest, named, err := prepared.ContainerManifest()
	if err != nil || !named {
		t.Fatalf("the grant's container is not one the host reads: %v", err)
	}
	containers, daemon := scenarioDaemon(t, manifest.Image)
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
	case end := <-driver.Finished():
		if end.ExitCode == nil || *end.ExitCode != 0 || end.Problem != "" {
			t.Fatalf("the turn ended with %+v", end)
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
	created := turnContainer(t, daemon)
	config, hostConfig := created.Config, created.HostConfig
	if config.User != "0:0" || config.Image != manifest.Image || !hostConfig.ReadonlyRootfs ||
		!slices.Equal(hostConfig.CapAdd, dockerstandin.Capabilities("SETUID", "SETGID", "SETPCAP")) ||
		!slices.Contains(hostConfig.SecurityOpt, "no-new-privileges") {
		t.Errorf("the turn's container was not created as the protected profile asks: %+v %+v", config, hostConfig)
	}
	mounted := func(target string) bool {
		return slices.ContainsFunc(hostConfig.Mounts, func(mount mount.Mount) bool { return mount.Target == target })
	}
	if !mounted("/home/journal/.account") || !mounted("/workspace") || !mounted(host.SessionFilesTarget) {
		t.Errorf("the turn's container lacks its account, its workspace or its session files: %+v", hostConfig.Mounts)
	}
	plugin := slices.Index(config.Cmd, "--plugin-dir")
	if plugin < 0 || config.Cmd[plugin+1] != host.SessionFilesTarget+"/journal-skills" {
		t.Errorf("the turn is not pointed at its skills in the session files: %v", config.Cmd)
	}
	writer := slices.IndexFunc(daemon.Created(), func(created *dockerstandin.Container) bool {
		return created.Name == "" && strings.Contains(strings.Join(created.Config.Cmd, " "), "skills/journal/SKILL.md")
	})
	if writer < 0 {
		t.Errorf("no container wrote the session's skills before the turn: %v", daemon.Requests())
	}
	model := slices.Index(config.Cmd, "--model")
	if model < 0 || config.Cmd[model+1] != *grant.Runtime.Model || !slices.Contains(config.Cmd, "--print") ||
		!slices.Contains(config.Env, "CLAUDE_CODE_SHELL=/opt/journal/shell/bash") {
		t.Errorf("the turn does not run on the model asked for, without a terminal, with the journal's shell: %v %v",
			config.Cmd, config.Env)
	}
	// The settings travel inline as indented JSON, so they are read with their spaces and line breaks taken out.
	settings := strings.NewReplacer(" ", "", "\n", "").Replace(strings.Join(config.Cmd, " "))
	if !strings.Contains(settings, `"sandbox":{"enabled":false}`) {
		t.Errorf("the turn's settings keep Claude Code's own sandbox on:\n%v", config.Cmd)
	}
	if config.Tty || config.OpenStdin || hostConfig.Privileged {
		t.Errorf("the turn's container was created with a terminal or privileges: %+v", config)
	}
}

// A contained session with a terminal lives its whole life through the daemon. Its container is created
// with a terminal and started, the host holds that terminal through the daemon's attach at the window's size, what is
// typed reaches the program, a hangup of the terminal leaves the program running as a lost connection, and the stop
// removes the container and its network.
func TestScenarioAContainedSessionsTerminalIsHeldThroughTheDaemonFromStartToStop(t *testing.T) {
	var grant client.Grant
	var claim client.ClaimedStart
	readContract(t, "grant.json", &grant)
	readContract(t, "claim.json", &claim)
	grant.Container = json.RawMessage(strings.Replace(string(grant.Container), `"isAttachable": false`, `"isAttachable": true`, 1))
	prepared := host.PreparedStart{Grant: grant, Claim: claim}
	manifest, _, err := prepared.ContainerManifest()
	if err != nil || !manifest.IsAttachable {
		t.Fatalf("the scenario's container was not made attachable: %v", err)
	}
	containers, daemon := scenarioDaemon(t, manifest.Image)
	opener := runtimeOpener{containers: containers, installation: "acme"}
	session := opener.sessionContainer("runtime-1", prepared, manifest)
	ctx := context.Background()

	if err := session.Open(ctx, manifest, host.ContainerProcess{Command: []string{"claude"}}); err != nil {
		t.Fatalf("the session's container did not open: %v", err)
	}
	instance, err := containers.InstanceID(ctx, session.Name)
	if err != nil {
		t.Fatal(err)
	}
	folder, err := os.MkdirTemp("/tmp", "ja")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { os.RemoveAll(folder) })
	socket := &host.AttachSocket{
		Folder: folder, Layout: layoutOf, Start: startTerminalOn(containers), InstanceRuns: instanceRunsOn(containers),
	}
	listener, err := socket.Listen()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { listener.Close() })
	opened, err := socket.Open(host.AttachRequest{
		RuntimeID: "runtime-1", Driver: "claude", Rows: 12, Columns: 40, ContainerInstance: instance,
	})
	if err != nil {
		t.Fatalf("the session's terminal was not attached: %v", err)
	}

	created, _ := daemon.Container(session.Name)
	if rows, columns := created.Size(); !created.Config.Tty || !created.IsRunning() || rows != 12 || columns != 40 {
		t.Fatalf("the container's terminal is %d by %d, running %t", rows, columns, created.IsRunning())
	}
	typed := "hi"
	if err := opened.Gate.UserTyped([]byte(typed)); err != nil {
		t.Fatal(err)
	}
	eventually(t, "what was typed reached the program", func() bool { return created.Typed() == typed })

	if err := opened.Hangup(); err != nil {
		t.Fatal(err)
	}
	eventually(t, "a hangup while the container runs is a lost connection", func() bool {
		return socket.LostConnection("runtime-1")
	})
	if !created.IsRunning() {
		t.Fatal("a hangup of the terminal ended the session's program")
	}

	if err := session.Stop(ctx, manifest.Network); err != nil {
		t.Fatalf("the session did not stop: %v", err)
	}
	if _, held := daemon.Container(session.Name); held || socket.LostConnection("runtime-1") {
		t.Fatalf("the stopped session's container stayed, or still counts as a lost connection: %v", daemon.Requests())
	}
}

// eventually waits until what is said holds, and fails when it does not within a few seconds.
func eventually(t *testing.T, said string, holds func() bool) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	for !holds() {
		if time.Now().After(deadline) {
			t.Fatalf("it never held that %s", said)
		}
		time.Sleep(10 * time.Millisecond)
	}
}

// recordingJournal is the journal as the serving loop reports to it: it keeps every request report and exit.
type recordingJournal struct {
	requests chan client.RequestReport
	exits    chan client.LivenessReport
}

func (journal recordingJournal) NotifyRequest(_ context.Context, report client.RequestReport) error {
	journal.requests <- report

	return nil
}

func (journal recordingJournal) NotifyActivity(context.Context, client.ActivityReport) error {
	return nil
}

func (journal recordingJournal) NotifyExit(_ context.Context, report client.LivenessReport) error {
	journal.exits <- report

	return nil
}

func (recordingJournal) NotifyHeartbeat(context.Context, client.LivenessReport) error { return nil }

func (recordingJournal) NotifyReplayed(context.Context, string, string, string) error { return nil }

func (recordingJournal) NotifyStale(context.Context, string, client.EntryStaleReport) error {
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
func TestScenarioTheHostServesTheClaimedDeliveryAndReportsItsTurnEnd(t *testing.T) {
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
	containers, _ := scenarioDaemon(t, manifest.Image)
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
			if report.TurnEnd == nil {
				if report.Progress == string(contracts.ProgressFailed) || report.RefusalReason != nil {
					t.Fatalf("the delivery was reported %+v", report)
				}

				continue
			}
			if report.ActualBinding == nil || len(*report.ActualBinding) != 36 {
				t.Fatalf("the ended turn names the conversation %v", report.ActualBinding)
			}
			conversation := fixedConversation
			report.ActualBinding = &conversation
			holdContract(t, "request-report.json", report)

			return
		case exit := <-journal.exits:
			t.Fatalf("the runtime was reported ended: %+v", exit)
		case <-time.After(15 * time.Second):
			t.Fatal("the delivery's turn was never reported ended")
		}
	}
}

func TestAClaimedRuntimeIsReportedRunningWhenItOpensAndStoppedWhenItEndsAndOneThatDoesNotOpenIsNot(t *testing.T) {
	var reported []host.StartReport
	starts := &claimedStarts{keys: map[string]string{}, report: func(report host.StartReport) {
		reported = append(reported, report)
	}}
	prepared := host.PreparedStart{Claim: client.ClaimedStart{StartKey: "start-1"}}
	opening := starts.opening(func(string, host.PreparedStart) (serving.Runtime, error) {
		return drivers.NewHeadlessDriver(drivers.HeadlessRuntime{}, 3), nil
	})
	failing := starts.opening(func(string, host.PreparedStart) (serving.Runtime, error) {
		return nil, host.ErrContainerNotCreated
	})
	journal := endedStarts{Journal: recordingJournal{exits: make(chan client.LivenessReport, 2)}, starts: starts}

	if _, err := opening("runtime-1", prepared); err != nil {
		t.Fatal(err)
	}
	if _, err := failing("runtime-2", prepared); err == nil {
		t.Fatal("a runtime that did not open gave no error")
	}
	for _, runtimeID := range []string{"runtime-1", "runtime-2"} {
		if err := journal.NotifyExit(context.Background(), client.LivenessReport{RuntimeID: runtimeID}); err != nil {
			t.Fatal(err)
		}
	}

	want := []host.StartReport{
		{StartKey: "start-1", Kind: host.NotifyRunning, Execution: "runtime-1:3"},
		{StartKey: "start-1", Kind: host.NotifyStopped},
	}
	if !slices.Equal(reported, want) {
		t.Fatalf("the starts were reported %+v", reported)
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
	grant.Container = json.RawMessage(strings.Replace(string(grant.Container), `"isAttachable": false`, `"isAttachable": true`, 1))
	prepared := host.PreparedStart{Grant: grant, Claim: claim}
	manifest, _, err := prepared.ContainerManifest()
	if err != nil || !manifest.IsAttachable {
		t.Fatalf("the scenario's container was not made attachable: %v", err)
	}
	containers, _ := scenarioDaemon(t, manifest.Image)
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
			if *report.RefusalReason != string(contracts.RefusalContainerUnavailable) || !report.HasCreatedNoProcess {
				t.Fatalf("the refusal was reported as %q, no process made: %t", *report.RefusalReason, report.HasCreatedNoProcess)
			}
			// The journal's test posts this report and sees the session end with its reason.
			holdContract(t, "request-report-refused.json", report)

			return
		case <-time.After(15 * time.Second):
			t.Fatal("the start was never reported refused")
		}
	}
}
