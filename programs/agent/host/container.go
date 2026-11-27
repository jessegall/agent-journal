package host

import (
	"cmp"
	"context"
	"errors"
	"fmt"
	"os"
	"path"
	"regexp"
	"slices"
	"strings"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/api/types/mount"
	"github.com/moby/moby/client"
)

// ContainerRules are the host's own settings that bound what a manifest may ask for: where its containers run, the name
// every volume of its containers opens with, the images the journal allowed, and the daemon folder a daemon bind may
// come from. None of them comes from the journal.
type ContainerRules struct {
	Arrangement      Arrangement
	InstallationName InstallationName
	Allowed          *AllowedImages
	// DataFolder is the Docker daemon's folder every daemon bind comes from, set when the host is installed.
	DataFolder string
	// SecretsFolder is where the host finds the secrets a container run may take as its input, such as deploy keys.
	SecretsFolder string
}

// addableCapabilities are the only capabilities a container may get back after every one is dropped.
var addableCapabilities = []string{"CHOWN", "DAC_OVERRIDE", "FOWNER", "SETGID", "SETPCAP", "SETUID"}

var (
	// ErrManifestUnsafe refuses a manifest that asks Docker for what no container of the journal may have.
	ErrManifestUnsafe = errors.New("the container manifest asks for more than a container may have")
	// ErrPreparationFailed refuses a container whose preparation ended with an exit code other than 0.
	ErrPreparationFailed = errors.New("a preparation of the container failed")
	// ErrVolumeMissing refuses a container whose volume must already exist and does not.
	ErrVolumeMissing = errors.New("a volume the container needs is gone")
	// ErrSecretMissing refuses a run whose input secret the host does not hold.
	ErrSecretMissing = errors.New("the host holds no secret of that name")
)

