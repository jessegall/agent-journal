package host

import (
	"context"
	"encoding/json"
	"errors"
	"maps"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"journal-agent/client"
	"journal-agent/dockerstandin"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/api/types/mount"
	dockerclient "github.com/moby/moby/client"
)

var localRules = ContainerRules{Arrangement: Local}

var containedRules = ContainerRules{Arrangement: Contained, InstallationName: "journal", AgentImage: "journal/helper@sha256:abc"}

func manifest() ContainerManifest {
	return ContainerManifest{
		Image: "journal/helper@sha256:abc", User: "10001:10001", Workdir: "/workspace", IsReadOnlyRoot: true,
		BlocksNewPrivileges: true, Network: "none",
		Mounts:  []ContainerMount{{Type: MountBind, Source: "/workspaces/helper-7", Target: "/workspace", IsWritable: false}},
		Budgets: ContainerBudgets{CPUCores: 2, MemoryBytes: 1 << 30, MemorySwapBytes: 1 << 30, Processes: 256, OpenFiles: 1024},
	}
}

// standIn starts a stand-in Docker daemon that holds the images the tests' manifests name, and gives the containers
// that talk to it through Docker's own client under the rules.
func standIn(t *testing.T, rules ContainerRules) (Containers, *dockerstandin.Daemon) {
	t.Helper()
	daemon := dockerstandin.Start(t, manifest().Image, rules.AgentImage)
	containers, err := ContainersOn(daemon.Host(), rules)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = containers.Daemon.Close() })

	return containers, daemon
}

// seccompFile is the seccomp profile the tests' manifests name, a file as an installation holds one.
func seccompFile() string {
	path, err := filepath.Abs(filepath.Join("testdata", "seccomp.json"))
	if err != nil {
		panic(err)
	}

	return path
}

// seccompOption is the security option the daemon is sent for seccompFile: the file's own JSON, never its path.
func seccompOption(t *testing.T) string {
	t.Helper()
	content, err := os.ReadFile(seccompFile())
	if err != nil {
		t.Fatal(err)
	}

	return "seccomp=" + string(content)
}

// mountAt is the mount of the options at the target.
func mountAt(t *testing.T, options dockerclient.ContainerCreateOptions, target string) mount.Mount {
	t.Helper()

	return mountIn(t, options.HostConfig.Mounts, target)
}

// mountIn is the mount at the target among the mounts.
func mountIn(t *testing.T, mounts []mount.Mount, target string) mount.Mount {
	t.Helper()
	for _, mounted := range mounts {
		if mounted.Target == target {
			return mounted
		}
	}
	t.Fatalf("nothing is mounted at %s: %v", target, mounts)

	return mount.Mount{}
}

// scriptOf is what a throwaway container the daemon was asked for runs: its program's arguments, one text.
func scriptOf(created *dockerstandin.Container) string {
	return strings.Join(created.Config.Cmd, " ")
}

func TestAManifestBecomesABoundedUnprivilegedContainer(t *testing.T) {
	options, err := manifest().CreateOptions("helper-7", labels(), localRules)
	if err != nil {
		t.Fatal(err)
	}

	config, hostConfig := options.Config, options.HostConfig
	if options.Name != "helper-7" || config.Image != manifest().Image || config.User != "10001:10001" ||
		config.WorkingDir != "/workspace" {
		t.Fatalf("the container is %s as %s in %s from %s", options.Name, config.User, config.WorkingDir, config.Image)
	}
	if !hostConfig.ReadonlyRootfs || !slices.Contains(hostConfig.SecurityOpt, "no-new-privileges") ||
		!slices.Equal(hostConfig.CapDrop, []string{"ALL"}) || len(hostConfig.CapAdd) != 0 || hostConfig.NetworkMode != "none" {
		t.Fatalf("the container is not confined: %+v", hostConfig)
	}
	workspace := mountAt(t, options, "/workspace")
	if workspace.Type != mount.TypeBind || workspace.Source != "/workspaces/helper-7" || !workspace.ReadOnly ||
		workspace.BindOptions.Propagation != mount.PropagationRPrivate {
		t.Fatalf("the workspace is mounted as %+v", workspace)
	}
	budgets := hostConfig.Resources
	if budgets.NanoCPUs != 2*nanoCPUsInACore || budgets.Memory != 1<<30 || budgets.MemorySwap != 1<<30 ||
		*budgets.PidsLimit != 256 || budgets.Ulimits[0].Name != "nofile" || budgets.Ulimits[0].Hard != 1024 {
		t.Fatalf("the budgets are %+v", budgets)
	}
}

