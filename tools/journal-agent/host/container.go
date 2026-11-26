package host

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"journal-agent/shellwords"
	"os"
	"path"
	"regexp"
	"slices"
	"strconv"
	"strings"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/api/types/mount"
	"github.com/moby/moby/client"
)

// MountType is what a container mount takes its files from: a folder of this machine (the local arrangement), a named
// volume of the agent daemon, or a folder under /srv/journal on the agent daemon.
type MountType string

const (
	// MountBind is a folder of the machine the host runs on, the one mount of a local helper.
	MountBind MountType = "bind"
	// MountVolume is a named volume of the agent daemon, its name opening with the installation name.
	MountVolume MountType = "volume"
	// MountDaemonBind is a folder under /srv/journal/ on the agent daemon, such as an account's folder.
	MountDaemonBind MountType = "daemon-bind"
)

// daemonBindRoot is the one folder of the agent daemon a daemon-bind mount may come from.
const daemonBindRoot = "/srv/journal/"

// containedTargets are the folders a contained container may have mounted, each at most once.
var containedTargets = []string{
	"/workspace", "/home/journal/.account", "/home/journal/.account/projects", SessionFilesTarget, ManagedSettingsTarget,
}

// ContainerMount mirrors App\Agents\Support\ManifestMount: one folder a container sees, and where it comes from.
type ContainerMount struct {
	Type       MountType `json:"type"`
	Source     string    `json:"source"`
	Target     string    `json:"target"`
	IsWritable bool      `json:"isWritable"`
	// MustExist is a volume the host finds and never makes, such as the history of a resumed conversation.
	MustExist bool `json:"mustExist"`
	// IsCheckout is a writer's workspace: the host clones the source into the session's own checkout volume and mounts
	// that, read-write, at the target instead.
	IsCheckout bool `json:"isCheckout"`
}

// ContainerBudgets mirrors App\Agents\Support\ExecutionBudgets: the bounds a container runs under.
type ContainerBudgets struct {
	CPUCores        int `json:"cpuCores"`
	MemoryBytes     int `json:"memoryBytes"`
	MemorySwapBytes int `json:"memorySwapBytes"`
	Processes       int `json:"processes"`
	OpenFiles       int `json:"openFiles"`
	TmpBytes        int `json:"tmpBytes"`
	HomeBytes       int `json:"homeBytes"`
	// WorkspaceBytes bounds a writer's own checkout volume.
	WorkspaceBytes int `json:"workspaceBytes"`
}

// SecurityOptions are the seccomp and AppArmor profiles a container runs under, each a profile path or name, both
// optional.
type SecurityOptions struct {
	Seccomp  string `json:"seccomp"`
	AppArmor string `json:"apparmor"`
}

// ContainerManifest mirrors App\Agents\Support\ContainerManifest, which the journal already validated: the host
// translates it, it never builds a policy of its own.
type ContainerManifest struct {
	Image               string           `json:"image"`
	User                string           `json:"user"`
	Workdir             string           `json:"workdir"`
	IsReadOnlyRoot      bool             `json:"isReadOnlyRoot"`
	Capabilities        []string         `json:"capabilities"`
	BlocksNewPrivileges bool             `json:"blocksNewPrivileges"`
	IsPrivileged        bool             `json:"isPrivileged"`
	Network             string           `json:"network"`
	Mounts              []ContainerMount `json:"mounts"`
	PublishedPorts      []int            `json:"publishedPorts"`
	Budgets             ContainerBudgets `json:"budgets"`
	SecurityOptions     SecurityOptions  `json:"securityOptions"`
	// IsAttachable is a session's own terminal process, such as the main agent's program: it gets a tty and an open
	// stdin, and the host attaches to it, again after a restart. Helpers are not attachable.
	IsAttachable bool `json:"isAttachable"`
	// WorkspacePreparation is what the host fills or checks before the container mounts the workspace; nil locally.
	WorkspacePreparation *WorkspacePreparation `json:"workspacePreparation"`
	// StartProfile is how the container starts: standard, or protected-account, whose init starts as root to hand the
	// sign-in to the program's own user; empty reads as standard.
	StartProfile string `json:"startProfile"`
	// Entrypoint is refused when set: the host alone chooses a container's init.
	Entrypoint string `json:"entrypoint"`
}

