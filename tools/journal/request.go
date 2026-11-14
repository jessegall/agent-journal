package main

import (
	"encoding/json"
	"io"
	"os"
)

// CallerVariables are the environment variables the server reads to name the caller: the runner's session, the session
// each agent program sets in its own shells (a provider's session_variable), and the login name; and the variable that
// names the current process, and the runner marker used to route alias output.
var CallerVariables = []string{"JOURNAL_AGENT_SESSION", "CLAUDE_CODE_SESSION_ID", "CODEX_THREAD_ID", "USER", "JOURNAL_PROCESS", "JOURNAL_RUNNER_PROCESS", "JOURNAL_PLUGIN", "JOURNAL_PLUGIN_TOKEN"}

// CliRequest is the body of POST /cli: the command line's words, the variables that name the caller, the
// working folder, and how long the caller waits when it says so. The server reads the caller's pid from the
// socket, so the request carries none.
type CliRequest struct {
	Argv            []string          `json:"argv"`
	Variables       map[string]string `json:"variables"`
	Folder          string            `json:"folder"`
	DeadlineSeconds *float64          `json:"deadline_seconds,omitempty"`
	Terminal        bool              `json:"terminal,omitempty"`
}

// NewCliRequest builds the request for a command line from this process's own variables and folder.
func NewCliRequest(argv []string, lookup func(string) (string, bool), folder string) CliRequest {
	variables := map[string]string{}
	for _, name := range CallerVariables {
		if value, exists := lookup(name); exists {
			variables[name] = value
		}
	}
	if argv == nil {
		argv = []string{}
	}
	return CliRequest{Argv: argv, Variables: variables, Folder: folder}
}

// WritingTo marks the request as one whose answer a terminal shows, when stdout is a character device, so the
// server may keep a run's colour codes.
func (request CliRequest) WritingTo(stdout io.Writer) CliRequest {
	file, isFile := stdout.(*os.File)
	if !isFile {
		return request
	}
	status, err := file.Stat()
	request.Terminal = err == nil && status.Mode()&os.ModeCharDevice != 0
	return request
}

// Body is the request's JSON.
func (request CliRequest) Body() ([]byte, error) {
	return json.Marshal(request)
}

// WorkingFolder is this process's folder, or an empty text when it cannot be read.
func WorkingFolder() string {
	folder, err := os.Getwd()
	if err != nil {
		return ""
	}
	return folder
}
