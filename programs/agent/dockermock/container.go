package dockermock

import (
	"context"
	"encoding/binary"
	"io"
	"net"
	"net/http"
	"net/url"
	"slices"
	"strconv"
	"strings"
)

// stoppedCode is the exit code of a program its container's stop ended.
const stoppedCode = 143

// frameOutput is the stream a frame of a container without a terminal belongs to: its standard output.
const frameOutput = 1

func newContainer(id, name string, body createBody) *Container {
	reader, writer := io.Pipe()

	return &Container{
		ID:          id,
		Name:        name,
		Config:      body.Config,
		HostConfig:  body.HostConfig,
		input:       writer,
		inputReader: reader,
		resized:     make(chan struct{}, 1),
	}
}

// run starts the container's program: the one a test gave for it, or the default.
func (daemon *Daemon) run(container *Container) {
	program := defaultProgram(container)
	if daemon.Programs != nil {
		if given := daemon.Programs(container); given != nil {
			program = given
		}
	}

	ctx, cancel := context.WithCancel(context.Background())
	// Each start reads input of its own, as a real container's restarted process does.
	reader, writer := io.Pipe()
	container.mutex.Lock()
	container.input, container.inputReader = writer, reader
	container.running, container.started = true, true
	container.cancel = cancel
	container.exited = make(chan struct{})
	container.mutex.Unlock()

	go func() {
		container.end(program(ctx, container, reader, containerOutput{container}))
	}()
}

// isStopping answers whether the daemon is stopping, when it starts no container any more.
func (daemon *Daemon) isStopping() bool {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()

	return daemon.stopping
}

// Printing is a program that prints the text and ends with the exit code.
func Printing(text string, code int) Program {
	return func(_ context.Context, _ *Container, _ io.Reader, output io.Writer) int {
		_, _ = io.WriteString(output, text)

		return code
	}
}

// ReadingInput is a program that reads everything typed into it to the end, prints the text and ends with the exit
// code, as a program fed on its standard input does.
func ReadingInput(text string, code int) Program {
	return func(_ context.Context, _ *Container, input io.Reader, output io.Writer) int {
		_, _ = io.Copy(io.Discard, input)
		_, _ = io.WriteString(output, text)

		return code
	}
}

// defaultProgram is what a container runs when a test gave it no program: with a terminal it reads what is typed
// until it is stopped, without one it ends at once.
func defaultProgram(container *Container) Program {
	if !container.Config.Tty {
		return func(context.Context, *Container, io.Reader, io.Writer) int { return 0 }
	}

	return func(ctx context.Context, _ *Container, input io.Reader, _ io.Writer) int {
		go func() { _, _ = io.Copy(io.Discard, input) }()
		<-ctx.Done()

		return stoppedCode
	}
}

// end ends the container's program once with the exit code: what waits on it is released and what is attached to it
// is closed.
func (container *Container) end(code int) {
	container.mutex.Lock()
	if !container.running {
		container.mutex.Unlock()

		return
	}
	container.running = false
	container.exitCode = code
	attached := container.attached
	container.attached = nil
	container.mutex.Unlock()

	container.cancel()
	container.mutex.Lock()
	reader := container.inputReader
	container.mutex.Unlock()
	_ = reader.Close()
	for _, connection := range attached {
		_ = connection.Close()
	}
	close(container.exited)
}

// containerOutput writes what a container's program prints: kept for its logs and sent to whatever is attached.
type containerOutput struct{ container *Container }

func (output containerOutput) Write(printed []byte) (int, error) {
	container := output.container
	container.mutex.Lock()
	defer container.mutex.Unlock()
	container.printed.Write(printed)
	sent := container.framed(printed)
	for _, connection := range container.attached {
		_, _ = connection.Write(sent)
	}
	for _, follower := range container.followers {
		// A follower that fell this far behind loses the print, as the mock never blocks its program on a reader.
		select {
		case follower <- sent:
		default:
		}
	}

	return len(printed), nil
}

// framed is the bytes as a daemon sends them: raw from a terminal, and otherwise each write behind a header naming
// its stream and its length.
func (container *Container) framed(printed []byte) []byte {
	if container.Config.Tty {
		return printed
	}
	header := make([]byte, 8)
	header[0] = frameOutput
	binary.BigEndian.PutUint32(header[4:], uint32(len(printed)))

	return append(header, printed...)
}

// attach hands the connection over to the container: what the program prints from now on goes out on it, and what
// comes in on it is typed into the program. It stays open until the program ends or the client leaves.
func (container *Container) attach(writer http.ResponseWriter, request *http.Request) {
	hijacker, able := writer.(http.Hijacker)
	if !able {
		refuse(writer, http.StatusInternalServerError, "the mock daemon cannot hand this connection over")

		return
	}
	connection, buffered, err := hijacker.Hijack()
	if err != nil {
		return
	}

	media := "application/vnd.docker.multiplexed-stream"
	if container.Config.Tty {
		media = "application/vnd.docker.raw-stream"
	}
	// The connection is attached before the client receives so, so what the program prints right after reaches it.
	container.mutex.Lock()
	_, _ = buffered.WriteString("HTTP/1.1 101 UPGRADED\r\nContent-Type: " + media +
		"\r\nConnection: Upgrade\r\nUpgrade: tcp\r\n\r\n")
	_ = buffered.Flush()
	hasEnded := container.started && !container.running
	if !hasEnded {
		container.attached = append(container.attached, connection)
	}
	container.mutex.Unlock()
	if hasEnded {
		_ = connection.Close()

		return
	}

	if request.URL.Query().Get("stdin") == "1" || request.URL.Query().Get("stdin") == "true" {
		go container.typeFrom(buffered, connection)
	}
}

