package main

import (
	"context"
	"errors"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync/atomic"

	"journal-agent/client"
	drivercontracts "journal-agent/drivers/contracts"
	"journal-agent/host"
	"journal-agent/profiles/contracts"
	"journal-agent/recording"
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
	containerPHP            = "/usr/local/bin/php"
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
	profile contracts.ProgramProfile,
	manifest host.ContainerManifest,
) (serving.Runtime, error) {
	process, err := containedProcessOf(profile, opener.journalURL, prepared, runtimeID, os.Environ())
	if err != nil {
		return nil, err
	}

	session := prepared.Grant.Runtime.SessionID
	container := host.SessionContainer{
		Containers: opener.containers,
		Name:       string(opener.installation) + "-" + session,
		Labels: host.LaunchLabels{
			Installation: string(opener.installation), Launch: runtimeID, Session: session,
			Account: manifest.AccountFolder(),
		},
	}
	ctx := context.Background()
	attach, err := container.Open(ctx, manifest, process)
	if err != nil {
		return nil, err
	}

	opened, err := opener.socket.Open(host.AttachRequest{
		RuntimeID: runtimeID, Command: attach, Folder: opener.stateFolder,
		Env: []string{"PATH=" + os.Getenv("PATH")}, Rows: defaultRows, Columns: defaultColumns,
	})
	if err != nil {
		return nil, errors.Join(err, container.Stop(ctx, manifest.Network))
	}

	runtime := &containedRuntime{
		Runtime:   terminalDriverOf(profile, opened, prepared.Grant.Runtime.ProcessGeneration),
		container: container,
		network:   manifest.Network,
	}
	go runtime.reportExit(runtimeID, opener.reportExit)

	return runtime, nil
}

// containedProcessOf is the program's own process for its session container: the pinned profile's command line with
// its settings inline, the image's paths for its home, account and relays, and an environment that names no path of
// the host: the account recipe's settings with the account folder at the account home, the start's credential and
// generation, its pinned profile and the egress proxy.
func containedProcessOf(
	profile contracts.ProgramProfile,
	journalURL string,
	prepared host.PreparedStart,
	runtimeID string,
	inherited []string,
) (host.ContainerProcess, error) {
	conversationID, err := newConversationID()
	if err != nil {
		return host.ContainerProcess{}, err
	}

	account := prepared.AccountStart(&contracts.JournalServer{Command: containerPHP, Relay: containerMcpRelay}, runtimeID)
	account.Folder = containerAccount
	account.Protection = strings.ReplaceAll(account.Protection, prepared.Claim.Directory, containerAccount)
	start := contracts.Start{
		Mode: recording.TerminalMode, SettingsFolder: containerSettingsFolder, SessionID: conversationID,
		HookCommand: containerHookCommand, WorkFolder: containerWorkspace, Account: account,
	}
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
		"JOURNAL_PROCESS_GENERATION="+strconv.Itoa(grant.Runtime.ProcessGeneration),
		"JOURNAL_START_KEY="+prepared.Claim.StartKey)
	environment = append(environment, grant.ProfileEnvironment()...)
	environment = append(environment, egressOf(inherited)...)

	return host.ContainerProcess{
		Command:     append([]string{profile.Program()}, inlineSettings(arguments, containerSettingsFolder, files)...),
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

// containedRuntime is a terminal runtime whose program is its session container's own process: its stop is the
// container's proven stop, which removes the container and its network and keeps the session's volumes.
type containedRuntime struct {
	serving.Runtime
	container host.SessionContainer
	network   string
	// stopped is set by a requested stop, whose end the serving loop reports itself.
	stopped atomic.Bool
}

func (runtime *containedRuntime) Stop(
	ctx context.Context,
	stop drivercontracts.StopRequest,
) (drivercontracts.OperationResult, error) {
	runtime.stopped.Store(true)
	if err := runtime.container.Stop(ctx, runtime.network); err != nil {
		return drivercontracts.OperationResult{Request: stop.Request, Progress: drivercontracts.ProgressFailed}, err
	}

	return drivercontracts.OperationResult{
		Request: stop.Request, Progress: drivercontracts.ProgressApplied, Outcome: drivercontracts.OutcomeConfirmed,
	}, nil
}

// reportExit waits for the container's program to end and reports how as the runtime's exit, so a crash or an
// out-of-memory kill ends the session like any other exit.
func (runtime *containedRuntime) reportExit(
	runtimeID string,
	report func(ctx context.Context, report client.LivenessReport) error,
) {
	ctx := context.Background()
	exit, err := runtime.container.Wait(ctx, runtime.network)
	if err != nil {
		log.Printf("the end of runtime %s's container could not be read: %v", runtimeID, err)
		return
	}

	if report == nil || runtime.stopped.Load() {
		return
	}

	liveness := client.LivenessReport{
		RuntimeID: runtimeID, ProcessGeneration: runtime.Generation(), Evidence: exit.Evidence(),
	}
	if err := report(ctx, liveness); err != nil {
		log.Printf("the exit of runtime %s could not be reported: %v", runtimeID, err)
	}
}
