package host

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"os/exec"
	"path"
	"regexp"
	"slices"
	"strconv"
	"strings"
)

// MountType is what a container mount takes its files from: a folder of this machine (the local arrangement), a named
// volume of the agent daemon, or a folder under /srv/journal on the agent daemon (doc 61, decision 6).
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
var containedTargets = []string{"/workspace", "/home/journal/.account", "/home/journal/.account/projects"}

// maxContainedMounts is the most mounts a contained container has: its workspace, its account and its projects.
const maxContainedMounts = 3

// ContainerMount mirrors App\Agents\Support\ManifestMount: one folder a container sees, and where it comes from.
type ContainerMount struct {
	Type     MountType `json:"type"`
	Source   string    `json:"source"`
	Target   string    `json:"target"`
	Writable bool      `json:"writable"`
	// MustExist is a volume the host finds and never makes, such as the history of a resumed conversation.
	MustExist bool `json:"mustExist"`
	// Checkout is a writer's workspace: the host clones the source into the session's own checkout volume and mounts
	// that, read-write, at the target instead.
	Checkout bool `json:"checkout"`
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
	Image           string           `json:"image"`
	User            string           `json:"user"`
	Workdir         string           `json:"workdir"`
	ReadOnlyRoot    bool             `json:"readOnlyRoot"`
	Capabilities    []string         `json:"capabilities"`
	NoNewPrivileges bool             `json:"noNewPrivileges"`
	Privileged      bool             `json:"privileged"`
	Network         string           `json:"network"`
	Mounts          []ContainerMount `json:"mounts"`
	PublishedPorts  []int            `json:"publishedPorts"`
	Budgets         ContainerBudgets `json:"budgets"`
	SecurityOptions SecurityOptions  `json:"securityOptions"`
	// Attachable is a session's own terminal process, such as the main agent's program: it gets a tty and an open
	// stdin, and the host attaches to it, again after a restart. Helpers are not attachable.
	Attachable bool `json:"attachable"`
	// WorkspacePreparation is what the host fills or checks before the container mounts the workspace; nil locally.
	WorkspacePreparation *WorkspacePreparation `json:"workspacePreparation"`
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
}

// The tmpfs folders a helper writes to, and the sizes they keep when the budgets name none, mirroring
// ContainerManifest::TMPFS.
const (
	defaultTmpBytes  = 256 << 20
	runJournalBytes  = 16 << 20
	defaultHomeBytes = 64 << 20
)

var (
	// ErrContainerTransportUnsupported refuses a required-container start on a saved account: no account transport
	// into a container is shown, and a host program with only its tools in a container does not count.
	ErrContainerTransportUnsupported = errors.New("no saved-account transport into a container is supported")
	// ErrManifestUnsafe refuses a manifest that asks for what a helper may never have; the journal refuses it first,
	// so this only catches a manifest that changed on its way.
	ErrManifestUnsafe = errors.New("the container manifest asks for more than a helper may have")
)

// RequireContainerTransport refuses a saved-account arrangement inside a required container before anything is
// created.
func RequireContainerTransport(arrangement string) error {
	return fmt.Errorf("%w: %s", ErrContainerTransportUnsupported, arrangement)
}

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
// decided in question 30 (doc 61, decision 8); no other account's folder and nothing else under the root is bound.
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
		mount.Target == accountTarget && mount.Writable && mount.Source == accountsRoot+"/"+accountID
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

// IsSafe is whether the manifest may start a container: unprivileged, with no capabilities or published ports, an
// exact image digest, a named user, security profiles that are one value each, and only the mounts the rules allow.
func (manifest ContainerManifest) IsSafe(rules ContainerRules) bool {
	isConfined := !manifest.Privileged && len(manifest.Capabilities) == 0 && len(manifest.PublishedPorts) == 0
	isPinned := IsPinnedReference(manifest.Image) && manifest.User != ""

	return isConfined && isPinned && rules.permitsImage(manifest.Image) && manifest.SecurityOptions.isPlain() &&
		rules.permit(manifest.Mounts)
}