func TestAManifestAskingForMoreThanAHelperMayHaveIsRefused(t *testing.T) {
	unsafe := []func(*ContainerManifest){
		func(m *ContainerManifest) { m.IsPrivileged = true },
		func(m *ContainerManifest) { m.Capabilities = []string{"SYS_ADMIN"} },
		func(m *ContainerManifest) { m.Image = "journal/helper:latest" },
		func(m *ContainerManifest) {
			m.Mounts = append(m.Mounts, ContainerMount{Type: MountBind, Source: "/accounts"})
		},
		func(m *ContainerManifest) { m.PublishedPorts = []int{8080} },
	}
	for _, change := range unsafe {
		changed := manifest()
		change(&changed)

		if _, err := changed.CreateOptions("helper-7", labels(), localRules); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("an unsafe manifest gave %v", err)
		}
	}
}

func TestASavedAccountInAContainerIsRefusedBeforeAnythingIsCreated(t *testing.T) {
	if err := RequireContainerTransport("direct-processes"); !errors.Is(err, ErrContainerTransportUnsupported) {
		t.Fatalf("got %v", err)
	}
}

func containedManifest() ContainerManifest {
	contained := manifest()
	contained.Mounts = []ContainerMount{
		{Type: MountVolume, Source: "journal-session-7-workspace", Target: "/workspace"},
		{Type: MountDaemonBind, Source: "/srv/journal/accounts/7", Target: "/home/journal/.account", IsWritable: true},
		{Type: MountVolume, Source: "journal-account-7-projects", Target: "/home/journal/.account/projects", IsWritable: true},
	}
	contained.SecurityOptions = SecurityOptions{Seccomp: seccompFile(), AppArmor: "journal-agent"}
	contained.Budgets.TmpBytes = 128 << 20
	contained.Budgets.HomeBytes = 32 << 20

	return contained
}

func TestAContainedManifestMountsItsVolumesAndDaemonFoldersUnderItsProfiles(t *testing.T) {
	options, err := containedManifest().CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil {
		t.Fatal(err)
	}

	workspace := mountAt(t, options, "/workspace")
	account := mountAt(t, options, "/home/journal/.account")
	history := mountAt(t, options, "/home/journal/.account/projects")
	if workspace.Type != mount.TypeVolume || workspace.Source != "journal-session-7-workspace" || !workspace.ReadOnly {
		t.Fatalf("the workspace is mounted as %+v", workspace)
	}
	if account.Type != mount.TypeBind || account.Source != "/srv/journal/accounts/7" || account.ReadOnly ||
		account.BindOptions.Propagation != mount.PropagationRPrivate {
		t.Fatalf("the account is mounted as %+v", account)
	}
	if history.Type != mount.TypeVolume || history.Source != "journal-account-7-projects" || history.ReadOnly {
		t.Fatalf("the history is mounted as %+v", history)
	}

	security := options.HostConfig.SecurityOpt
	if !slices.Contains(security, seccompOption(t)) || !slices.Contains(security, "apparmor=journal-agent") {
		t.Fatalf("the security profiles are %v", security)
	}
	want := map[string]string{"/tmp": "size=134217728", "/run/journal": "size=16777216", "/home/journal": "size=33554432"}
	if !maps.Equal(options.HostConfig.Tmpfs, want) {
		t.Fatalf("the folders in memory are %v", options.HostConfig.Tmpfs)
	}
}

