package main

import (
	"encoding/json"
	"io"
	"path/filepath"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

// PanicCommand is the journal command that writes the panic file without the server.
const PanicCommand = "panic"

// PanicLineNote is what the hook tells the agent when it lets its journal panic line through without the journal.
const PanicLineNote = "[journal] journal panic goes through without the journal: it writes the panic file itself"

// lineJoiners are the shell signs that would let more than journal panic run on the same line.
var lineJoiners = []string{";", "&", "|", "`", "$(", ">", "<", "\n"}

// IsMainRole says whether a hook belongs to the main agent: the role it names, or none for a session the journal
// started before roles were named.
func IsMainRole(role string) bool {
	return role == "" || role == "main"
}

// IsPanicLine says whether a hook body is a shell tool call of journal panic and nothing else: that one line goes
// through before the server is asked, so the main agent can always get out of a journal that refuses everything.
func IsPanicLine(body []byte) bool {
	var read struct {
		ToolInput struct {
			Command string `json:"command"`
		} `json:"tool_input"`
	}
	if json.Unmarshal(body, &read) != nil {
		return false
	}
	line := strings.TrimSpace(read.ToolInput.Command)
	for _, joiner := range lineJoiners {
		if strings.Contains(line, joiner) {
			return false
		}
	}
	fields := strings.Fields(line)
	return len(fields) >= 2 && filepath.Base(fields[0]) == "journal" && fields[1] == PanicCommand
}

// panicLineAnswered lets the main agent's journal panic line through in the program's own shape, without the server.
func panicLineAnswered(stdout, stderr io.Writer, program programs.Program, body []byte) int {
	name := hookName(body)
	stdoutText, stderrText, code := ProgramAnswer(program, name, program.Events[name], Reply{Lines: []string{PanicLineNote}})
	io.WriteString(stdout, stdoutText)
	io.WriteString(stderr, stderrText)
	return code
}
