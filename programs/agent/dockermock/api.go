package dockermock

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"

	"github.com/moby/moby/api/types/container"
)

// versionPrefix is the API version a client puts in front of every path but the ping's.
var versionPrefix = regexp.MustCompile(`^/v[0-9]+\.[0-9]+`)

// createBody is what a client sends to create a container: its config, with the host's part beside it.
type createBody struct {
	container.Config
	HostConfig container.HostConfig
}

// serve answers one request of the Engine API, after remembering it and after any refusal a test asked for.
func (daemon *Daemon) serve(writer http.ResponseWriter, request *http.Request) {
	path := versionPrefix.ReplaceAllString(request.URL.Path, "")
	query, _ := url.QueryUnescape(request.URL.RawQuery)
	asked := request.Method + " " + path
	if query != "" {
		asked += "?" + query
	}
	if path != "/_ping" {
		daemon.remember(asked)
	}
	if status, message, refused := daemon.refusalOf(request.Method, path); refused {
		refuse(writer, status, message)

		return
	}

	parts := strings.Split(strings.Trim(path, "/"), "/")
	switch {
	case path == "/_ping":
		daemon.ping(writer)
	case path == "/info":
		answer(writer, http.StatusOK, map[string]any{"CgroupDriver": daemon.CgroupDriver})
	case parts[0] == "images" && strings.HasSuffix(path, "/json"):
		daemon.inspectImage(writer, strings.TrimSuffix(strings.TrimPrefix(path, "/images/"), "/json"))
	case path == "/containers/create":
		daemon.create(writer, request)
	case path == "/containers/json":
		daemon.list(writer, request)
	case parts[0] == "containers" && len(parts) >= 2:
		daemon.serveContainer(writer, request, parts[1], strings.Join(parts[2:], "/"))
	case parts[0] == "networks":
		daemon.serveNetwork(writer, request, parts)
	case parts[0] == "volumes":
		daemon.serveVolume(writer, request, parts)
	default:
		refuse(writer, http.StatusNotFound, "the mock daemon does not answer "+asked)
	}
}

func (daemon *Daemon) remember(asked string) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	daemon.requests = append(daemon.requests, asked)
}

// refusalOf takes the first refusal a test asked for that matches the request, one use of it.
func (daemon *Daemon) refusalOf(method, path string) (int, string, bool) {
	daemon.mutex.Lock()
	defer daemon.mutex.Unlock()
	for index := range daemon.refusals {
		wanted := &daemon.refusals[index]
		if wanted.times > 0 && wanted.method == method && strings.Contains(path, wanted.path) {
			wanted.times--

			return wanted.status, wanted.message, true
		}
	}

	return 0, "", false
}

func (daemon *Daemon) ping(writer http.ResponseWriter) {
	writer.Header().Set("API-Version", advertisedVersion)
	writer.Header().Set("OSType", "linux")
	writer.Header().Set("Docker-Experimental", "false")
	writer.WriteHeader(http.StatusOK)
	_, _ = writer.Write([]byte("OK"))
}

func (daemon *Daemon) inspectImage(writer http.ResponseWriter, reference string) {
	image, held := daemon.Images[reference]
	if !held {
		refuse(writer, http.StatusNotFound, "No such image: "+reference)

		return
	}

	answer(writer, http.StatusOK, map[string]any{"Id": image.ID, "RepoDigests": image.Digests})
}

func (daemon *Daemon) create(writer http.ResponseWriter, request *http.Request) {
	var body createBody
	if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
		refuse(writer, http.StatusBadRequest, "the create request is not what a daemon reads: "+err.Error())

		return
	}
	if _, held := daemon.Images[body.Image]; !held {
		refuse(writer, http.StatusNotFound, "No such image: "+body.Image)

		return
	}
	name := request.URL.Query().Get("name")
	daemon.mutex.Lock()
	_, taken := daemon.find(name)
	if taken && name != "" {
		daemon.mutex.Unlock()
		refuse(writer, http.StatusConflict, `Conflict. The container name "/`+name+`" is already in use`)

		return
	}
	created := daemon.keep(name, body)
	daemon.mutex.Unlock()

	answer(writer, http.StatusCreated, map[string]any{"Id": created.ID, "Warnings": []string{}})
}

// keep adds a created container to what the daemon holds; the caller holds the lock.
func (daemon *Daemon) keep(name string, body createBody) *Container {
	daemon.created++
	created := newContainer("c"+strconv.Itoa(daemon.created), name, body)
	daemon.containers[created.ID] = created
	daemon.history = append(daemon.history, created)

	return created
}

func (daemon *Daemon) list(writer http.ResponseWriter, request *http.Request) {
	labels := labelFilters(request.URL.Query().Get("filters"))
	all := request.URL.Query().Get("all") == "1" || request.URL.Query().Get("all") == "true"
	summaries := []map[string]any{}
	for _, held := range daemon.Containers() {
		if (all || held.IsRunning()) && held.hasLabels(labels) {
			summaries = append(summaries, map[string]any{
				"Id": held.ID, "Names": []string{"/" + held.Name}, "Image": held.Config.Image,
				"Labels": held.Config.Labels, "State": held.status(),
			})
		}
	}

	answer(writer, http.StatusOK, summaries)
}