func TestASeccompProfileThatCannotBeReadRefusesTheContainer(t *testing.T) {
	unreadable := containedManifest()
	unreadable.SecurityOptions.Seccomp = filepath.Join(t.TempDir(), "missing.json")

	_, err := unreadable.CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if !errors.Is(err, ErrSeccompProfileUnreadable) {
		t.Fatalf("a missing seccomp profile gave %v", err)
	}

	named := containedManifest()
	named.SecurityOptions.Seccomp = "unconfined"
	options, err := named.CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil || !slices.Contains(options.HostConfig.SecurityOpt, "seccomp=unconfined") {
		t.Fatalf("a profile the daemon knows by name gave %v, %v", options.HostConfig, err)
	}
}

func TestAContainerOnAnAccountCarriesItsLabelAndBindsOnlyThatAccountsFolder(t *testing.T) {
	options, err := containedManifest().CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil || options.Config.Labels[accountLabel] != "7" {
		t.Fatalf("the account label is missing: %v %v", err, options.Config)
	}

	unsafe := map[string]func(*ContainerManifest) LaunchLabels{
		"another account's folder": func(changed *ContainerManifest) LaunchLabels {
			changed.Mounts[1].Source = "/srv/journal/accounts/8"
			return accountLabels("7")
		},
		"the accounts root": func(changed *ContainerManifest) LaunchLabels {
			changed.Mounts[1].Source = "/srv/journal/accounts"
			return accountLabels("7")
		},
		"an id that is not plain": func(changed *ContainerManifest) LaunchLabels {
			changed.Mounts[1].Source = "/srv/journal/accounts/A-7"
			return accountLabels("A-7")
		},
		"a read-only account": func(changed *ContainerManifest) LaunchLabels {
			changed.Mounts[1].IsWritable = false
			return accountLabels("7")
		},
		"an account mount with no account named": func(*ContainerManifest) LaunchLabels {
			return labels()
		},
		"an account named with no mount": func(changed *ContainerManifest) LaunchLabels {
			changed.Mounts = slices.Delete(changed.Mounts, 1, 2)
			return accountLabels("7")
		},
	}
	for name, change := range unsafe {
		changed := containedManifest()
		named := change(&changed)

		if _, err := changed.CreateOptions("journal-session-7", named, containedRules); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("%s gave %v", name, err)
		}
	}
}

func accountLabels(account string) LaunchLabels {
	named := labels()
	named.Account = account

	return named
}

func TestALocalManifestKeepsItsOldTmpfsSizes(t *testing.T) {
	options, err := manifest().CreateOptions("helper-7", labels(), localRules)
	if err != nil {
		t.Fatal(err)
	}

	want := map[string]string{"/tmp": "size=268435456", "/run/journal": "size=16777216", "/home/journal": "size=67108864"}
	if !maps.Equal(options.HostConfig.Tmpfs, want) {
		t.Fatalf("the folders in memory are %v", options.HostConfig.Tmpfs)
	}
}

func TestAContainedManifestAskingForAnotherMountIsRefused(t *testing.T) {
	unsafe := []func(*ContainerManifest){
		func(m *ContainerManifest) { m.Mounts[1].Source = "/home/server/accounts" },
		func(m *ContainerManifest) { m.Mounts[1].Source = "/srv/journal/../etc" },
		func(m *ContainerManifest) { m.Mounts[0].Source = "other-session-7-workspace" },
		func(m *ContainerManifest) { m.Mounts[0].Type = MountBind },
		func(m *ContainerManifest) { m.Mounts[2].Target = "/etc" },
		func(m *ContainerManifest) { m.Mounts[2].Target = "/workspace" },
		func(m *ContainerManifest) {
			m.Mounts = append(m.Mounts, ContainerMount{Type: MountVolume, Source: "journal-x", Target: "/workspace"})
		},
		func(m *ContainerManifest) { m.SecurityOptions.Seccomp = "unconfined,apparmor=unconfined" },
	}
	for index, change := range unsafe {
		changed := containedManifest()
		change(&changed)

		if _, err := changed.CreateOptions("journal-session-7", labels(), containedRules); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("unsafe change %d gave %v", index, err)
		}
	}
}

