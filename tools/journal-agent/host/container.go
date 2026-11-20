package host

import (
	"context"
	"errors"
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

// ContainerMount mirrors App\Agents\Support\ManifestMount: the one host folder a container sees.
type ContainerMount struct {
	Source   string `json:"source"`
	Target   string `json:"target"`
	Writable bool   `json:"writable"`
}

// ContainerBudgets mirrors App\Agents\Support\ExecutionBudgets: the bounds a container runs under.
type ContainerBudgets struct {
	CPUCores        int `json:"cpuCores"`
	MemoryBytes     int `json:"memoryBytes"`
	MemorySwapBytes int `json:"memorySwapBytes"`
	Processes       int `json:"processes"`
	OpenFiles       int `json:"openFiles"`
	TmpBytes        int `json:"tmpBytes"`
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
}

// containerTmpfs mirrors ContainerManifest::TMPFS: the folders a helper writes to, with their size in bytes.
var containerTmpfs = map[string]int{"/tmp": 256 << 20, "/run/journal": 16 << 20, "/home/journal": 64 << 20}

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

// IsSafe is whether the manifest may start a container: unprivileged, with no capabilities or published ports, an
// exact image digest, one workspace mount and a named user.
func (manifest ContainerManifest) IsSafe() bool {
	isConfined := !manifest.Privileged && len(manifest.Capabilities) == 0 && len(manifest.PublishedPorts) == 0
	return isConfined && strings.Contains(manifest.Image, "@sha256:") && len(manifest.Mounts) == 1 && manifest.User != ""
}

// DockerCreateArguments are the arguments of `docker create` for the manifest: its exact image digest, the
// unprivileged user, a read-only root, no capabilities, one workspace mount, the bounded resources and the labels
// that let reconciliation find it again.
func (manifest ContainerManifest) DockerCreateArguments(name string, labels LaunchLabels) ([]string, error) {
	if !manifest.IsSafe() {
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
	for folder, size := range containerTmpfs {
		arguments = append(arguments, "--tmpfs", folder+":size="+strconv.Itoa(size))
	}
	mount := manifest.Mounts[0]
	volume := "type=bind,source=" + mount.Source + ",target=" + mount.Target + ",bind-propagation=rprivate"
	if !mount.Writable {
		volume += ",readonly"
	}
	return append(arguments, "--mount", volume, manifest.Image), nil
}

// Containers runs the Docker commands of a required-container start.
type Containers struct {
	Docker string
}

// Create creates the container from the manifest and answers its id.
func (containers Containers) Create(
	ctx context.Context,
	manifest ContainerManifest,
	name string,
	labels LaunchLabels,
) (string, error) {
	arguments, err := manifest.DockerCreateArguments(name, labels)
	if err != nil {
		return "", err
	}
	output, err := exec.CommandContext(ctx, containers.Docker, arguments...).Output()
	return strings.TrimSpace(string(output)), err
}

// Start starts a created container.
func (containers Containers) Start(ctx context.Context, id string) error {
	return exec.CommandContext(ctx, containers.Docker, "start", id).Run()
}

// IsRunning answers whether the container runs, as docker inspect reports it; a failed inspect is an error, never
// an answer.
func (containers Containers) IsRunning(ctx context.Context, id string) (bool, error) {
	output, err := exec.CommandContext(ctx, containers.Docker, "inspect", "--format", "{{.State.Running}}", id).Output()
	if err != nil {
		return false, err
	}
	return strings.TrimSpace(string(output)) == "true", nil
}

// Stop stops the container within the bound and answers only once inspect shows it stopped.
func (containers Containers) Stop(ctx context.Context, id string, seconds int) error {
	if err := exec.CommandContext(ctx, containers.Docker, "stop", "--time", strconv.Itoa(seconds), id).Run(); err != nil {
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