const (
	StartStandard         = "standard"
	StartProtectedAccount = "protected-account"
	// protectedInit is the init a protected-account container starts with, never taken from a manifest.
	protectedInit = "/opt/journal/bin/journal-init"
	// initReadyLine is the one line the init prints once its program and executor run.
	initReadyLine = "journal-init: ready"
	// executorFolder is the private folder of the executor's socket in a protected-account container, kept in
	// memory with executorFolderOptions.
	executorFolder        = "/run/journal-exec"
	executorFolderOptions = "uid=10002,gid=10001,mode=0750,size=1m"
	protectedUser         = "0:0"
)

// protectedCapabilities are exactly the capabilities a protected-account init needs to drop to its users.
var protectedCapabilities = []string{"SETUID", "SETGID", "SETPCAP"}

// IsProtected is whether the manifest starts with the protected-account profile.
func (manifest ContainerManifest) IsProtected() bool {
	return manifest.StartProfile == StartProtectedAccount
}

// hasKnownProfile is whether the manifest names a start profile the host knows.
func (manifest ContainerManifest) hasKnownProfile() bool {
	return manifest.StartProfile == "" || manifest.StartProfile == StartStandard || manifest.IsProtected()
}

// startsAsProfile is whether the user and capabilities are exactly the ones its start profile allows: a named user
// and none for standard; root with the three protected capabilities, a read-only root, no new privileges and an
// account mount for protected-account.
func (manifest ContainerManifest) startsAsProfile() bool {
	if !manifest.IsProtected() {
		return len(manifest.Capabilities) == 0 && manifest.User != ""
	}

	return manifest.User == protectedUser && slices.Equal(manifest.Capabilities, protectedCapabilities) &&
		manifest.IsReadOnlyRoot && manifest.BlocksNewPrivileges && manifest.AccountFolder() != ""
}

// imageIDPattern is an image named by its id, the config digest a loaded image keeps.
var imageIDPattern = regexp.MustCompile(`^sha256:[0-9a-f]{64}$`)

// IsPinnedReference is whether an image reference names exactly one image: by its id, or by name and digest.
func IsPinnedReference(reference string) bool {
	return imageIDPattern.MatchString(reference) || strings.Contains(reference, "@sha256:")
}

// ContainerRules are what decides what a manifest may ask for: the host's arrangement and, when contained, the
// installation name every volume of its containers opens with and the one agent image its containers run.
type ContainerRules struct {
	Arrangement      Arrangement
	InstallationName InstallationName
	AgentImage       string
	// DevelopmentPrograms is a daemon folder of the journal's own programs built from the checkout, mounted over the
	// image's copies in local development only, so a change to them needs no image build; empty everywhere else.
	DevelopmentPrograms string
}

// developmentPrograms are the programs of the agent image a local development host replaces with the checkout's
// builds, each by the path it has in the image.
var developmentPrograms = map[string]string{
	"journal-init":  "/opt/journal/bin/journal-init",
	"journal-exec":  "/opt/journal/bin/journal-exec",
	"journal-shell": "/opt/journal/bin/journal-shell",
	"journal-hook":  "/opt/journal/bin/journal-hook",
	"journal-mcp":   "/opt/journal/bin/journal-mcp",
}

// developmentShellBridge is where the image keeps the shell bridge under the name its driver calls.
const developmentShellBridge = "/opt/journal/shell/bash"

// developmentMounts are the read-only binds that put the checkout's builds over the image's programs, none outside
// local development.
func (rules ContainerRules) developmentMounts() []mount.Mount {
	if rules.DevelopmentPrograms == "" {
		return nil
	}
	mounts := []mount.Mount{bindMount(rules.DevelopmentPrograms+"/journal-shell", developmentShellBridge, false)}
	for program, target := range developmentPrograms {
		mounts = append(mounts, bindMount(rules.DevelopmentPrograms+"/"+program, target, false))
	}

	return mounts
}

// The tmpfs folders a helper writes to, and the sizes they keep when the budgets name none, mirroring
// ContainerManifest::TMPFS.
const (
	defaultTmpBytes  = 256 << 20
	runJournalBytes  = 16 << 20
	defaultHomeBytes = 64 << 20
)

