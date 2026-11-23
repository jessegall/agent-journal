package main

import (
	"context"
	"errors"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync/atomic"

	"journal-agent/client"
	"journal-agent/drivers"
	drivercontracts "journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/profiles/contracts"
	"journal-agent/serving"
)

// Where a contained program finds its own things in the agent image: its home on the container's tmpfs, its account
// folder bound at the account home, the journal's hook and MCP relays, and the program on the image's PATH. Its
// settings travel inline in its arguments, since the container's root is read-only and holds no host file.
const (
	containerHome           = "/home/journal"
	containerAccount        = "/home/journal/.account"
	containerSettingsFolder = "/home/journal/.journal-settings"
	containerHookCommand    = "/opt/journal/bin/journal-hook"
	containerMcpRelay       = "/opt/journal/bin/journal-mcp"
	containerPath           = "/opt/journal/bin:/usr/local/bin:/usr/bin:/bin"
	containerWorkspace      = "/workspace"
)

// egressVariables are the proxy settings a contained program keeps, so its only way out is the egress proxy.
var egressVariables = []string{"HTTP_PROXY", "HTTPS_PROXY", "NO_PROXY", "http_proxy", "https_proxy", "no_proxy"}

// containedTerminalRuntime runs a terminal runtime whose session is contained: its program is its session
// container's own process, created from the manifest the journal compiled, and the host drives it through the
// attach the attach socket runs on its PTY, so the screen and every key pass the same gate as for a host child. A
// stop is the container's proven stop; its exit, a crash or an out-of-memory kill included, is reported as the
// runtime's exit.
func (opener runtimeOpener) containedTerminalRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.DriverProfile,
	manifest host.ContainerManifest,
) (serving.Runtime, error) {
	conversationID, err := newConversationID()
	if err != nil {
		return nil, err
	}

	base := startInContainer(prepared.Grant, conversationID, manifest)
	process, err := containedProcessOf(profile, opener.sessionJournalURL, prepared, runtimeID, base.Terminal(false),
		prepared.Grant.Runtime.ProcessGeneration, os.Environ())
	if err != nil {
		return nil, err
	}

	resumed, err := containedProcessOf(profile, opener.sessionJournalURL, prepared, runtimeID, base.Terminal(true),
		prepared.Grant.Runtime.ProcessGeneration, os.Environ())
	if err != nil {
		return nil, err
	}

	process.Restart = resumed.Command
	process.Transcript = host.ConversationTranscript{Folder: containerAccount, ConversationID: conversationID}
	container := opener.sessionContainer(runtimeID, prepared, manifest)
	ctx := context.Background()
	if err := opener.writeProtectedAccountFiles(ctx, profile, manifest); err != nil {
		return nil, err
	}

	attach, err := container.Open(ctx, manifest, process)
	if err != nil {
		return nil, err
	}
	instance, err := opener.containers.InstanceID(ctx, container.Name)
	if err != nil {
		return nil, errors.Join(err, container.Stop(ctx, manifest.Network))
	}

	opened, err := opener.socket.Open(host.AttachRequest{
		RuntimeID: runtimeID, Driver: profile.Driver(), Command: attach, Folder: opener.stateFolder,
		Env: []string{"PATH=" + os.Getenv("PATH")}, Rows: defaultRows, Columns: defaultColumns,
		ContainerInstance: instance,
	})
	if err != nil {
		return nil, errors.Join(err, container.Stop(ctx, manifest.Network))
	}

	runtime := &containedRuntime{
		Runtime:   terminalDriverOf(profile, opened, prepared.Grant.Runtime.ProcessGeneration, conversationID),
		container: container,
		manifest:  manifest,
		ended:     make(chan string, 1),
	}
	go runtime.watchEnd(runtimeID)

	return runtime, nil
}