func TestAContainedManifestNamingAnotherImageIsRefused(t *testing.T) {
	changed := containedManifest()
	changed.Image = "journal/helper@sha256:def"

	if _, err := changed.CreateOptions("journal-session-7", accountLabels("7"), containedRules); !errors.Is(err, ErrManifestUnsafe) {
		t.Fatalf("another image gave %v", err)
	}
}

func TestTheAgentDaemonMustHoldThePinnedImage(t *testing.T) {
	reference := "journal/agent@sha256:aaa"
	containers, daemon := standIn(t, containedRules)
	daemon.Images[reference] = dockerstandin.Image{ID: "sha256:111", Digests: []string{reference}}
	if err := containers.AssertImagePinned(context.Background(), reference); err != nil {
		t.Fatalf("the pinned image gave %v", err)
	}

	daemon.Images[reference] = dockerstandin.Image{ID: "sha256:111", Digests: []string{"journal/agent@sha256:bbb"}}
	err := containers.AssertImagePinned(context.Background(), reference)
	if !errors.Is(err, ErrInstallationChanged) || !strings.Contains(err.Error(), "sha256:aaa") || !strings.Contains(err.Error(), "sha256:111") {
		t.Fatalf("another digest gave %v", err)
	}

	delete(daemon.Images, reference)
	if err := containers.AssertImagePinned(context.Background(), reference); !errors.Is(err, ErrInstallationChanged) {
		t.Fatalf("a missing image gave %v", err)
	}
}

func TestAnImageNamedByItsIdIsPinnedWhenTheDaemonHoldsThatId(t *testing.T) {
	id := "sha256:" + strings.Repeat("a", 64)
	containers, daemon := standIn(t, containedRules)
	daemon.Images[id] = dockerstandin.Image{ID: id}

	if err := containers.AssertImagePinned(context.Background(), id); err != nil {
		t.Fatalf("an image held under its id gave %v", err)
	}
}

func TestAnUnreachableAgentDaemonIsNamedAsThatNotAsAMissingImage(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	daemon.Refuse(http.MethodGet, "/images/", http.StatusForbidden, daemonRefusal, 1)

	err := containers.AssertImagePinned(context.Background(), "journal/agent@sha256:aaa")
	if !errors.Is(err, ErrAgentDaemonUnreachable) || errors.Is(err, ErrInstallationChanged) {
		t.Fatalf("an unreachable daemon gave %v", err)
	}

	if !strings.Contains(err.Error(), daemonRefusal) {
		t.Fatalf("the daemon's own words are missing from %v", err)
	}

	nowhere, err := ContainersOn("tcp://127.0.0.1:1", containedRules)
	if err != nil {
		t.Fatal(err)
	}
	if err := nowhere.AssertImagePinned(context.Background(), "journal/agent@sha256:aaa"); !errors.Is(err, ErrAgentDaemonUnreachable) {
		t.Fatalf("a daemon that does not listen gave %v", err)
	}
}

// daemonRefusal stands for the daemon's own words when it refuses a request.
const daemonRefusal = "daemon-refused-this-request"

func TestAnAgentContainerIsNotCreatedOnADaemonThatDiscardsItsBudgets(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	daemon.CgroupDriver = "none"

	_, err := containers.Create(context.Background(), containedManifest(), "journal-session-7", accountLabels("7"), ContainerProcess{})
	if !errors.Is(err, ErrBudgetsUnenforced) {
		t.Fatalf("a daemon with cgroup driver none gave %v", err)
	}

	if _, created := daemon.Container("journal-session-7"); created || daemon.WasAsked(http.MethodPost, "/volumes/create") {
		t.Fatalf("a volume or container was created on a daemon that discards budgets: %v", daemon.Requests())
	}

	daemon.CgroupDriver = "cgroupfs"
	id, err := containers.Create(context.Background(), containedManifest(), "journal-session-7", accountLabels("7"), ContainerProcess{})
	created, found := daemon.Container("journal-session-7")
	if err != nil || !found || created.ID != id {
		t.Fatalf("a daemon with a cgroup driver gave %q, %v", id, err)
	}
}