var (
	// ErrManifestUnsafe refuses a manifest that asks for what a helper may never have; the journal refuses it first,
	// so this only catches a manifest that changed on its way.
	ErrManifestUnsafe = errors.New("the container manifest asks for more than a helper may have")
)

// accountsRoot is where the agent daemon holds every account's own sign-in folder, and accountTarget where a
// container finds its session's own one.
const (
	accountsRoot  = "/srv/journal/accounts"
	accountTarget = "/home/journal/.account"
)

// plainAccountID is an account folder's name as the journal makes it: lowercase letters and digits, nothing else.
var plainAccountID = regexp.MustCompile(`^[a-z0-9]+$`)

// bindsOnlyAccount is whether the manifest's one account mount is the account's own folder, read-write, at the
// account home, named by a plain id; with no account named, whether it binds no account at all. A contained Claude
// Code session binding its own account reverses the standing "no credential in a container" decision, as the user
// as the owner decided; no other account's folder and nothing else under the root is bound.
func (manifest ContainerManifest) bindsOnlyAccount(accountID string) bool {
	var accountMounts []ContainerMount
	for _, mount := range manifest.Mounts {
		if mount.Target == accountTarget || strings.HasPrefix(mount.Source, accountsRoot) {
			accountMounts = append(accountMounts, mount)
		}
	}

	if len(accountMounts) == 0 {
		return accountID == ""
	}

	mount := accountMounts[0]

	return len(accountMounts) == 1 && plainAccountID.MatchString(accountID) && mount.Type == MountDaemonBind &&
		mount.Target == accountTarget && mount.IsWritable && mount.Source == accountsRoot+"/"+accountID
}

// AccountFolder is the plain id of the account folder the manifest binds at the account home, which the container's
// account label names; empty when it binds none.
func (manifest ContainerManifest) AccountFolder() string {
	for _, mount := range manifest.Mounts {
		if mount.Target == accountTarget && strings.HasPrefix(mount.Source, accountsRoot+"/") {
			return strings.TrimPrefix(mount.Source, accountsRoot+"/")
		}
	}

	return ""
}

// IsSafe is whether the manifest may start a container: unprivileged, with no published ports or entrypoint, the
// user and capabilities its start profile allows, an exact image digest, security profiles that are one value each,
// and only the mounts the rules allow.
func (manifest ContainerManifest) IsSafe(rules ContainerRules) bool {
	isConfined := !manifest.IsPrivileged && len(manifest.PublishedPorts) == 0 && manifest.Entrypoint == "" &&
		manifest.hasKnownProfile() && manifest.startsAsProfile()
	isPinned := IsPinnedReference(manifest.Image)

	return isConfined && isPinned && rules.permitsImage(manifest.Image) && manifest.SecurityOptions.isPlain() &&
		rules.permit(manifest.Mounts)
}

// CreateOptions are what the daemon creates the container from: its exact image digest, the unprivileged user, a
// read-only root, no capabilities, its mounts, its security profiles, the bounded resources and the labels that let
// reconciliation find it again.
func (manifest ContainerManifest) CreateOptions(name string, labels StartLabels, rules ContainerRules) (client.ContainerCreateOptions, error) {
	if !manifest.IsSafe(rules) || !manifest.bindsOnlyAccount(labels.Account) {
		return client.ContainerCreateOptions{}, ErrManifestUnsafe
	}

	security, err := manifest.SecurityOptions.options()
	if err != nil {
		return client.ContainerCreateOptions{}, err
	}

	processes := int64(manifest.Budgets.Processes)
	openFiles := int64(manifest.Budgets.OpenFiles)
	config := &container.Config{
		User:       manifest.User,
		WorkingDir: manifest.Workdir,
		Image:      manifest.Image,
		Labels:     labels.asMap(),
	}
	hostConfig := &container.HostConfig{
		CapDrop:        []string{"ALL"},
		NetworkMode:    container.NetworkMode(manifest.Network),
		ReadonlyRootfs: manifest.IsReadOnlyRoot,
		SecurityOpt:    security,
		Tmpfs:          manifest.Budgets.tmpfs(),
		Resources: container.Resources{
			NanoCPUs:   int64(manifest.Budgets.CPUCores) * nanoCPUsInACore,
			Memory:     int64(manifest.Budgets.MemoryBytes),
			MemorySwap: int64(manifest.Budgets.MemorySwapBytes),
			PidsLimit:  &processes,
			Ulimits:    []*container.Ulimit{{Name: "nofile", Soft: openFiles, Hard: openFiles}},
		},
	}
	if manifest.IsProtected() {
		hostConfig.CapAdd = protectedCapabilities
		config.Entrypoint = []string{protectedInit}
		hostConfig.Tmpfs[executorFolder] = executorFolderOptions
	}

	if manifest.BlocksNewPrivileges {
		hostConfig.SecurityOpt = append([]string{"no-new-privileges"}, hostConfig.SecurityOpt...)
	}

	if manifest.IsAttachable {
		config.Tty, config.OpenStdin = true, true
		config.AttachStdin, config.AttachStdout, config.AttachStderr = true, true, true
		hostConfig.RestartPolicy = container.RestartPolicy{Name: container.RestartPolicyUnlessStopped}
	}

	for _, mounted := range manifest.Mounts {
		hostConfig.Mounts = append(hostConfig.Mounts, mounted.daemonMount())
	}
	hostConfig.Mounts = append(hostConfig.Mounts, rules.developmentMounts()...)

	return client.ContainerCreateOptions{Name: name, Config: config, HostConfig: hostConfig}, nil
}

