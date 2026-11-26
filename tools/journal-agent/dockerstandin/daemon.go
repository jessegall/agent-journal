// Package dockerstandin is a stand-in for a Docker daemon: a server that speaks the part of the Docker Engine API the
// host uses, keeps its containers, volumes, networks and images in memory, and remembers every request. The host's
// own Docker client talks to it in the tests, so nothing but the daemon itself is replaced.
package dockerstandin

import (
	"bytes"
	"context"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"slices"
	"strings"
	"sync"
	"testing"

	types "github.com/moby/moby/api/types/container"
)

// advertisedVersion is the API version the stand-in says it speaks, which the client settles on.
const advertisedVersion = "1.57"

// Program is what a container of the stand-in runs when it starts: it reads what is typed into it, writes what it
// prints and answers its exit code. It ends early when the context ends, which is the container being stopped.
type Program func(ctx context.Context, container *Container, input io.Reader, output io.Writer) int

// Image is an image the stand-in holds: its id and the repository digests it is known by.
type Image struct {
	ID      string
	Digests []string
}

// Daemon is one stand-in daemon. Its fields are set before the host talks to it; what happened is read back through
// its methods.
type Daemon struct {
	// CgroupDriver is what the daemon reports as its cgroup driver; "none" is a daemon that holds no budgets.
	CgroupDriver string
	// Images are the images the daemon holds, by each reference they are asked for.
	Images map[string]Image
	// Programs gives the program of a container about to start; nil, or an answer of nil, runs the default: a
	// container with a terminal runs until it is stopped, any other ends at once with exit code 0.
	Programs func(container *Container) Program

	server     *httptest.Server
	mutex      sync.Mutex
	requests   []string
	refusals   []refusal
	containers map[string]*Container
	history    []*Container
	volumes    map[string]Volume
	networks   map[string]Network
	created    int
}

// Volume is a named volume of the stand-in.
type Volume struct {
	Name    string
	Labels  map[string]string
	Options map[string]string
}

// Network is a network of the stand-in.
type Network struct {
	Name   string
	Labels map[string]string
}

// refusal makes the next requests that match fail: the method, a part of the path, the status and the daemon's words.
type refusal struct {
	method  string
	path    string
	status  int
	message string
	times   int
}

// Start starts a stand-in daemon that lives as long as the test, holding the agent image under the reference given.
func Start(t testing.TB, images ...string) *Daemon {
	t.Helper()
	daemon := newDaemon(images)
	daemon.server = httptest.NewServer(http.HandlerFunc(daemon.serve))
	t.Cleanup(daemon.stop)

	return daemon
}

// Serve starts a stand-in daemon on the listener, such as a Unix socket a host binary is pointed at, outside a Go
// test; Stop ends it.
func Serve(listener net.Listener, images ...string) *Daemon {
	daemon := newDaemon(images)
	daemon.server = httptest.NewUnstartedServer(http.HandlerFunc(daemon.serve))
	_ = daemon.server.Listener.Close()
	daemon.server.Listener = listener
	daemon.server.Start()

	return daemon
}

// Stop ends every container and the daemon.
func (daemon *Daemon) Stop() {
	daemon.stop()
}

func newDaemon(images []string) *Daemon {
	daemon := &Daemon{
		CgroupDriver: "cgroupfs",
		Images:       map[string]Image{},
		containers:   map[string]*Container{},
		volumes:      map[string]Volume{},
		networks:     map[string]Network{},
	}
	for _, reference := range images {
		daemon.Images[reference] = Image{ID: reference}
	}

	return daemon
}

// Host is where the daemon listens, as a Docker client takes it.
func (daemon *Daemon) Host() string {
	address := daemon.server.Listener.Addr()
	if address.Network() == "unix" {
		return "unix://" + address.String()
	}
	return "tcp://" + address.String()
}

// Refuse makes the next matching requests fail with the status and the daemon's words: the method, and a part of the
// path such as "/containers/create". It holds for the number of requests given.
func (daemon *Daemon) Refuse(method, path string, status int, message string, times int) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	daemon.refusals = append(daemon.refusals, refusal{method: method, path: path, status: status, message: message, times: times})
}

// Requests are the requests the daemon got so far, each as its method and its path without the version, such as
// "POST /containers/journal-session-7/start".
func (daemon *Daemon) Requests() []string {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()

	return append([]string{}, daemon.requests...)
}

// WasAsked is whether the daemon got a request with the method whose path holds the part given.
func (daemon *Daemon) WasAsked(method, part string) bool {
	for _, request := range daemon.Requests() {
		if strings.HasPrefix(request, method+" ") && strings.Contains(request, part) {
			return true
		}
	}

	return false
}

