package host

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
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

// ContainersOn are the containers of the Docker daemon that listens at the socket, under the rules given, reached
// through Docker's own client. With no socket named, the daemon is the one this machine's environment names.
func ContainersOn(socket string, rules ContainerRules) (Containers, error) {
	return containersRecordedInto(socket, rules, recording.JournalDrafts())
}

// containersRecordedInto are the daemon's containers, each call to the daemon kept in the drafts while they are on.
func containersRecordedInto(socket string, rules ContainerRules, drafts recording.Drafts) (Containers, error) {
	where := client.FromEnv
	if socket != "" {
		where = client.WithHost(socket)
	}

	recorded, err := recordedDaemon(where, drafts)
	if err != nil {
		return Containers{}, fmt.Errorf("%w: %v", ErrDaemonUnreachable, err)
	}
	options := append([]client.Opt{where}, recorded...)

	daemon, err := client.New(options...)
	if err != nil {
		return Containers{}, fmt.Errorf("%w: %v", ErrDaemonUnreachable, err)
	}

	return Containers{Daemon: daemon, Rules: rules}, nil
}

// recordedDaemonExchange is the exchange of the recording run that holds the Docker daemon's calls.
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

// RunToEnd runs a container the journal describes to its end, or to its deadline, and answers its exit code and what
// it printed on each stream, the first bytes of each up to the run's output limit. Its input, or the host secret it
// names, is written to its standard input and closed. The container and its anonymous volumes are removed after.
func (containers Containers) RunToEnd(ctx context.Context, run ContainerRun) (ContainerRunResult, error) {
	input, err := containers.inputOf(run)
	if err != nil {
		return ContainerRunResult{}, err
	}

	options, err := run.Manifest.CreateOptions(containers.Rules, ContainerProcess{Command: run.Command, Environment: run.Environment})
	if err != nil {
		return ContainerRunResult{}, err
	}
	options.Config.AttachStdout, options.Config.AttachStderr = true, true
	options.Config.AttachStdin, options.Config.OpenStdin, options.Config.StdinOnce = input != nil, input != nil, input != nil

	if err := containers.AssertBudgetsEnforced(ctx); err != nil {
		return ContainerRunResult{}, err
	}

	if err := containers.EnsureVolumes(ctx, run.Manifest.Volumes); err != nil {
		return ContainerRunResult{}, err
	}

	created, err := containers.Daemon.ContainerCreate(ctx, options)
	if err != nil {
		return ContainerRunResult{}, fmt.Errorf("%w: %v", ErrContainerNotCreated, err)
	}
	defer containers.discard(created.ID)

	attached, err := containers.Daemon.ContainerAttach(ctx, created.ID, client.ContainerAttachOptions{
		Stream: true, Stdin: input != nil, Stdout: true, Stderr: true,
	})
	if err != nil {
		return ContainerRunResult{}, err
	}
	defer attached.Close()

	if _, err := containers.Daemon.ContainerStart(ctx, created.ID, client.ContainerStartOptions{}); err != nil {
		return ContainerRunResult{}, err
	}

	if input != nil {
		go func() {
			_, _ = attached.Conn.Write(input)
			_ = attached.CloseWrite()
		}()
	}

	var stdout, stderr boundedBuffer
	stdout.limit, stderr.limit = run.OutputLimit, run.OutputLimit
	waited, stop := context.WithTimeout(ctx, time.Duration(run.DeadlineMs)*time.Millisecond)
	defer stop()
	copied := make(chan struct{})
	go func() {
		_, _ = stdcopy.StdCopy(&stdout, &stderr, attached.Reader)
		close(copied)
	}()

	code, err := containers.exitCodeOf(waited, created.ID)
	isTimedOut := errors.Is(waited.Err(), context.DeadlineExceeded)
	if err != nil && !isTimedOut {
		return ContainerRunResult{}, err
	}
	if !isTimedOut {
		<-copied
	}

	return ContainerRunResult{
		ExitCode:    code,
		Stdout:      stdout.String(),
		Stderr:      stderr.String(),
		IsTruncated: stdout.isCut || stderr.isCut,
		IsTimedOut:  isTimedOut,
	}, nil
}

// boundedBuffer keeps the first bytes written to it, up to its limit, and notes whether more came.
type boundedBuffer struct {
	bytes.Buffer
	limit int
	isCut bool
}

func (buffer *boundedBuffer) Write(written []byte) (int, error) {
	room := buffer.limit - buffer.Len()
	if room < len(written) {
		buffer.isCut = true
		_, _ = buffer.Buffer.Write(written[:max(room, 0)])
		return len(written), nil
	}
	return buffer.Buffer.Write(written)
}

// inputOf is what the run reads on its standard input: its own input, or the host secret it names; nil for none.
func (containers Containers) inputOf(run ContainerRun) ([]byte, error) {
	if run.InputSecret != "" {
		return containers.Rules.ReadSecret(run.InputSecret)
	}

	return run.Input, nil
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

// lastPrinted are the last lines of the container's log, as many as asked, as they were printed; empty when the
// daemon kept none. A terminal's log is its bytes as they are; any other comes in frames of output and error.
func (containers Containers) lastPrinted(ctx context.Context, name string, hasTerminal bool, lines int) string {
	logs, err := containers.Daemon.ContainerLogs(ctx, name, client.ContainerLogsOptions{
		ShowStdout: true, ShowStderr: true, Tail: strconv.Itoa(lines),
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

	return printed.String()
}

// ErrWorkspaceQuotaUnavailable refuses a volume of bounded size on a daemon that cannot bound one.
var ErrWorkspaceQuotaUnavailable = errors.New("workspace-quota-unavailable: this host has no bounded workspace volume")

// createVolume makes the volume with the journal's labels and, when it names one, the most bytes it holds. A daemon
// that cannot bound a volume's size answers ErrWorkspaceQuotaUnavailable and has made nothing.
func (containers Containers) createVolume(ctx context.Context, volume ContainerVolume) error {
	options := client.VolumeCreateOptions{Name: volume.Name, Labels: containers.Rules.labelsOf(volume.Labels)}
	if volume.SizeBytes > 0 {
		options.DriverOpts = map[string]string{"size": strconv.FormatInt(volume.SizeBytes, 10)}
	}

	_, err := containers.Daemon.VolumeCreate(ctx, options)
	if err == nil {
		return nil
	}

	if strings.Contains(strings.ToLower(err.Error()), "quota") {
		return fmt.Errorf("%w (asked for %d bytes)", ErrWorkspaceQuotaUnavailable, volume.SizeBytes)
	}

	return fmt.Errorf("creating the volume %s failed: %w", volume.Name, err)
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
	return fmt.Errorf("%w: %v", ErrDaemonUnreachable, err)
}

// bindMount is a folder of the daemon's machine at the target, private to the container, read-only unless writable.
func bindMount(source, target string, writable bool) mount.Mount {
	return mount.Mount{
		Type: mount.TypeBind, Source: source, Target: target, ReadOnly: !writable,
		BindOptions: &mount.BindOptions{Propagation: mount.PropagationRPrivate},
	}
}

// scratchMount is a writable folder in the container's memory at the target, gone with the container.
func scratchMount(target string) mount.Mount {
	return mount.Mount{Type: mount.TypeTmpfs, Target: target, TmpfsOptions: &mount.TmpfsOptions{Mode: os.ModeSticky | 0o777}}
}

// volumeMount is a named volume of the daemon at the target, read-only unless writable.
func volumeMount(name, target string, writable bool) mount.Mount {
	return mount.Mount{Type: mount.TypeVolume, Source: name, Target: target, ReadOnly: !writable}
}