// nanoCPUsInACore is one CPU core in the unit the daemon counts CPU budgets in.
const nanoCPUsInACore = 1_000_000_000

// permitsImage is whether the image is one a container may run here: on a contained host only the pinned agent image.
func (rules ContainerRules) permitsImage(image string) bool {
	return !rules.Arrangement.IsContained() || image == rules.AgentImage
}

// permit is whether the mounts fit the arrangement: a local helper has exactly one folder of this machine; a
// contained one has one to four mounts of the agent daemon, each on its own allowed folder.
func (rules ContainerRules) permit(mounts []ContainerMount) bool {
	if !rules.Arrangement.IsContained() {
		return len(mounts) == 1 && mounts[0].Type == MountBind
	}

	if len(mounts) == 0 || len(mounts) > len(containedTargets) {
		return false
	}

	seen := map[string]bool{}
	for _, mount := range mounts {
		if seen[mount.Target] || !slices.Contains(containedTargets, mount.Target) || !rules.permitsSource(mount) {
			return false
		}

		seen[mount.Target] = true
	}

	return true
}

// permitsSource is whether a contained mount comes from where it may: a volume of this installation, or a clean
// folder under /srv/journal/ on the agent daemon; never a folder of the server itself.
func (rules ContainerRules) permitsSource(mount ContainerMount) bool {
	switch mount.Type {
	case MountVolume:
		return rules.InstallationName != "" && strings.HasPrefix(mount.Source, string(rules.InstallationName)+"-") &&
			!strings.ContainsAny(mount.Source, "/,\n")
	case MountDaemonBind:
		return path.Clean(mount.Source) == mount.Source && strings.HasPrefix(mount.Source, daemonBindRoot) &&
			!strings.Contains(mount.Source, "..") && !strings.ContainsAny(mount.Source, ",\n")
	}

	return false
}

// daemonMount is the mount as the daemon takes it, read-only unless it is writable.
func (mounted ContainerMount) daemonMount() mount.Mount {
	if mounted.Type == MountVolume {
		return volumeMount(mounted.Source, mounted.Target, mounted.IsWritable)
	}

	return bindMount(mounted.Source, mounted.Target, mounted.IsWritable)
}

// readOnlyAt is the mount as the daemon takes it read-only at another target, as a check or a clone reads the
// workspace.
func (mounted ContainerMount) readOnlyAt(target string) mount.Mount {
	return ContainerMount{Type: mounted.Type, Source: mounted.Source, Target: target}.daemonMount()
}

// isPlain is whether each profile is one value, since a comma or a newline would smuggle in another option.
func (options SecurityOptions) isPlain() bool {
	return !strings.ContainsAny(options.Seccomp+options.AppArmor, ",\n")
}

// ErrSeccompProfileUnreadable refuses a container whose seccomp profile the host cannot read: it never starts one
// under the daemon's default profile in its place.
var ErrSeccompProfileUnreadable = errors.New("the seccomp profile cannot be read")