// Capabilities are the capabilities as a daemon is sent them by Docker's client: each under its full name, in the
// order of their names.
func Capabilities(names ...string) []string {
	sent := make([]string, 0, len(names))
	for _, name := range names {
		sent = append(sent, "CAP_"+strings.TrimPrefix(name, "CAP_"))
	}
	slices.Sort(sent)

	return sent
}

// Container is the container with the name or id, and whether the daemon holds it.
func (daemon *Daemon) Container(name string) (*Container, bool) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()

	return daemon.find(name)
}

// Containers are the containers the daemon holds, in the order they were created.
func (daemon *Daemon) Containers() []*Container {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	var held []*Container
	for _, container := range daemon.history {
		if _, found := daemon.containers[container.ID]; found {
			held = append(held, container)
		}
	}

	return held
}

// Created are all the containers ever created on the daemon, removed ones too, in order.
func (daemon *Daemon) Created() []*Container {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()

	return append([]*Container{}, daemon.history...)
}

// Volume is the named volume, and whether the daemon holds it.
func (daemon *Daemon) Volume(name string) (Volume, bool) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	volume, found := daemon.volumes[name]

	return volume, found
}

// AddVolume gives the daemon a volume it holds before the host asks.
func (daemon *Daemon) AddVolume(name string, labels map[string]string) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	daemon.volumes[name] = Volume{Name: name, Labels: labels}
}

// Network is the network, and whether the daemon holds it.
func (daemon *Daemon) Network(name string) (Network, bool) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	network, found := daemon.networks[name]

	return network, found
}

// AddContainer gives the daemon a container it holds before the host asks, such as one a host before it left behind;
// running starts its program.
func (daemon *Daemon) AddContainer(name string, labels map[string]string, running bool) *Container {
	daemon.mutex.Lock()
	container := daemon.keep(name, createBody{Config: types.Config{Labels: labels, Tty: running, OpenStdin: running}})
	daemon.mutex.Unlock()
	if running {
		daemon.run(container)
	}

	return container
}

func (daemon *Daemon) stop() {
	for _, container := range daemon.Created() {
		container.end(killedCode)
	}
	daemon.server.CloseClientConnections()
	daemon.server.Close()
}

// find is the container by its id or its name; the caller holds the lock.
func (daemon *Daemon) find(name string) (*Container, bool) {
	if container, found := daemon.containers[name]; found {
		return container, true
	}
	for _, container := range daemon.containers {
		if container.Name == name {
			return container, true
		}
	}

	return nil, false
}

// Container is one container of the stand-in: what it was created with, whether it runs and what it printed.
type Container struct {
	ID   string
	Name string
	// Config and HostConfig are what the container was created with, as the client sent them.
	Config     types.Config
	HostConfig types.HostConfig

	mutex       sync.Mutex
	running     bool
	started     bool
	exitCode    int
	outOfMemory bool
	cancel      context.CancelFunc
	exited      chan struct{}
	printed     bytes.Buffer
	typed       bytes.Buffer
	attached    []net.Conn
	input       *io.PipeWriter
	inputReader *io.PipeReader
	rows        uint
	columns     uint
	signals     []string
	// resized tells the program its terminal was given a size, as SIGWINCH tells a real one.
	resized chan struct{}
}

// Resized tells the program each time its terminal was given a size, so it can draw its screen again.
func (container *Container) Resized() <-chan struct{} {
	return container.resized
}

// Signals are the signals the container's program was sent, in order.
func (container *Container) Signals() []string {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return append([]string{}, container.signals...)
}

// IsRunning is whether the container's program runs now.
func (container *Container) IsRunning() bool {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.running
}

// WasStarted is whether the container was ever started.
func (container *Container) WasStarted() bool {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.started
}

// Printed is everything the container's program printed so far.
func (container *Container) Printed() string {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.printed.String()
}

// Typed is everything that was typed into the container so far.
func (container *Container) Typed() string {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.typed.String()
}

// Size is the size the container's terminal was last given, rows first.
func (container *Container) Size() (uint, uint) {
	container.mutex.Lock()
	defer container.mutex.Unlock()

	return container.rows, container.columns
}

// KillForMemory ends the container's program as the kernel does when it uses more memory than its budget.
func (container *Container) KillForMemory() {
	container.mutex.Lock()
	container.outOfMemory = true
	container.mutex.Unlock()
	container.end(killedCode)
}

// Exit ends the container's program with the exit code, as a program that ends by itself.
func (container *Container) Exit(code int) {
	container.end(code)
}