func TestTheDaemonIsSentTheManifestAndTheProcessOfAContainer(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	process := ContainerProcess{Command: []string{"codex", "exec"}, Environment: []string{"HOME=/home/journal"}}

	if _, err := containers.Create(context.Background(), containedManifest(), "journal-session-7", accountLabels("7"), process); err != nil {
		t.Fatal(err)
	}

	created, _ := daemon.Container("journal-session-7")
	if !slices.Equal(created.Config.Cmd, process.Command) || !slices.Equal(created.Config.Env, process.Environment) ||
		created.Config.Labels[sessionLabel] != labels().Session || created.Config.User != "10001:10001" {
		t.Fatalf("the daemon was sent %+v", created.Config)
	}
	if !created.HostConfig.ReadonlyRootfs || !slices.Contains(created.HostConfig.SecurityOpt, seccompOption(t)) ||
		*created.HostConfig.PidsLimit != 256 || len(created.HostConfig.Mounts) != 3 {
		t.Fatalf("the daemon was sent %+v", created.HostConfig)
	}
}

func TestAContainerTheDaemonRefusesToCreateIsReportedWithTheDaemonsOwnWords(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	daemon.Refuse(http.MethodPost, "/containers/create", http.StatusBadRequest, daemonRefusal, 1)

	_, err := containers.Create(context.Background(), containedManifest(), "journal-session-7", accountLabels("7"), ContainerProcess{})
	if !errors.Is(err, ErrContainerNotCreated) {
		t.Fatalf("a refused create gave %v", err)
	}

	if !strings.Contains(err.Error(), daemonRefusal) {
		t.Fatalf("the daemon's own words are missing from %v", err)
	}
}

func TestAContainedStartIsProvenByItsContainer(t *testing.T) {
	record := StartRecord{SessionID: "s1", Stage: ExecutionKnown, Claim: &client.ClaimedStart{StartKey: "k1"},
		Grant: client.Grant{Container: json.RawMessage(`{"image":"sha256:image"}`)}}
	running := ContainerSessions{"s1": {ID: "c1", Session: "s1", Running: true}}
	stopped := ContainerSessions{"s1": {ID: "c1", Session: "s1"}}

	if got := reconcileStart("k1", []StartRecord{record}, running); got != NeedsAttention {
		t.Fatalf("a container that still runs with nothing serving it gave %s", got)
	}

	if got := reconcileStart("k1", []StartRecord{record}, stopped); got != Exited {
		t.Fatalf("a stopped container gave %s", got)
	}

	if got := reconcileStart("k1", []StartRecord{record}, ContainerSessions{}); got != Exited {
		t.Fatalf("a container gone from the daemon gave %s", got)
	}

	refused := record
	refused.Stage = ClaimHeld
	if got := reconcileStart("k1", []StartRecord{refused}, ContainerSessions{}); got != Exited {
		t.Fatalf("a start refused before its container was made gave %s", got)
	}
}

func TestAnAttachableManifestGetsATerminalAndHelpersDoNot(t *testing.T) {
	helper, _ := manifest().CreateOptions("helper-7", labels(), localRules)
	main := containedManifest()
	main.IsAttachable = true
	session, _ := main.CreateOptions("journal-session-7", accountLabels("7"), containedRules)

	if helper.Config.Tty || helper.Config.OpenStdin || !session.Config.Tty || !session.Config.OpenStdin {
		t.Fatalf("the helper has %+v and the session %+v", helper.Config, session.Config)
	}
}

func TestAnImageIsPinnedByItsIdOrByNameAndDigest(t *testing.T) {
	id := "sha256:" + strings.Repeat("a", 64)

	for _, pinned := range []string{id, "journal-agent@sha256:abc"} {
		if !IsPinnedReference(pinned) {
			t.Fatalf("%s is not taken as pinned", pinned)
		}
	}

	for _, unpinned := range []string{"journal-agent:latest", "sha256:abc", "journal-agent"} {
		if IsPinnedReference(unpinned) {
			t.Fatalf("%s is taken as pinned", unpinned)
		}
	}
}

