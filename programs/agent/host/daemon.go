package host

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	cerrdefs "github.com/containerd/errdefs"
	"github.com/docker/go-connections/sockets"
	"github.com/moby/moby/api/pkg/stdcopy"
	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/api/types/mount"
	"github.com/moby/moby/client"

	"journal-agent/recording"
)

// ContainersOn are the containers of the agent daemon that listens at the socket, under the rules given, reached
// through Docker's own client. With no socket named, the daemon is the one this machine's environment names.
func ContainersOn(socket string, rules ContainerRules) (Containers, error) {
	return containersRecordedInto(socket, rules, recording.DraftsFromEnvironment())
}

// containersRecordedInto are the daemon's containers, each call to the daemon kept in the drafts while they are on.
func containersRecordedInto(socket string, rules ContainerRules, drafts recording.Drafts) (Containers, error) {
	where := client.FromEnv
	if socket != "" {
		where = client.WithHost(socket)
	}

	options := []client.Opt{where}
	if drafts.IsOn {
		recorded, err := recordedDaemon(where, drafts)
		if err != nil {
			return Containers{}, fmt.Errorf("%w: %v", ErrAgentDaemonUnreachable, err)
		}
		options = append(options, recorded...)
	}

	daemon, err := client.New(options...)
	if err != nil {
		return Containers{}, fmt.Errorf("%w: %v", ErrAgentDaemonUnreachable, err)
	}

	return Containers{Daemon: daemon, Rules: rules}, nil
}

// recordedDaemonExchange is the exchange of the recording run that holds the agent daemon's calls.
const recordedDaemonExchange = "daemon"

// recordedDaemon are the client options that send every call to the daemon through the recording run's Docker tap:
// the calls through a transport of the daemon's own address, an attach through the client's hooks, as the client
// sends an attach on a connection of its own.
func recordedDaemon(where client.Opt, drafts recording.Drafts) ([]client.Opt, error) {
	probe, err := client.New(where)
	if err != nil {
		return nil, err
	}
	address, err := client.ParseHostURL(probe.DaemonHost())
	_ = probe.Close()
	if err != nil {
		return nil, err
	}
	transport := &http.Transport{MaxIdleConns: 6, IdleConnTimeout: 30 * time.Second}
	if err := sockets.ConfigureTransport(transport, address.Scheme, address.Host); err != nil {
		return nil, err
	}
	tap := recording.RecordDocker{Next: transport, Recorder: recording.NewCallRecorder(recording.WireDocker, drafts),
		Exchange: recordedDaemonExchange}
	return []client.Opt{
		client.WithHTTPClient(&http.Client{Transport: tap, CheckRedirect: client.CheckRedirect}),
		client.WithHTTPRequestHook(tap.UpgradeAsked),
		client.WithHTTPResponseHook(tap.UpgradeAnswered),
	}, nil
}

// ExitedWith is a container's program that ended with an exit code other than 0.
type ExitedWith int

func (code ExitedWith) Error() string {
	return "exit status " + strconv.Itoa(int(code))
}

// lastLines is how many lines of what a program printed are kept as the reason it ended.
const lastLines = 20

// throwaway is a container that runs one program of the agent image to its end and is then removed: what it runs,
// as whom, and what it may reach. It has no network unless one is named.
type throwaway struct {
	User            string
	Program         string
	Arguments       []string
	Environment     []string
	Mounts          []mount.Mount
	Tmpfs           map[string]string
	ReadOnlyRoot    bool
	Capabilities    []string
	SecurityOptions []string
	// HasNetwork leaves the container on the daemon's default network, as a clone from a remote needs.
	HasNetwork bool
	// Input is what the program reads on its standard input, such as a deploy key; nil gives it none.
	Input []byte
}

// createOptions are the throwaway as the daemon creates it: every capability dropped but the ones named, no new
// privileges, and the installation's label.
func (run throwaway) createOptions(rules ContainerRules) client.ContainerCreateOptions {
	network := container.NetworkMode("none")
	if run.HasNetwork {
		network = ""
	}

	return client.ContainerCreateOptions{
		Config: &container.Config{
			User:         run.User,
			Image:        rules.AgentImage,
			Entrypoint:   []string{run.Program},
			Cmd:          run.Arguments,
			Env:          run.Environment,
			Labels:       map[string]string{installationLabel: string(rules.InstallationName)},
			AttachStdout: true,
			AttachStderr: true,
			AttachStdin:  run.Input != nil,
			OpenStdin:    run.Input != nil,
			StdinOnce:    run.Input != nil,
		},
		HostConfig: &container.HostConfig{
			NetworkMode:    network,
			CapDrop:        []string{"ALL"},
			CapAdd:         run.Capabilities,
			SecurityOpt:    append([]string{"no-new-privileges"}, run.SecurityOptions...),
			ReadonlyRootfs: run.ReadOnlyRoot,
			Tmpfs:          run.Tmpfs,
			Mounts:         run.Mounts,
		},
	}
}