// typeFrom types what comes in on the connection into the program. A container without a terminal sees the end of
// its input when the client ends its side, and goes on printing to that client until it ends; a terminal stays open
// for the next one to attach, and the client that left gets nothing more.
func (container *Container) typeFrom(incoming io.Reader, connection net.Conn) {
	buffer := make([]byte, 32*1024)
	for {
		count, err := incoming.Read(buffer)
		if count > 0 {
			container.mutex.Lock()
			container.typed.Write(buffer[:count])
			container.mutex.Unlock()
			_, _ = container.currentInput().Write(buffer[:count])
		}
		if err != nil {
			break
		}
	}
	if !container.Config.Tty {
		_ = container.currentInput().Close()

		return
	}
	container.detach(connection)
}

func (container *Container) detach(connection net.Conn) {
	container.mutex.Lock()
	defer container.mutex.Unlock()
	for index, attached := range container.attached {
		if attached == connection {
			container.attached = append(container.attached[:index], container.attached[index+1:]...)

			return
		}
	}
}

// waitForExit waits until the container's program is not running and answers its exit code; one never started is
// not running already.
func (container *Container) waitForExit(ctx context.Context) int {
	container.mutex.Lock()
	exited := container.exited
	container.mutex.Unlock()
	if exited != nil {
		select {
		case <-exited:
		case <-ctx.Done():
		}
	}
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.exitCode
}

func (container *Container) stop(writer http.ResponseWriter) {
	if !container.IsRunning() {
		writer.WriteHeader(http.StatusNotModified)

		return
	}
	container.end(stoppedCode)
	writer.WriteHeader(http.StatusNoContent)
}

// interruptedCode and killedCode are the exit codes of a program an interrupt and a kill ended.
const (
	interruptedCode = 130
	killedCode      = 137
)

// kill sends the program a signal, which ends it: an interrupt as Ctrl+C does, any other by force.
func (container *Container) kill(signal string) {
	container.mutex.Lock()
	container.signals = append(container.signals, signal)
	container.mutex.Unlock()
	if signal == "SIGINT" {
		container.end(interruptedCode)

		return
	}
	container.end(killedCode)
}

func (container *Container) resize(query url.Values) {
	rows, _ := strconv.Atoi(query.Get("h"))
	columns, _ := strconv.Atoi(query.Get("w"))
	container.mutex.Lock()
	container.rows, container.columns = uint(rows), uint(columns)
	container.mutex.Unlock()
	select {
	case container.resized <- struct{}{}:
	default:
	}
}

// writeLogs writes what the program printed, only its last lines when the client asks for a tail.
func (container *Container) writeLogs(writer http.ResponseWriter, request *http.Request) {
	query := request.URL.Query()
	if query.Get("follow") == "1" || query.Get("follow") == "true" {
		container.followLogs(writer, request)
		return
	}
	printed := container.Printed()
	if count, err := strconv.Atoi(query.Get("tail")); err == nil {
		lines := strings.SplitAfter(printed, "\n")
		if len(lines) > 0 && lines[len(lines)-1] == "" {
			lines = lines[:len(lines)-1]
		}
		printed = strings.Join(lines[max(len(lines)-count, 0):], "")
	}
	writer.WriteHeader(http.StatusOK)
	_, _ = writer.Write(container.framed([]byte(printed)))
}

// followLogs sends everything printed so far, then each new print as it comes, until the program ends or the client
// leaves, as a daemon's followed log does.
func (container *Container) followLogs(writer http.ResponseWriter, request *http.Request) {
	follower := make(chan []byte, 1024)
	container.mutex.Lock()
	sofar := container.framed(container.printed.Bytes())
	hasEnded := container.started && !container.running
	if !hasEnded {
		container.followers = append(container.followers, follower)
	}
	exited := container.exited
	container.mutex.Unlock()
	flusher, _ := writer.(http.Flusher)
	writer.WriteHeader(http.StatusOK)
	_, _ = writer.Write(sofar)
	if flusher != nil {
		flusher.Flush()
	}
	if hasEnded {
		return
	}
	defer container.unfollow(follower)
	for {
		select {
		case sent := <-follower:
			_, _ = writer.Write(sent)
			if flusher != nil {
				flusher.Flush()
			}
		case <-exited:
			return
		case <-request.Context().Done():
			return
		}
	}
}

func (container *Container) unfollow(follower chan []byte) {
	container.mutex.Lock()
	defer container.mutex.Unlock()
	container.followers = slices.DeleteFunc(container.followers, func(each chan []byte) bool { return each == follower })
}

// status is the container's state as a daemon names it.
func (container *Container) status() string {
	container.mutex.Lock()
	defer container.mutex.Unlock()
	switch {
	case container.running:
		return "running"
	case container.started:
		return "exited"
	default:
		return "created"
	}
}

// inspection is the container as a daemon describes it when asked.
func (container *Container) inspection() map[string]any {
	status := container.status()
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return map[string]any{
		"Id":   container.ID,
		"Name": "/" + container.Name,
		"State": map[string]any{
			"Status": status, "Running": container.running, "OOMKilled": container.outOfMemory,
			"ExitCode": container.exitCode,
		},
		"Config":     container.Config,
		"HostConfig": container.HostConfig,
	}
}

// hasLabels is whether the container carries every label term: a name with its value, or a name alone.
func (container *Container) hasLabels(terms []string) bool {
	for _, term := range terms {
		name, value, hasValue := strings.Cut(term, "=")
		held, labelled := container.Config.Labels[name]
		if !labelled || (hasValue && held != value) {
			return false
		}
	}

	return true
}

// currentInput is where what is typed goes: the input of the container's latest start.
func (container *Container) currentInput() *io.PipeWriter {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.input
}