// options are the security options of the profiles that are set, as the daemon takes them. The daemon takes a
// seccomp profile as its JSON, never as a path of this machine, so a profile named by a path is read here.
func (options SecurityOptions) options() ([]string, error) {
	var named []string
	if options.Seccomp != "" {
		profile, err := seccompProfile(options.Seccomp)
		if err != nil {
			return nil, err
		}

		named = append(named, "seccomp="+profile)
	}

	if options.AppArmor != "" {
		named = append(named, "apparmor="+options.AppArmor)
	}

	return named, nil
}

// seccompProfile is the profile as the daemon takes it: a name the daemon knows as it is, a path as the file's JSON.
func seccompProfile(profile string) (string, error) {
	if !strings.HasPrefix(profile, "/") {
		return profile, nil
	}

	content, err := os.ReadFile(profile)
	if err != nil {
		return "", fmt.Errorf("%w: %s: %v", ErrSeccompProfileUnreadable, profile, err)
	}

	return string(content), nil
}

// tmpfs are the folders a container writes to in memory, sized from the budgets, or from the old sizes when the
// budgets name none.
func (budgets ContainerBudgets) tmpfs() map[string]string {
	return map[string]string{
		"/tmp":          "size=" + strconv.Itoa(cmp.Or(budgets.TmpBytes, defaultTmpBytes)),
		"/run/journal":  "size=" + strconv.Itoa(runJournalBytes),
		"/home/journal": "size=" + strconv.Itoa(cmp.Or(budgets.HomeBytes, defaultHomeBytes)),
	}
}

// Containers are the containers of one Docker daemon, reached through Docker's own client, under the container rules
// of the host; on a contained host the daemon is the agent daemon.
type Containers struct {
	Daemon *client.Client
	Rules  ContainerRules
}

// ErrContainerNotCreated is returned when the agent daemon refuses to create a container; the error carries the
// daemon's own first line, which says why.
var ErrContainerNotCreated = errors.New("the agent daemon did not create the container")

// ErrAgentDaemonUnreachable is returned when a call cannot reach the agent daemon at all, which says nothing about
// the images it holds.
var ErrAgentDaemonUnreachable = errors.New("the agent container runtime cannot be reached")

// ErrBudgetsUnenforced is returned when the agent daemon has no cgroup driver, so the CPU, memory and process budgets
// every agent container is created with would be accepted and discarded.
var ErrBudgetsUnenforced = errors.New("the agent daemon cannot hold container budgets: it has no cgroup driver")

// AssertBudgetsEnforced refuses an agent daemon whose cgroup driver is none; a daemon it cannot reach is named as that.
func (containers Containers) AssertBudgetsEnforced(ctx context.Context) error {
	answered, err := containers.Daemon.Info(ctx, client.InfoOptions{})
	if err != nil {
		return unreachable(err)
	}

	if driver := answered.Info.CgroupDriver; driver == "" || driver == "none" {
		return ErrBudgetsUnenforced
	}

	return nil
}

// AssertImagePinned refuses an image the agent daemon lacks or holds under another digest than the reference names;
// a reference matches the image's id or one of its repository digests. A daemon it cannot reach is named as that.
func (containers Containers) AssertImagePinned(ctx context.Context, reference string) error {
	image, err := containers.Daemon.ImageInspect(ctx, reference)
	if isAbsent(err) {
		return fmt.Errorf("%w: the image %s is not loaded into the agent daemon", ErrInstallationChanged, reference)
	}

	if err != nil {
		return unreachable(err)
	}

	_, wanted, _ := strings.Cut(reference, "@")
	if slices.Contains(image.RepoDigests, reference) || (wanted != "" && image.ID == wanted) || image.ID == reference {
		return nil
	}

	return fmt.Errorf("%w: %s names %s, but the agent daemon holds %s", ErrInstallationChanged, reference,
		cmp.Or(wanted, reference), image.ID)
}

// ContainerProcess is the program a container runs as its own process, after the image's entrypoint: its command and
// the environment it is given, with no path of the host in it. A helper without its own program has none.
type ContainerProcess struct {
	Command     []string
	Environment []string
	// Restart is the command the container runs instead when it comes back after a restart of the agent daemon or the
	// server, such as the program resuming its conversation. It runs once a file matching RestartWhen exists.
	Restart []string
	// RestartWhen is the file whose presence makes a restarted container run Restart.
	RestartWhen RestartFile
	// IsHealedByHost leaves restarting a crashed container to the host's own supervision, which reports each restart,
	// instead of the daemon's restart policy.
	IsHealedByHost bool
}

