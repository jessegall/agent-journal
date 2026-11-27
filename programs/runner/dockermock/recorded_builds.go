package dockermock

import (
	"embed"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"testing"
)

// RecordedBuildImage is the id the real daemon gave the driver image of recordings/image_build/built.jsonl.
const RecordedBuildImage = "sha256:a0d1c76feba0672e42e486ff93b3f8b72e05bdfdd72bbf9bb07ad8a00c2a2e4f"

// RecordedFailingVersion is the driver version of the recorded build that failed, for want of a pinned digest.
const RecordedFailingVersion = "0.164.0"

//go:embed recordings/image_build
var recordedBuilds embed.FS

// BuildDaemon plays a real Docker daemon's answers to a BuildKit build of a driver's image folder on the candidate base,
// recorded with only fake values in them: the stream of a build that passed, or of one at RecordedFailingVersion, and
// the built image's history. It keeps each build it is asked as Docker received it.
type BuildDaemon struct {
	server  *httptest.Server
	lock    sync.Mutex
	asked   []url.Values
	context [][]byte
}

// StartBuilds starts a daemon that plays the recorded builds until the test ends.
func StartBuilds(t *testing.T) *BuildDaemon {
	t.Helper()
	daemon := &BuildDaemon{}
	daemon.server = httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		daemon.answer(t, writer, request)
	}))
	t.Cleanup(daemon.server.Close)
	return daemon
}

// Host is the daemon's address as Docker's client takes it.
func (daemon *BuildDaemon) Host() string {
	return "tcp://" + strings.TrimPrefix(daemon.server.URL, "http://")
}

// Asked are the query and the context of each build asked, in order.
func (daemon *BuildDaemon) Asked() ([]url.Values, [][]byte) {
	daemon.lock.Lock()
	defer daemon.lock.Unlock()
	return daemon.asked, daemon.context
}

func (daemon *BuildDaemon) answer(t *testing.T, writer http.ResponseWriter, request *http.Request) {
	switch {
	case strings.HasSuffix(request.URL.Path, "/_ping"):
		writer.Header().Set("Api-Version", advertisedVersion)
	case strings.HasSuffix(request.URL.Path, "/build"):
		daemon.keep(request)
		recorded := "built.jsonl"
		if strings.Contains(request.URL.Query().Get("buildargs"), `"`+RecordedFailingVersion+`"`) {
			recorded = "failed.jsonl"
		}
		play(t, writer, recorded)
	case strings.HasSuffix(request.URL.Path, "/images/"+RecordedBuildImage+"/history"):
		play(t, writer, "history.json")
	default:
		t.Errorf("the build asked the daemon %s %s", request.Method, request.URL.Path)
		writer.WriteHeader(http.StatusNotFound)
	}
}

func (daemon *BuildDaemon) keep(request *http.Request) {
	body, _ := io.ReadAll(request.Body)
	daemon.lock.Lock()
	defer daemon.lock.Unlock()
	daemon.asked = append(daemon.asked, request.URL.Query())
	daemon.context = append(daemon.context, body)
}

func play(t *testing.T, writer http.ResponseWriter, recorded string) {
	content, err := recordedBuilds.ReadFile("recordings/image_build/" + recorded)
	if err != nil {
		t.Fatal(err)
	}
	_, _ = writer.Write(content)
}