func TestASessionsHistoryVolumeIsMadeAndAResumedOneMustExist(t *testing.T) {
	containers, daemon := standIn(t, containedRules)
	daemon.AddVolume("journal-history-kept", nil)
	daemon.AddVolume("journal-session-7-workspace", nil)
	labels := LaunchLabels{Installation: "journal", Launch: "launch-1", Session: "s1"}
	session := containedManifest()
	session.Mounts[2] = ContainerMount{Type: MountVolume, Source: "journal-history-s1", Target: "/home/journal/.account/projects", IsWritable: true}

	if err := containers.EnsureVolumes(context.Background(), session, labels); err != nil {
		t.Fatal(err)
	}

	made, found := daemon.Volume("journal-history-s1")
	if !found || made.Labels[installationLabel] != "journal" || made.Labels[sessionLabel] != "s1" {
		t.Fatalf("the session's history volume was not made with its labels: %+v", made)
	}

	if _, labelled := made.Labels[launchLabel]; labelled {
		t.Fatalf("a history volume carries the launch label, so its cleanup would remove it: %+v", made)
	}

	resumed := containedManifest()
	resumed.Mounts[2] = ContainerMount{Type: MountVolume, Source: "journal-history-gone", Target: "/home/journal/.account/projects", MustExist: true}
	if err := containers.EnsureVolumes(context.Background(), resumed, labels); !errors.Is(err, ErrHistoryMissing) {
		t.Fatalf("a resume whose history is gone gave %v, not a refusal naming it", err)
	}

	kept := containedManifest()
	kept.Mounts[2] = ContainerMount{Type: MountVolume, Source: "journal-history-kept", Target: "/home/journal/.account/projects", MustExist: true}
	if err := containers.EnsureVolumes(context.Background(), kept, labels); err != nil {
		t.Fatalf("a resume with its history gave %v", err)
	}
}

func TestATerminalContainerRestartsByItselfAndResumesOnceItsTranscriptExists(t *testing.T) {
	manifest := containedManifest()
	manifest.IsAttachable = true
	options, err := manifest.CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil {
		t.Fatal(err)
	}
	if options.HostConfig.RestartPolicy.Name != container.RestartPolicyUnlessStopped {
		t.Fatalf("a terminal container has no restart policy: %+v", options.HostConfig.RestartPolicy)
	}

	process := ContainerProcess{
		Command:    []string{"claude", "--session-id", "conversation-1", "it's"},
		Restart:    []string{"claude", "--resume", "conversation-1"},
		Transcript: ConversationTranscript{Folder: "/home/journal/.account", ConversationID: "conversation-1"},
	}
	command := process.command()

	if command[0] != "/bin/sh" || command[4] != "/home/journal/.account" || command[5] != "conversation-1" {
		t.Fatalf("the restart wrapper does not test the transcript: %v", command)
	}
	want := `then exec 'claude' '--resume' 'conversation-1'; fi; exec 'claude' '--session-id' 'conversation-1' 'it'\''s'`
	if !strings.Contains(command[2], want) {
		t.Fatalf("the wrapper does not resume once the transcript exists and start otherwise: %s", command[2])
	}
	if got := (ContainerProcess{Command: []string{"codex"}}).command(); !slices.Equal(got, []string{"codex"}) {
		t.Fatalf("a process without a restart command is wrapped: %v", got)
	}
}

func protectedManifest() ContainerManifest {
	protected := containedManifest()
	protected.LaunchProfile = LaunchProtectedAccount
	protected.User = "0:0"
	protected.Capabilities = []string{"SETUID", "SETGID", "SETPCAP"}

	return protected
}