// runToEnd runs the throwaway container and answers what its program printed, with ExitedWith when it ended with
// another exit code than 0. The container and its anonymous volumes are removed whatever happened.
func (containers Containers) runToEnd(ctx context.Context, run throwaway) (string, error) {
	created, err := containers.Daemon.ContainerCreate(ctx, run.createOptions(containers.Rules))
	if err != nil {
		return "", err
	}
	defer containers.discard(created.ID)

	attached, err := containers.Daemon.ContainerAttach(ctx, created.ID, client.ContainerAttachOptions{
		Stream: true, Stdin: run.Input != nil, Stdout: true, Stderr: true,
	})
	if err != nil {
		return "", err
	}
	defer attached.Close()

	if _, err := containers.Daemon.ContainerStart(ctx, created.ID, client.ContainerStartOptions{}); err != nil {
		return "", err
	}

	if run.Input != nil {
		go func() {
			_, _ = attached.Conn.Write(run.Input)
			_ = attached.CloseWrite()
		}()
	}

	var printed bytes.Buffer
	_, _ = stdcopy.StdCopy(&printed, &printed, attached.Reader)
	code, err := containers.exitCodeOf(ctx, created.ID)
	if err == nil && code != 0 {
		err = ExitedWith(code)
	}

	return strings.TrimSpace(printed.String()), err
}

// discard removes a container the host is done with, running or not, with its anonymous volumes. It has its own
// time, so a start that was given up still leaves nothing behind.
func (containers Containers) discard(id string) {
	_ = containers.removeRunning(context.Background(), id)
}

// removeRunning removes a container whether it runs or not, with its anonymous volumes.
func (containers Containers) removeRunning(ctx context.Context, id string) error {
	_, err := containers.Daemon.ContainerRemove(ctx, id, client.ContainerRemoveOptions{Force: true, RemoveVolumes: true})

	return err
}

// exitCodeOf waits until the container's program does not run and answers its exit code.
func (containers Containers) exitCodeOf(ctx context.Context, id string) (int, error) {
	waited := containers.Daemon.ContainerWait(ctx, id, client.ContainerWaitOptions{
		Condition: container.WaitConditionNotRunning,
	})
	select {
	case result := <-waited.Result:
		if result.Error != nil {
			return 0, errors.New(result.Error.Message)
		}

		return int(result.StatusCode), nil
	case err := <-waited.Error:
		return 0, err
	case <-ctx.Done():
		return 0, ctx.Err()
	}
}

// lastPrinted are the last lines the container's program printed, for the reason it ended; empty when the daemon
// kept none. A terminal's log is its bytes as they are; any other comes in frames of standard output and error.
func (containers Containers) lastPrinted(ctx context.Context, name string, hasTerminal bool) string {
	logs, err := containers.Daemon.ContainerLogs(ctx, name, client.ContainerLogsOptions{
		ShowStdout: true, ShowStderr: true, Tail: strconv.Itoa(lastLines),
	})
	if err != nil {
		return ""
	}
	defer logs.Close()

	var printed bytes.Buffer
	if hasTerminal {
		_, _ = printed.ReadFrom(logs)
	} else {
		_, _ = stdcopy.StdCopy(&printed, &printed, logs)
	}

	return strings.TrimSpace(printed.String())
}

// createBoundedVolume makes a named volume that holds at most the bytes given. A daemon that cannot bound a volume's
// size answers ErrWorkspaceQuotaUnavailable and has made nothing.
func (containers Containers) createBoundedVolume(ctx context.Context, name string, labels map[string]string, bytes int) error {
	_, err := containers.Daemon.VolumeCreate(ctx, client.VolumeCreateOptions{
		Name: name, Labels: labels, DriverOpts: map[string]string{"size": strconv.Itoa(bytes)},
	})
	if err == nil {
		return nil
	}

	if strings.Contains(strings.ToLower(err.Error()), "quota") {
		return fmt.Errorf("%w (asked for %d bytes)", ErrWorkspaceQuotaUnavailable, bytes)
	}

	return fmt.Errorf("creating the volume %s failed: %w", name, err)
}

// removeVolume removes a named volume; forced, also one the daemon still counts as in use.
func (containers Containers) removeVolume(ctx context.Context, name string, force bool) error {
	_, err := containers.Daemon.VolumeRemove(ctx, name, client.VolumeRemoveOptions{Force: force})

	return err
}

// isAbsent is whether the daemon answered that what was asked for is not there, which for a removal is done.
func isAbsent(err error) bool {
	return cerrdefs.IsNotFound(err)
}

// absentIsDone answers a removal: done when it succeeded or the resource was already gone.
func absentIsDone(err error) error {
	if err == nil || isAbsent(err) {
		return nil
	}

	return err
}

// unreachable names a failed call as the daemon not being reached, with what the client said.
func unreachable(err error) error {
	return fmt.Errorf("%w: %s", ErrAgentDaemonUnreachable, failureLine(err.Error(), err))
}

// bindMount is a folder of the daemon's machine at the target, private to the container, read-only unless writable.
func bindMount(source, target string, writable bool) mount.Mount {
	return mount.Mount{
		Type: mount.TypeBind, Source: source, Target: target, ReadOnly: !writable,
		BindOptions: &mount.BindOptions{Propagation: mount.PropagationRPrivate},
	}
}

// volumeMount is a named volume of the daemon at the target, read-only unless writable.
func volumeMount(name, target string, writable bool) mount.Mount {
	return mount.Mount{Type: mount.TypeVolume, Source: name, Target: target, ReadOnly: !writable}
}
