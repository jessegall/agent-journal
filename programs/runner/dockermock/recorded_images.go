package dockermock

import (
	"encoding/json"
	"net/http"
	"slices"
	"strings"
)

// recordedCheck is the real answer of a built driver image to one of the journal's start checks: the command it ran
// and what it printed, recorded in recordings/image_checks.json.
type recordedCheck struct {
	Command  []string `json:"command"`
	Printed  string   `json:"printed"`
	ExitCode int      `json:"exit_code"`
}

// buildImage answers a build as the real daemon answered the recorded one, and holds the image it built from then on.
func (daemon *Daemon) buildImage(writer http.ResponseWriter, request *http.Request) {
	recorded := "built.jsonl"
	if strings.Contains(request.URL.Query().Get("buildargs"), `"`+RecordedFailingVersion+`"`) {
		recorded = "failed.jsonl"
	}
	if recorded == "built.jsonl" {
		daemon.mutex.Lock()
		daemon.Images[RecordedBuildImage] = Image{ID: RecordedBuildImage}
		daemon.mutex.Unlock()
	}
	playRecorded(writer, recorded)
}

// RecordedImageCheck is the program of a container that runs one of the recorded start checks: it prints what the
// real image printed; any other container runs nil, its own program.
func RecordedImageCheck(container *Container) Program {
	content, err := recordedBuilds.ReadFile("recordings/image_checks.json")
	var checks []recordedCheck
	if err != nil || json.Unmarshal(content, &checks) != nil {
		return nil
	}
	ran := slices.Concat(container.Config.Entrypoint, container.Config.Cmd)
	for _, check := range checks {
		if slices.Equal(ran, check.Command) {
			return Printing(check.Printed, check.ExitCode)
		}
	}
	return nil
}