// DockerCreateArguments are the arguments of `docker create` for the manifest: its exact image digest, the
// unprivileged user, a read-only root, no capabilities, its mounts, its security profiles, the bounded resources and
// the labels that let reconciliation find it again.
func (manifest ContainerManifest) DockerCreateArguments(name string, labels LaunchLabels, rules ContainerRules) ([]string, error) {
	if !manifest.IsSafe(rules) || !manifest.bindsOnlyAccount(labels.Account) {
		return nil, ErrManifestUnsafe
	}

	arguments := []string{
		"create", "--name", name, "--user", manifest.User, "--workdir", manifest.Workdir,
		"--cap-drop", "ALL", "--network", manifest.Network,
		"--cpus", strconv.Itoa(manifest.Budgets.CPUCores),
		"--memory", strconv.Itoa(manifest.Budgets.MemoryBytes) + "b",
		"--memory-swap", strconv.Itoa(manifest.Budgets.MemorySwapBytes) + "b",
		"--pids-limit", strconv.Itoa(manifest.Budgets.Processes),
		"--ulimit", "nofile=" + strconv.Itoa(manifest.Budgets.OpenFiles),
	}
	arguments = append(arguments, labels.arguments()...)
	if manifest.ReadOnlyRoot {
		arguments = append(arguments, "--read-only")
	}

	if manifest.NoNewPrivileges {
		arguments = append(arguments, "--security-opt", "no-new-privileges")
	}

	if manifest.Attachable {
		arguments = append(arguments, "--interactive", "--tty", "--restart", "unless-stopped")
	}

	arguments = append(arguments, manifest.SecurityOptions.arguments()...)
	arguments = append(arguments, manifest.Budgets.tmpfsArguments()...)
	for _, mount := range manifest.Mounts {
		arguments = append(arguments, "--mount", mount.argument())
	}

	return append(arguments, manifest.Image), nil
}

// permitsImage is whether the image is one a container may run here: on a contained host only the pinned agent image.
func (rules ContainerRules) permitsImage(image string) bool {
	return !rules.Arrangement.IsContained() || image == rules.AgentImage
}