// RestartFile is a folder and a file name pattern in it, such as a conversation's transcript: a restarted container
// runs its restart command once a file of the folder matches the pattern.
type RestartFile struct {
	Folder string `json:"folder"`
	Glob   string `json:"glob"`
}

// into puts the process into what the daemon creates the container from: its environment, and its command after
// the image's entrypoint, behind `--` when the protected-account init runs it.
func (process ContainerProcess) into(options client.ContainerCreateOptions, underInit bool) client.ContainerCreateOptions {
	options.Config.Env = append(options.Config.Env, process.Environment...)
	options.Config.Cmd = process.command()
	if process.IsHealedByHost {
		options.HostConfig.RestartPolicy = container.RestartPolicy{Name: container.RestartPolicyDisabled}
	}
	if underInit {
		options.Config.Cmd = append([]string{"--"}, options.Config.Cmd...)
	}

	return options
}

// command is the process's own command, or, with a restart command, a shell that runs the restart command once its
// file exists and the first command otherwise, so a container brought back by its restart policy resumes its program
// instead of starting it a second time.
func (process ContainerProcess) command() []string {
	if len(process.Restart) == 0 {
		return process.Command
	}

	script := `if find "$1" -name "$2" -print -quit 2>/dev/null | grep -q .; then exec ` +
		shellwords.Quoted(process.Restart...) + `; fi; exec ` + shellwords.Quoted(process.Command...)

	return []string{"/bin/sh", "-c", script, "journal-session", process.RestartWhen.Folder, process.RestartWhen.Glob}
}

// Create creates the container from the manifest, running the process, and answers its id; a daemon that would
// discard the manifest's budgets is refused before anything is created, and the workspace is filled or checked and a
// writer's checkout made before its container.
func (containers Containers) Create(
	ctx context.Context,
	manifest ContainerManifest,
	name string,
	labels StartLabels,
	process ContainerProcess,
) (string, error) {
	if _, err := manifest.CreateOptions(name, labels, containers.Rules); err != nil {
		return "", err
	}

	if manifest.IsProtected() {
		if err := containers.CheckAccountFolder(ctx, manifest.AccountFolder()); err != nil {
			return "", err
		}
	}

	if err := containers.AssertBudgetsEnforced(ctx); err != nil {
		return "", err
	}

	if err := containers.PrepareWorkspace(ctx, manifest.WorkspacePreparation); err != nil {
		return "", err
	}

	manifest, err := containers.withCheckout(ctx, manifest, labels.Session)
	if err != nil {
		return "", err
	}

	options, err := manifest.CreateOptions(name, labels, containers.Rules)
	if err != nil {
		return "", err
	}

	if err := containers.EnsureVolumes(ctx, manifest, labels); err != nil {
		return "", err
	}

	created, err := containers.Daemon.ContainerCreate(ctx, process.into(options, manifest.IsProtected()))
	if err != nil {
		return "", fmt.Errorf("%w: %s", ErrContainerNotCreated, failureLine(err.Error(), err))
	}

	return created.ID, nil
}

// EnsureNetwork makes the session's own network when the agent daemon lacks it, labelled with the installation and
// the session, so a container of the session shares no network with another.
func (containers Containers) EnsureNetwork(ctx context.Context, name string, labels StartLabels) error {
	if _, err := containers.Daemon.NetworkInspect(ctx, name, client.NetworkInspectOptions{}); err == nil {
		return nil
	}

	_, err := containers.Daemon.NetworkCreate(ctx, name, client.NetworkCreateOptions{
		Labels: map[string]string{installationLabel: labels.Installation, sessionLabel: labels.Session},
	})
	if err != nil {
		return fmt.Errorf("creating the network %s failed: %w", name, err)
	}

	return nil
}

// agentUser is the unprivileged user agent containers run as, mirroring ContainerManifest::USER.
const agentUser = "10001:10001"

// agentUID is the agent's user id, the owner every folder it works in must have.
const agentUID = 10001