// plainName is a name Docker takes as one value: letters, digits, dots, dashes and underscores.
var plainName = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9_.-]*$`)

// IsSafe is whether the manifest stays inside the floor every container keeps: an allowed image pinned by digest,
// no capability outside the short list, plain security options, no network of the machine or of another container,
// and mounts and memory folders the host's own rules allow; each preparation keeps it too.
func (manifest ContainerManifest) IsSafe(rules ContainerRules) bool {
	isConfined := IsPinnedReference(manifest.Image) && rules.permitsImage(manifest.Image) &&
		manifest.SecurityOptions.isPlain() && rules.permitsNetwork(manifest.Network) &&
		!slices.ContainsFunc(manifest.Capabilities, func(added string) bool { return !slices.Contains(addableCapabilities, added) })

	return isConfined && rules.permit(manifest.Mounts, manifest.Tmpfs) && rules.permitsVolumes(manifest.Volumes) &&
		!slices.ContainsFunc(manifest.Preparations, func(run ContainerRun) bool { return !run.Manifest.IsSafe(rules) })
}

// permitsNetwork is whether the network is one of the container's own: never the machine's or another container's.
func (rules ContainerRules) permitsNetwork(network string) bool {
	return network != "host" && !strings.HasPrefix(network, "container:")
}

// permitsImage is whether the image is one a container may run here: on a contained host only an image the journal
// allowed.
func (rules ContainerRules) permitsImage(image string) bool {
	return !rules.Arrangement.IsContained() || rules.Allowed.Permits(image)
}

// permit is whether every mount and memory folder has a clean target of its own, and each mount a source the
// arrangement allows.
func (rules ContainerRules) permit(mounts []ContainerMount, folders []ContainerTmpfs) bool {
	seen := map[string]bool{}
	for _, mounted := range mounts {
		if seen[mounted.Target] || !isCleanTarget(mounted.Target) || !rules.permitsSource(mounted) {
			return false
		}
		seen[mounted.Target] = true
	}

	for _, folder := range folders {
		if seen[folder.Target] || !isCleanTarget(folder.Target) || strings.ContainsAny(folder.Options, "\n") {
			return false
		}
		seen[folder.Target] = true
	}

	return true
}

// permitsSource is whether a mount comes from where it may: on a contained host a volume of this installation, a
// clean folder under the host's data folder, or memory; on a local host a folder of this machine.
func (rules ContainerRules) permitsSource(mounted ContainerMount) bool {
	if !rules.Arrangement.IsContained() {
		return mounted.Type == MountBind && isCleanTarget(mounted.Source)
	}

	switch mounted.Type {
	case MountVolume:
		return rules.ownsVolume(mounted.Source)
	case MountDaemonBind:
		folder := path.Clean(rules.DataFolder)
		return rules.DataFolder != "" && isCleanTarget(mounted.Source) &&
			(mounted.Source == folder || strings.HasPrefix(mounted.Source, folder+"/"))
	case MountScratch:
		return mounted.Source == "" && mounted.IsWritable
	}

	return false
}

// permitsVolumes is whether every volume the manifest has made is one of this installation's.
func (rules ContainerRules) permitsVolumes(volumes []ContainerVolume) bool {
	return !slices.ContainsFunc(volumes, func(volume ContainerVolume) bool { return !rules.ownsVolume(volume.Name) })
}

// ownsVolume is whether the volume name opens with this installation's name.
func (rules ContainerRules) ownsVolume(name string) bool {
	return rules.InstallationName != "" && strings.HasPrefix(name, string(rules.InstallationName)+"-") &&
		plainName.MatchString(name)
}

// isCleanTarget is whether the path is clean and absolute and the daemon takes it as one argument.
func isCleanTarget(target string) bool {
	return path.IsAbs(target) && path.Clean(target) == target && !strings.ContainsAny(target, ",\n")
}

// ContainerProcess is what the container runs after the image's entrypoint: its command and the environment it is
// given.
type ContainerProcess struct {
	Command     []string
	Environment []string
}

// CreateOptions are the manifest as the daemon creates the container from it, nothing added but every capability
// dropped first, no-new-privileges when it asks for it, and the host's own label that finds it again after a restart.
func (manifest ContainerManifest) CreateOptions(rules ContainerRules, process ContainerProcess) (client.ContainerCreateOptions, error) {
	if !manifest.IsSafe(rules) {
		return client.ContainerCreateOptions{}, ErrManifestUnsafe
	}

	security, err := manifest.SecurityOptions.options()
	if err != nil {
		return client.ContainerCreateOptions{}, err
	}

	if manifest.BlocksNewPrivileges {
		security = append([]string{"no-new-privileges"}, security...)
	}

	processes := int64(manifest.Budgets.Processes)
	openFiles := int64(manifest.Budgets.OpenFiles)
	config := &container.Config{
		User:       manifest.User,
		WorkingDir: manifest.Workdir,
		Image:      manifest.Image,
		Entrypoint: manifest.Entrypoint,
		Cmd:        process.Command,
		Env:        process.Environment,
		Labels:     rules.labelsOf(manifest.Labels),
	}
	hostConfig := &container.HostConfig{
		CapDrop:        []string{"ALL"},
		CapAdd:         manifest.Capabilities,
		NetworkMode:    container.NetworkMode(manifest.Network),
		ReadonlyRootfs: manifest.IsReadOnlyRoot,
		SecurityOpt:    security,
		Tmpfs:          tmpfsOf(manifest.Tmpfs),
		RestartPolicy:  container.RestartPolicy{Name: container.RestartPolicyMode(manifest.Restart)},
		Resources: container.Resources{
			NanoCPUs:   int64(manifest.Budgets.CPUCores) * nanoCPUsInACore,
			Memory:     int64(manifest.Budgets.MemoryBytes),
			MemorySwap: int64(manifest.Budgets.MemorySwapBytes),
			PidsLimit:  &processes,
		},
	}
	if openFiles > 0 {
		hostConfig.Ulimits = []*container.Ulimit{{Name: "nofile", Soft: openFiles, Hard: openFiles}}
	}

	if manifest.IsAttachable {
		config.Tty, config.OpenStdin = true, true
		config.AttachStdin, config.AttachStdout, config.AttachStderr = true, true, true
	}

	for _, mounted := range manifest.Mounts {
		hostConfig.Mounts = append(hostConfig.Mounts, mounted.daemonMount())
	}

	return client.ContainerCreateOptions{Name: manifest.Name, Config: config, HostConfig: hostConfig}, nil
}

// nanoCPUsInACore is one CPU core in the unit the daemon counts CPU budgets in.
const nanoCPUsInACore = 1_000_000_000

// runnerLabel is the one label the host adds to everything it makes, naming its installation, so it finds its own
// containers, networks and volumes again after a restart.
const runnerLabel = "journal.installation"

// labelsOf are the journal's labels as the daemon takes them, with the host's own, which no journal label replaces.
func (rules ContainerRules) labelsOf(labels []ContainerLabel) map[string]string {
	named := map[string]string{}
	for _, label := range labels {
		named[label.Name] = label.Value
	}
	named[runnerLabel] = string(rules.InstallationName)

	return named
}

// tmpfsOf are the memory folders as the daemon takes them, each target with its options.
func tmpfsOf(folders []ContainerTmpfs) map[string]string {
	named := map[string]string{}
	for _, folder := range folders {
		named[folder.Target] = folder.Options
	}

	return named
}

// daemonMount is the mount as the daemon takes it, read-only unless it is writable.
func (mounted ContainerMount) daemonMount() mount.Mount {
	switch mounted.Type {
	case MountVolume:
		return volumeMount(mounted.Source, mounted.Target, mounted.IsWritable)
	case MountScratch:
		return scratchMount(mounted.Target)
	}

	return bindMount(mounted.Source, mounted.Target, mounted.IsWritable)
}

// imageIDPattern is an image named by its id, the config digest a loaded image keeps.
var imageIDPattern = regexp.MustCompile(`^sha256:[0-9a-f]{64}$`)

// IsPinnedReference is whether an image reference names exactly one image: by its id, or by name and digest.
func IsPinnedReference(reference string) bool {
	return imageIDPattern.MatchString(reference) || strings.Contains(reference, "@sha256:")
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

// Containers are the containers of one Docker daemon, reached through Docker's own client, under the container rules
// of the host; on a contained host the daemon is the Docker daemon.
type Containers struct {
	Daemon *client.Client
	Rules  ContainerRules
}

// ErrContainerNotCreated is returned when the Docker daemon refuses to create a container; the error carries the
// daemon's own first line, which says why.
var ErrContainerNotCreated = errors.New("the Docker daemon did not create the container")

// ErrDaemonUnreachable is returned when a call cannot reach the Docker daemon at all, which says nothing about
// the images it holds.
var ErrDaemonUnreachable = errors.New("the Docker daemon cannot be reached")

// ErrBudgetsUnenforced is returned when the Docker daemon has no cgroup driver, so the CPU, memory and process budgets
// every container is created with would be accepted and discarded.
var ErrBudgetsUnenforced = errors.New("the Docker daemon cannot hold container budgets: it has no cgroup driver")

// AssertBudgetsEnforced refuses an Docker daemon whose cgroup driver is none; a daemon it cannot reach is named as that.
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

// AssertImagePinned refuses an image the Docker daemon lacks or holds under another digest than the reference names;
// a reference matches the image's id or one of its repository digests. A daemon it cannot reach is named as that.
func (containers Containers) AssertImagePinned(ctx context.Context, reference string) error {
	image, err := containers.Daemon.ImageInspect(ctx, reference)
	if isAbsent(err) {
		return fmt.Errorf("%w: the image %s is not loaded into the Docker daemon", ErrInstallationChanged, reference)
	}

	if err != nil {
		return unreachable(err)
	}

	_, wanted, _ := strings.Cut(reference, "@")
	if slices.Contains(image.RepoDigests, reference) || (wanted != "" && image.ID == wanted) || image.ID == reference {
		return nil
	}

	return fmt.Errorf("%w: %s names %s, but the Docker daemon holds %s", ErrInstallationChanged, reference,
		cmp.Or(wanted, reference), image.ID)
}

// Create makes the container the manifest describes: its preparations run first, in order, then its network and
// volumes are made when the daemon lacks them, and the container is created running the process. It answers the
// container's id.
func (containers Containers) Create(ctx context.Context, manifest ContainerManifest, process ContainerProcess) (string, error) {
	options, err := manifest.CreateOptions(containers.Rules, process)
	if err != nil {
		return "", err
	}

	if err := containers.AssertBudgetsEnforced(ctx); err != nil {
		return "", err
	}

	for _, preparation := range manifest.Preparations {
		result, err := containers.RunToEnd(ctx, preparation)
		if err != nil {
			return "", err
		}
		if result.ExitCode != 0 || result.IsTimedOut {
			return "", fmt.Errorf("%w: exit %d, timed out %v: %s%s", ErrPreparationFailed, result.ExitCode, result.IsTimedOut,
				result.Stdout, result.Stderr)
		}
	}

	if err := containers.EnsureNetwork(ctx, manifest.Network, manifest.NetworkLabels); err != nil {
		return "", err
	}

	if err := containers.EnsureVolumes(ctx, manifest.Volumes); err != nil {
		return "", err
	}

	created, err := containers.Daemon.ContainerCreate(ctx, options)
	if err != nil {
		return "", fmt.Errorf("%w: %v", ErrContainerNotCreated, err)
	}

	return created.ID, nil
}

// EnsureNetwork makes the named network when the Docker daemon lacks it, with the journal's labels; the daemon's own
// networks, such as none, are never made.
func (containers Containers) EnsureNetwork(ctx context.Context, name string, labels []ContainerLabel) error {
	if name == "" || name == "none" || name == "host" || name == "bridge" {
		return nil
	}

	if _, err := containers.Daemon.NetworkInspect(ctx, name, client.NetworkInspectOptions{}); err == nil {
		return nil
	}

	_, err := containers.Daemon.NetworkCreate(ctx, name, client.NetworkCreateOptions{Labels: containers.Rules.labelsOf(labels)})
	if err != nil {
		return fmt.Errorf("creating the network %s failed: %w", name, err)
	}

	return nil
}

// hasVolume is whether the Docker daemon holds the named volume.
func (containers Containers) hasVolume(ctx context.Context, name string) bool {
	_, err := containers.Daemon.VolumeInspect(ctx, name, client.VolumeInspectOptions{})

	return err == nil
}

// EnsureVolumes makes each volume the daemon lacks, with its labels and its size when it has one; a volume that must
// exist and does not refuses the container.
func (containers Containers) EnsureVolumes(ctx context.Context, volumes []ContainerVolume) error {
	for _, volume := range volumes {
		if containers.hasVolume(ctx, volume.Name) {
			continue
		}

		if volume.IsAlreadyMade {
			return fmt.Errorf("%w: %s", ErrVolumeMissing, volume.Name)
		}

		if err := containers.createVolume(ctx, volume); err != nil {
			return err
		}
	}

	return nil
}

// ReadSecret reads a secret the host holds, by its plain name, for a run's input.
func (rules ContainerRules) ReadSecret(name string) ([]byte, error) {
	if rules.SecretsFolder == "" || !plainName.MatchString(name) {
		return nil, fmt.Errorf("%w: %q", ErrSecretMissing, name)
	}

	secret, err := os.ReadFile(path.Join(rules.SecretsFolder, name))
	if err != nil {
		return nil, fmt.Errorf("%w: %s", ErrSecretMissing, name)
	}

	return secret, nil
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

// Stop stops the container within the bound, answering what the daemon answered.
func (containers Containers) Stop(ctx context.Context, id string, seconds int) error {
	_, err := containers.Daemon.ContainerStop(ctx, id, client.ContainerStopOptions{Timeout: &seconds})

	return err
}