// containedHeadlessRuntime runs a runtime without a terminal whose session is contained, such as a helper's: one turn
// at a time, each turn's program its session container's own process, created afresh for the turn on the session's
// volumes. A stop is the container's proven stop; a turn's end is the end of that turn, not of the runtime.
func (opener runtimeOpener) containedHeadlessRuntime(
	runtimeID string,
	prepared host.PreparedStart,
	profile contracts.DriverProfile,
	manifest host.ContainerManifest,
) (serving.Runtime, error) {
	conversationID, err := newConversationID()
	if err != nil {
		return nil, err
	}

	if err := opener.writeProtectedAccountFiles(context.Background(), profile, manifest); err != nil {
		return nil, err
	}

	container := opener.sessionContainer(runtimeID, prepared, manifest)
	grant := prepared.Grant
	driver := drivers.NewHeadlessDriver(drivers.HeadlessRuntime{
		Start:   startInContainer(grant, conversationID, manifest),
		Profile: profile,
		Container: containedTurns{
			container: container, manifest: manifest, profile: profile, journalURL: opener.sessionJournalURL,
			prepared: prepared, runtimeID: runtimeID,
		},
		Usage: opener.usageOf(prepared),
	}, grant.Runtime.ProcessGeneration)

	return &containedRuntime{Runtime: driver, container: container, manifest: manifest}, nil
}

// writeProtectedAccountFiles writes, for a protected start of a profile that needs them, the files its account's
// folder must hold that no argument can carry; any other start writes nothing.
func (opener runtimeOpener) writeProtectedAccountFiles(
	ctx context.Context,
	profile contracts.DriverProfile,
	manifest host.ContainerManifest,
) error {
	needs, needsFiles := profile.(contracts.ProtectedAccountFiles)
	if !needsFiles || !manifest.IsProtected() {
		return nil
	}

	for _, file := range needs.ProtectedAccountFiles() {
		if err := opener.containers.WriteAccountFile(ctx, manifest.AccountFolder(), file.Name, file.Content); err != nil {
			return err
		}
	}

	return nil
}

// sessionContainer is the one container of the start's session, named for the installation and the session and
// labelled with its launch and its account.
func (opener runtimeOpener) sessionContainer(
	runtimeID string,
	prepared host.PreparedStart,
	manifest host.ContainerManifest,
) host.SessionContainer {
	session := prepared.Grant.Runtime.SessionID

	return host.SessionContainer{
		Containers: opener.containers,
		Name:       string(opener.installation) + "-" + session,
		Labels: host.LaunchLabels{
			Installation: string(opener.installation), Launch: runtimeID, Session: session,
			Account: manifest.AccountFolder(),
		},
	}
}

// containedTurns runs each turn of a contained runtime without a terminal in its session's own container.
type containedTurns struct {
	container  host.SessionContainer
	manifest   host.ContainerManifest
	profile    contracts.DriverProfile
	journalURL string
	prepared   host.PreparedStart
	runtimeID  string
}

func (turns containedTurns) TurnCommand(start contracts.Start, generation int) (*exec.Cmd, error) {
	process, err := containedProcessOf(turns.profile, turns.journalURL, turns.prepared, turns.runtimeID, start,
		generation, os.Environ())
	if err != nil {
		return nil, err
	}

	return turns.container.Turn(context.Background(), turns.manifest, process)
}

// containedProcessOf is the program's own process for its session container, for the start given (its mode,
// conversation, prompt and settings) at the process generation given: the pinned profile's command line with its
// settings inline, the image's paths for its home, account and relays, and an environment that names no path of the
// host: the account recipe's settings with the account folder at the account home, the start's credential and
// generation, its pinned profile and the egress proxy.
func containedProcessOf(
	profile contracts.DriverProfile,
	journalURL string,
	prepared host.PreparedStart,
	runtimeID string,
	start contracts.Start,
	generation int,
	inherited []string,
) (host.ContainerProcess, error) {
	account := prepared.AccountStart(&contracts.JournalServer{Command: containerMcpRelay, Standalone: true}, runtimeID)
	account.Folder = containerAccount
	account.Protection = strings.ReplaceAll(account.Protection, prepared.Claim.Directory, containerAccount)
	start.SettingsFolder = containerSettingsFolder
	start.HookCommand = containerHookCommand
	start.WorkFolder = containerWorkspace
	start.Account = account
	files, err := profile.SettingsFiles(start)
	if err != nil {
		return host.ContainerProcess{}, err
	}

	arguments, err := profile.Arguments(start)
	if err != nil {
		return host.ContainerProcess{}, err
	}

	grant := prepared.Grant
	environment := profile.Environment(containedRecipeEnvironment(prepared.Claim), start)
	environment = append(environment,
		"JOURNAL_URL="+journalURL, "JOURNAL_START_TOKEN="+grant.Token,
		"JOURNAL_PROCESS_GENERATION="+strconv.Itoa(generation),
		"JOURNAL_START_KEY="+prepared.Claim.StartKey)
	environment = append(environment, grant.ProfileEnvironment()...)
	environment = append(environment, egressOf(inherited)...)

	return host.ContainerProcess{
		Command:     append([]string{profile.Driver()}, inlineSettings(arguments, containerSettingsFolder, files)...),
		Environment: environment,
	}, nil
}