// RunCheck runs one program of the agent image in a throwaway container, as the agent's user, with no account, no
// network, every capability dropped and the seccomp profile agent containers run under, and answers what it printed.
// The container is removed with its anonymous volumes when the program ends.
func (containers Containers) RunCheck(ctx context.Context, seccomp, program string, arguments ...string) (string, error) {
	security, err := SecurityOptions{Seccomp: seccomp}.options()
	if err != nil {
		return "", err
	}

	return containers.runCheck(ctx, throwaway{Program: program, Arguments: arguments, SecurityOptions: security})
}

// runCheck runs a check as RunCheck does, as the agent's user, with what the throwaway adds, such as a read-only
// mount.
func (containers Containers) runCheck(ctx context.Context, check throwaway) (string, error) {
	check.User = agentUser

	return containers.runToEnd(ctx, check)
}

// runScript runs a shell script as a check does, with the mounts it reads.
func (containers Containers) runScript(ctx context.Context, script string, mounts ...mount.Mount) (string, error) {
	return containers.runCheck(ctx, throwaway{Program: "sh", Arguments: []string{"-c", script}, Mounts: mounts})
}

// ErrHistoryMissing refuses a resume whose history volume is gone, so it never starts with an empty history.
var ErrHistoryMissing = errors.New("the history of the resumed conversation is gone")

// hasVolume is whether the agent daemon holds the named volume.
func (containers Containers) hasVolume(ctx context.Context, name string) bool {
	_, err := containers.Daemon.VolumeInspect(ctx, name, client.VolumeInspectOptions{})

	return err == nil
}

// EnsureVolumes makes each named volume of the manifest that the agent daemon lacks, labelled with the installation
// and the session but no start, so a start's cleanup keeps it; a volume that must exist and does not refuses.
func (containers Containers) EnsureVolumes(ctx context.Context, manifest ContainerManifest, labels StartLabels) error {
	for _, mounted := range manifest.Mounts {
		if mounted.Type != MountVolume || containers.hasVolume(ctx, mounted.Source) {
			continue
		}

		if mounted.MustExist {
			return fmt.Errorf("%w: %s", ErrHistoryMissing, mounted.Source)
		}

		_, err := containers.Daemon.VolumeCreate(ctx, client.VolumeCreateOptions{
			Name:   mounted.Source,
			Labels: map[string]string{installationLabel: labels.Installation, sessionLabel: labels.Session},
		})
		if err != nil {
			return fmt.Errorf("creating the volume %s failed: %w", mounted.Source, err)
		}
	}

	return nil
}

// Start starts a created container.
func (containers Containers) Start(ctx context.Context, id string) error {
	_, err := containers.Daemon.ContainerStart(ctx, id, client.ContainerStartOptions{})

	return err
}

// InstanceID is the container's own id as the daemon reports it, which names this instance and no replacement.
func (containers Containers) InstanceID(ctx context.Context, name string) (string, error) {
	inspected, err := containers.Daemon.ContainerInspect(ctx, name, client.ContainerInspectOptions{})
	if err != nil {
		return "", err
	}

	return inspected.Container.ID, nil
}

// IsRunning answers whether the container runs, as the daemon reports it; a failed inspect is an error, never an
// answer.
func (containers Containers) IsRunning(ctx context.Context, id string) (bool, error) {
	inspected, err := containers.Daemon.ContainerInspect(ctx, id, client.ContainerInspectOptions{})
	if err != nil {
		return false, err
	}

	return inspected.Container.State != nil && inspected.Container.State.Running, nil
}

// Kill sends the signal to the container's program.
func (containers Containers) Kill(ctx context.Context, id string, signal string) error {
	_, err := containers.Daemon.ContainerKill(ctx, id, client.ContainerKillOptions{Signal: signal})

	return err
}

// Stop stops the container within the bound and answers only once the daemon shows it stopped.
func (containers Containers) Stop(ctx context.Context, id string, seconds int) error {
	if _, err := containers.Daemon.ContainerStop(ctx, id, client.ContainerStopOptions{Timeout: &seconds}); err != nil {
		return err
	}

	running, err := containers.IsRunning(ctx, id)
	if err != nil {
		return err
	}

	if running {
		return errors.New("the container still runs after its stop")
	}

	return nil
}