// labelFilters are the label terms of a list request's filters, which a client sends as a set or as a list.
func labelFilters(encoded string) []string {
	var filters map[string]json.RawMessage
	if json.Unmarshal([]byte(encoded), &filters) != nil {
		return nil
	}
	var asList []string
	if json.Unmarshal(filters["label"], &asList) == nil {
		return asList
	}
	var asSet map[string]bool
	_ = json.Unmarshal(filters["label"], &asSet)
	for term := range asSet {
		asList = append(asList, term)
	}

	return asList
}

func (daemon *Daemon) serveContainer(writer http.ResponseWriter, request *http.Request, name, action string) {
	daemon.mutex.Lock()
	held, found := daemon.find(name)
	daemon.mutex.Unlock()
	if !found {
		refuse(writer, http.StatusNotFound, "No such container: "+name)

		return
	}

	switch {
	case action == "json":
		answer(writer, http.StatusOK, held.inspection())
	case action == "start":
		daemon.start(writer, held)
	case action == "attach":
		held.attach(writer, request)
	case action == "wait":
		answer(writer, http.StatusOK, map[string]any{"StatusCode": held.waitForExit(request.Context())})
	case action == "stop":
		held.stop(writer)
	case action == "kill":
		held.kill(request.URL.Query().Get("signal"))
		writer.WriteHeader(http.StatusNoContent)
	case action == "resize":
		held.resize(request.URL.Query())
		writer.WriteHeader(http.StatusOK)
	case action == "logs":
		held.writeLogs(writer, request)
	case action == "" && request.Method == http.MethodDelete:
		daemon.remove(writer, held, request.URL.Query().Get("force"))
	default:
		refuse(writer, http.StatusNotFound, "the mock daemon does not "+action+" a container")
	}
}

func (daemon *Daemon) start(writer http.ResponseWriter, held *Container) {
	if daemon.isStopping() {
		refuse(writer, http.StatusServiceUnavailable, "the mock daemon is stopping")

		return
	}
	if held.IsRunning() {
		writer.WriteHeader(http.StatusNotModified)

		return
	}
	daemon.run(held)
	writer.WriteHeader(http.StatusNoContent)
}

func (daemon *Daemon) remove(writer http.ResponseWriter, held *Container, force string) {
	if held.IsRunning() && force != "1" && force != "true" {
		refuse(writer, http.StatusConflict, fmt.Sprintf(
			"cannot remove container %q: container is running: stop the container before removing or force remove",
			"/"+held.Name,
		))

		return
	}
	held.end(killedCode)
	daemon.mutex.Lock()
	delete(daemon.containers, held.ID)
	daemon.mutex.Unlock()
	writer.WriteHeader(http.StatusNoContent)
}

func (daemon *Daemon) serveNetwork(writer http.ResponseWriter, request *http.Request, parts []string) {
	if len(parts) == 2 && parts[1] == "create" {
		var body struct {
			Name   string
			Labels map[string]string
		}
		_ = json.NewDecoder(request.Body).Decode(&body)
		daemon.mutex.Lock()
		daemon.networks[body.Name] = Network{Name: body.Name, Labels: body.Labels}
		daemon.mutex.Unlock()
		answer(writer, http.StatusCreated, map[string]any{"Id": body.Name, "Warning": ""})

		return
	}

	name := parts[len(parts)-1]
	daemon.mutex.Lock()
	held, found := daemon.networks[name]
	if found && request.Method == http.MethodDelete {
		delete(daemon.networks, name)
	}
	daemon.mutex.Unlock()
	switch {
	case !found:
		refuse(writer, http.StatusNotFound, "network "+name+" not found")
	case request.Method == http.MethodDelete:
		writer.WriteHeader(http.StatusNoContent)
	default:
		answer(writer, http.StatusOK, map[string]any{"Name": held.Name, "Id": held.Name, "Labels": held.Labels})
	}
}

func (daemon *Daemon) serveVolume(writer http.ResponseWriter, request *http.Request, parts []string) {
	if len(parts) == 2 && parts[1] == "create" {
		var body struct {
			Name       string
			Labels     map[string]string
			DriverOpts map[string]string
		}
		_ = json.NewDecoder(request.Body).Decode(&body)
		created := Volume{Name: body.Name, Labels: body.Labels, Options: body.DriverOpts}
		daemon.mutex.Lock()
		daemon.volumes[body.Name] = created
		daemon.mutex.Unlock()
		answer(writer, http.StatusCreated, created.described())

		return
	}

	name := parts[len(parts)-1]
	daemon.mutex.Lock()
	held, found := daemon.volumes[name]
	if found && request.Method == http.MethodDelete {
		delete(daemon.volumes, name)
	}
	daemon.mutex.Unlock()
	switch {
	case !found:
		refuse(writer, http.StatusNotFound, "get "+name+": no such volume")
	case request.Method == http.MethodDelete:
		writer.WriteHeader(http.StatusNoContent)
	default:
		answer(writer, http.StatusOK, held.described())
	}
}

// described is the volume as a daemon describes it.
func (volume Volume) described() map[string]any {
	return map[string]any{
		"Name": volume.Name, "Driver": "local", "Mountpoint": "/var/lib/docker/volumes/" + volume.Name + "/_data",
		"Labels": volume.Labels, "Options": volume.Options, "Scope": "local",
	}
}

// answer writes a JSON answer with its status.
func answer(writer http.ResponseWriter, status int, body any) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	_ = json.NewEncoder(writer).Encode(body)
}

// refuse writes a daemon's refusal: its status and its words.
func refuse(writer http.ResponseWriter, status int, message string) {
	answer(writer, status, map[string]string{"message": message})
}