// containedRecipeEnvironment is the account recipe's environment inside the container: its home and PATH in the
// image, the account folder at the account home, empty folders under the home, and no other path of the host.
func containedRecipeEnvironment(claim client.ClaimedStart) []string {
	environment := []string{"HOME=" + containerHome, "PATH=" + containerPath}
	for _, name := range claim.Recipe.EmptyFolderVariables {
		environment = append(environment, name+"="+filepath.Join(containerHome, ".empty", name))
	}

	for _, setting := range claim.Recipe.Environment {
		switch {
		case setting.Value == claim.Directory:
			environment = append(environment, setting.Name+"="+containerAccount)
		case !strings.HasPrefix(setting.Value, "/"):
			environment = append(environment, setting.Name+"="+setting.Value)
		}
	}

	return environment
}

// egressOf keeps the egress proxy settings of the host's environment, and nothing else of it.
func egressOf(inherited []string) []string {
	var kept []string
	for _, entry := range inherited {
		name, _, _ := strings.Cut(entry, "=")
		for _, egress := range egressVariables {
			if name == egress {
				kept = append(kept, entry)
			}
		}
	}

	return kept
}

// inlineSettings puts each settings file's content where the arguments name its path in the settings folder, so the
// program reads its settings from its own command line.
func inlineSettings(arguments []string, folder string, files []contracts.SettingsFile) []string {
	inlined := append([]string{}, arguments...)
	for index, argument := range inlined {
		for _, file := range files {
			if argument == filepath.Join(folder, file.Name) {
				inlined[index] = string(file.Content)
			}
		}
	}

	return inlined
}

// containedRuntime is a runtime whose program is its session container's own process: its stop is the container's
// proven stop, which removes the container and its network and keeps the session's volumes, and then removes a
// writer's checkout once the main's workspace holds its work.
type containedRuntime struct {
	serving.Runtime
	container host.SessionContainer
	manifest  host.ContainerManifest
	// stopped is set by a requested stop, whose end the serving loop reports itself.
	stopped atomic.Bool
	// ended says how the container's program ended on its own; a headless runtime, with a container a turn, has none.
	ended chan string
}

// Ended gives how the session container's program ended without a stop, for the serving loop to end the runtime.
func (runtime *containedRuntime) Ended() <-chan string { return runtime.ended }

func (runtime *containedRuntime) Stop(
	ctx context.Context,
	stop drivercontracts.StopRequest,
) (drivercontracts.OperationResult, error) {
	runtime.stopped.Store(true)
	if err := runtime.container.Stop(ctx, runtime.manifest.Network); err != nil {
		return drivercontracts.OperationResult{Request: stop.Request, Progress: drivercontracts.ProgressFailed}, err
	}

	kept, err := runtime.container.RemoveCheckout(ctx, runtime.manifest)
	if err != nil || kept != "" {
		log.Printf("the checkout of %s is kept for its work to be recovered: %s %v", runtime.container.Name, kept, err)
	}

	return drivercontracts.OperationResult{
		Request: stop.Request, Progress: drivercontracts.ProgressApplied, Outcome: drivercontracts.OutcomeConfirmed,
	}, nil
}

// watchEnd waits for the container's program to end and says how, so a crash, a removal or an out-of-memory kill
// ends the runtime in the serving loop like any other exit; after a requested stop it says nothing.
func (runtime *containedRuntime) watchEnd(runtimeID string) {
	defer close(runtime.ended)
	exit, err := runtime.container.Wait(context.Background(), runtime.manifest.Network)
	if err != nil {
		log.Printf("the end of runtime %s's container could not be read: %v", runtimeID, err)
		return
	}
	if runtime.stopped.Load() {
		return
	}
	runtime.ended <- exit.Evidence()
}