// permit is whether the mounts fit the arrangement: a local helper has exactly one folder of this machine; a
// contained one has one to three mounts of the agent daemon, each on its own allowed folder.
func (rules ContainerRules) permit(mounts []ContainerMount) bool {
	if !rules.Arrangement.IsContained() {
		return len(mounts) == 1 && mounts[0].Type == MountBind
	}

	if len(mounts) == 0 || len(mounts) > maxContainedMounts {
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

// argument is the mount as `docker create --mount` reads it, read-only unless it is writable.
func (mount ContainerMount) argument() string {
	argument := "type=bind,source=" + mount.Source + ",target=" + mount.Target + ",bind-propagation=rprivate"
	if mount.Type == MountVolume {
		argument = "type=volume,source=" + mount.Source + ",target=" + mount.Target
	}

	if !mount.Writable {
		argument += ",readonly"
	}

	return argument
}

// readOnlyAt is the mount as `docker run --mount` reads it, read-only at another target, as a check or a clone
// reads the workspace.
func (mount ContainerMount) readOnlyAt(target string) string {
	return ContainerMount{Type: mount.Type, Source: mount.Source, Target: target}.argument()
}

// isPlain is whether each profile is one value, since a comma or a newline would smuggle in another option.
func (options SecurityOptions) isPlain() bool {
	return !strings.ContainsAny(options.Seccomp+options.AppArmor, ",\n")
}

// arguments are the --security-opt arguments of the profiles that are set.
func (options SecurityOptions) arguments() []string {
	var arguments []string
	if options.Seccomp != "" {
		arguments = append(arguments, "--security-opt", "seccomp="+options.Seccomp)
	}

	if options.AppArmor != "" {
		arguments = append(arguments, "--security-opt", "apparmor="+options.AppArmor)
	}

	return arguments
}

// tmpfsArguments are the --tmpfs arguments in a fixed order, sized from the budgets, or from the old sizes when the
// budgets name none.
func (budgets ContainerBudgets) tmpfsArguments() []string {
	sizes := []struct {
		folder string
		bytes  int
	}{
		{"/tmp", cmp.Or(budgets.TmpBytes, defaultTmpBytes)},
		{"/run/journal", runJournalBytes},
		{"/home/journal", cmp.Or(budgets.HomeBytes, defaultHomeBytes)},
	}

	var arguments []string
	for _, size := range sizes {
		arguments = append(arguments, "--tmpfs", size.folder+":size="+strconv.Itoa(size.bytes))
	}

	return arguments
}

// Containers runs the Docker commands of a required-container start, under the container rules of the host; on a
// contained host every command goes to the agent daemon at Host.
type Containers struct {
	Docker string
	Host   string
	Rules  ContainerRules
}

// command is a Docker command, sent to the agent daemon when the host names one.
func (containers Containers) command(ctx context.Context, arguments ...string) *exec.Cmd {
	if containers.Host != "" {
		arguments = append([]string{"--host", containers.Host}, arguments...)
	}

	return exec.CommandContext(ctx, containers.Docker, arguments...)
}

// ErrAgentDaemonUnreachable is returned when a Docker command cannot reach the agent daemon at all, which says nothing
// about the images it holds (doc 61, story 64).
var ErrAgentDaemonUnreachable = errors.New("the agent container runtime cannot be reached")

// ErrBudgetsUnenforced is returned when the agent daemon has no cgroup driver, so the CPU, memory and process budgets
// every agent container is created with would be accepted and discarded.
var ErrBudgetsUnenforced = errors.New("the agent daemon cannot hold container budgets: it has no cgroup driver")

// AssertBudgetsEnforced refuses an agent daemon whose cgroup driver is none; a daemon it cannot reach is named as that.
func (containers Containers) AssertBudgetsEnforced(ctx context.Context) error {
	info := containers.command(ctx, "info", "--format", "{{.CgroupDriver}}")
	var refusal strings.Builder
	info.Stderr = &refusal
	output, err := info.Output()
	if err != nil {
		return fmt.Errorf("%w: %s", ErrAgentDaemonUnreachable, failureLine(refusal.String(), err))
	}

	if driver := strings.TrimSpace(string(output)); driver == "" || driver == "none" {
		return ErrBudgetsUnenforced
	}

	return nil
}

// AssertImagePinned refuses an image the agent daemon lacks or holds under another digest than the reference names;
// a reference matches the image's id or one of its repository digests. A daemon it cannot reach is named as that.
func (containers Containers) AssertImagePinned(ctx context.Context, reference string) error {
	// A loaded image has no repository digests, on which Docker's join refuses to run: range writes nothing for none.
	inspect := containers.command(ctx, "image", "inspect", "--format", `{{.Id}}{{range .RepoDigests}} {{.}}{{end}}`, reference)
	var refusal strings.Builder
	inspect.Stderr = &refusal
	output, err := inspect.Output()
	if err != nil && strings.Contains(refusal.String(), "No such image") {
		return fmt.Errorf("%w: the image %s is not loaded into the agent daemon", ErrInstallationChanged, reference)
	}

	if err != nil {
		return fmt.Errorf("%w: %s", ErrAgentDaemonUnreachable, failureLine(refusal.String(), err))
	}

	digests := strings.Fields(string(output))
	_, wanted, _ := strings.Cut(reference, "@")
	if slices.Contains(digests, reference) || (wanted != "" && digests[0] == wanted) || digests[0] == reference {
		return nil
	}

	return fmt.Errorf("%w: %s names %s, but the agent daemon holds %s", ErrInstallationChanged, reference,
		cmp.Or(wanted, reference), digests[0])
}

// ContainerProcess is the program a container runs as its own process, after the image's entrypoint: its command and
// the environment it is given, with no path of the host in it. A helper without its own program has none.
type ContainerProcess struct {
	Command     []string
	Environment []string
	// Restart is the command the container runs instead when it comes back after a restart of the agent daemon or the
	// server: the program resuming its conversation. It runs once the conversation's transcript is in Transcript.
	Restart []string
	// Transcript is where the conversation's transcript is found.
	Transcript ConversationTranscript
}

// ConversationTranscript is the folder holding a conversation's transcripts and the conversation's id: Claude Code
// and Codex both name the transcript file with the id and .jsonl at its end.
type ConversationTranscript struct {
	Folder         string
	ConversationID string
}

// arguments puts the process into `docker create` arguments that end with the image: its environment before the
// image, its command after it.
func (process ContainerProcess) arguments(create []string) []string {
	image := create[len(create)-1]
	arguments := append([]string{}, create[:len(create)-1]...)
	for _, entry := range process.Environment {
		arguments = append(arguments, "--env", entry)
	}

	return append(append(arguments, image), process.command()...)
}

// command is the process's own command, or, with a restart command, a shell that runs the restart command once the
// conversation's transcript exists and the first command otherwise, so a container brought back by its restart
// policy resumes the conversation instead of starting it a second time.
func (process ContainerProcess) command() []string {
	if len(process.Restart) == 0 {
		return process.Command
	}

	script := `if find "$1" -name "*$2.jsonl" -print -quit 2>/dev/null | grep -q .; then exec ` +
		shellWords(process.Restart) + `; fi; exec ` + shellWords(process.Command)

	return []string{"/bin/sh", "-c", script, "journal-session", process.Transcript.Folder,
		process.Transcript.ConversationID}
}

// Create creates the container from the manifest, running the process, and answers its id; a daemon that would
// discard the manifest's budgets is refused before anything is created, and the workspace is filled or checked and a
// writer's checkout made before its container.
func (containers Containers) Create(
	ctx context.Context,
	manifest ContainerManifest,
	name string,
	labels LaunchLabels,
	process ContainerProcess,
) (string, error) {
	if _, err := manifest.DockerCreateArguments(name, labels, containers.Rules); err != nil {
		return "", err
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

	arguments, err := manifest.DockerCreateArguments(name, labels, containers.Rules)
	if err != nil {
		return "", err
	}

	if err := containers.EnsureVolumes(ctx, manifest, labels); err != nil {
		return "", err
	}

	output, err := containers.command(ctx, process.arguments(arguments)...).Output()
	return strings.TrimSpace(string(output)), err
}

// EnsureNetwork makes the session's own network when the agent daemon lacks it, labelled with the installation and
// the session, so a container of the session shares no network with another.
func (containers Containers) EnsureNetwork(ctx context.Context, name string, labels LaunchLabels) error {
	if containers.command(ctx, "network", "inspect", name).Run() == nil {
		return nil
	}

	create := []string{
		"network", "create",
		"--label", installationLabel + "=" + labels.Installation,
		"--label", sessionLabel + "=" + labels.Session,
		name,
	}
	if output, err := containers.command(ctx, create...).CombinedOutput(); err != nil {
		return fmt.Errorf("creating the network %s failed: %w: %s", name, err, strings.TrimSpace(string(output)))
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
	var options []string
	if seccomp != "" {
		options = []string{"--security-opt", "seccomp=" + seccomp}
	}

	return containers.runCheckWith(ctx, options, program, arguments...)
}

// runCheckWith runs a check as RunCheck does, with the extra docker options given, such as a read-only mount.
func (containers Containers) runCheckWith(ctx context.Context, options []string, program string, arguments ...string) (string, error) {
	run := []string{
		"run", "--rm", "--network", "none", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
		"--user", agentUser, "--label", installationLabel + "=" + string(containers.Rules.InstallationName),
	}
	run = append(run, options...)

	run = append(run, "--entrypoint", program, containers.Rules.AgentImage)
	output, err := containers.command(ctx, append(run, arguments...)...).CombinedOutput()

	return strings.TrimSpace(string(output)), err
}

// ErrHistoryMissing refuses a resume whose history volume is gone, so it never starts with an empty history.
var ErrHistoryMissing = errors.New("the history of the resumed conversation is gone")

// EnsureVolumes makes each named volume of the manifest that the agent daemon lacks, labelled with the installation
// and the session but no launch, so a launch's cleanup keeps it; a volume that must exist and does not refuses.
func (containers Containers) EnsureVolumes(ctx context.Context, manifest ContainerManifest, labels LaunchLabels) error {
	for _, mount := range manifest.Mounts {
		if mount.Type != MountVolume || containers.command(ctx, "volume", "inspect", mount.Source).Run() == nil {
			continue
		}

		if mount.MustExist {
			return fmt.Errorf("%w: %s", ErrHistoryMissing, mount.Source)
		}

		create := []string{
			"volume", "create",
			"--label", installationLabel + "=" + labels.Installation,
			"--label", sessionLabel + "=" + labels.Session,
			mount.Source,
		}
		if output, err := containers.command(ctx, create...).CombinedOutput(); err != nil {
			return fmt.Errorf("creating the volume %s failed: %w: %s", mount.Source, err, strings.TrimSpace(string(output)))
		}
	}

	return nil
}

// Attach is the command that attaches to an attachable container's terminal, for the host's pty to run as it runs a
// local program; ending the attach leaves the container running, since no signal is passed on to it.
func (containers Containers) Attach(ctx context.Context, name string) *exec.Cmd {
	return containers.command(ctx, "attach", "--sig-proxy=false", name)
}

// Start starts a created container.
func (containers Containers) Start(ctx context.Context, id string) error {
	return containers.command(ctx, "start", id).Run()
}

// IsRunning answers whether the container runs, as docker inspect reports it; a failed inspect is an error, never
// an answer.
func (containers Containers) IsRunning(ctx context.Context, id string) (bool, error) {
	output, err := containers.command(ctx, "inspect", "--format", "{{.State.Running}}", id).Output()
	if err != nil {
		return false, err
	}
	return strings.TrimSpace(string(output)) == "true", nil
}

// Stop stops the container within the bound and answers only once inspect shows it stopped.
func (containers Containers) Stop(ctx context.Context, id string, seconds int) error {
	if err := containers.command(ctx, "stop", "--time", strconv.Itoa(seconds), id).Run(); err != nil {
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