func TestAProtectedAccountContainerStartsItsInitAsRootWithOnlyThreeCapabilities(t *testing.T) {
	process := ContainerProcess{Command: []string{"claude"}}
	options, err := protectedManifest().CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil {
		t.Fatal(err)
	}

	options = process.into(options, true)
	config, hostConfig := options.Config, options.HostConfig
	if config.User != "0:0" || !slices.Equal(config.Entrypoint, []string{protectedInit}) ||
		!slices.Equal(config.Cmd, []string{"--", "claude"}) {
		t.Fatalf("the init is not what starts: %+v", config)
	}
	if !slices.Equal(hostConfig.CapDrop, []string{"ALL"}) || !slices.Equal(hostConfig.CapAdd, protectedCapabilities) {
		t.Fatalf("the capabilities are dropped %v and added %v", hostConfig.CapDrop, hostConfig.CapAdd)
	}
	if hostConfig.Tmpfs[executorFolder] != executorFolderOptions || !hostConfig.ReadonlyRootfs {
		t.Fatalf("the executor's folder or the read-only root is missing: %+v", hostConfig)
	}
	for _, want := range []string{"no-new-privileges", seccompOption(t), "apparmor=journal-agent"} {
		if !slices.Contains(hostConfig.SecurityOpt, want) {
			t.Fatalf("the security options lack %s: %v", want, hostConfig.SecurityOpt)
		}
	}
}

func TestAProtectedAccountManifestAskingForMoreIsRefusedBeforeAnythingIsCreated(t *testing.T) {
	unsafe := map[string]func(*ContainerManifest) LaunchLabels{
		"a fourth capability": func(changed *ContainerManifest) LaunchLabels {
			changed.Capabilities = append(changed.Capabilities, "NET_ADMIN")
			return accountLabels("7")
		},
		"another user": func(changed *ContainerManifest) LaunchLabels {
			changed.User = "10001:10001"
			return accountLabels("7")
		},
		"an entrypoint": func(changed *ContainerManifest) LaunchLabels {
			changed.Entrypoint = "/bin/sh"
			return accountLabels("7")
		},
		"no account": func(changed *ContainerManifest) LaunchLabels {
			changed.Mounts = changed.Mounts[:1]
			return labels()
		},
		"a writable root": func(changed *ContainerManifest) LaunchLabels {
			changed.IsReadOnlyRoot = false
			return accountLabels("7")
		},
		"an unknown profile": func(changed *ContainerManifest) LaunchLabels {
			changed.LaunchProfile = "root"
			return accountLabels("7")
		},
	}
	for name, change := range unsafe {
		changed := protectedManifest()
		changedLabels := change(&changed)

		if _, err := changed.CreateOptions("journal-session-7", changedLabels, containedRules); !errors.Is(err, ErrManifestUnsafe) {
			t.Fatalf("%s gave %v", name, err)
		}
	}
}

func TestAStandardManifestNamesNoInitAndAddsNoCapabilities(t *testing.T) {
	options, err := containedManifest().CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil {
		t.Fatal(err)
	}

	_, hasExecutorFolder := options.HostConfig.Tmpfs[executorFolder]
	if len(options.Config.Entrypoint) != 0 || len(options.HostConfig.CapAdd) != 0 || hasExecutorFolder {
		t.Fatalf("a standard container got protected options: %+v %+v", options.Config, options.HostConfig)
	}
}

func TestALocalDevelopmentHostMountsTheCheckoutsProgramsOverTheImagesReadOnly(t *testing.T) {
	development := containedRules
	development.DevelopmentPrograms = "/srv/journal/development"

	options, err := containedManifest().CreateOptions("journal-session-7", accountLabels("7"), development)
	if err != nil {
		t.Fatal(err)
	}

	for _, target := range []string{"/opt/journal/bin/journal-init", "/opt/journal/bin/journal-exec", "/opt/journal/shell/bash"} {
		program := mountAt(t, options, target)
		if program.Type != mount.TypeBind || !program.ReadOnly || !strings.HasPrefix(program.Source, "/srv/journal/development/") {
			t.Fatalf("%s is mounted as %+v", target, program)
		}
	}
}

func TestAProductionHostMountsNoProgramOverTheImage(t *testing.T) {
	options, err := containedManifest().CreateOptions("journal-session-7", accountLabels("7"), containedRules)
	if err != nil {
		t.Fatal(err)
	}

	for _, mounted := range options.HostConfig.Mounts {
		if strings.HasPrefix(mounted.Target, "/opt/journal/") {
			t.Fatalf("a production container mounts %s over its image", mounted.Target)
		}
	}
}
