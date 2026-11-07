package main

import (
	"encoding/json"
	"os"
	"regexp"

	"github.com/jessegall/agent-journal/tools/journal-hook/programs"
)

type ManagedHook struct {
	ID      string         `json:"id"`
	Program string         `json:"program"`
	Event   string         `json:"event"`
	Matcher string         `json:"matcher"`
	Command string         `json:"command"`
	Timeout int            `json:"timeout"`
	Source  string         `json:"source"`
	Tracked bool           `json:"tracked"`
	Fields  map[string]any `json:"fields"`
	State   string         `json:"state"`
}

func LoadManaged(path string) []ManagedHook {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var stored struct {
		Version int           `json:"version"`
		Hooks   []ManagedHook `json:"hooks"`
	}
	if err := json.Unmarshal(data, &stored); err != nil || stored.Version != 1 {
		return nil
	}
	return stored.Hooks
}

func Matching(hooks []ManagedHook, program, event string, body []byte, table programs.Table) []ManagedHook {
	field := table.Programs[program].Matchers[event]
	var fields map[string]any
	validBody := json.Unmarshal(body, &fields) == nil
	value, validField := fields[field].(string)
	var matches []ManagedHook
	for _, hook := range hooks {
		if hook.State != "on" || hook.Program != program || hook.Event != event {
			continue
		}
		if field == "" || hook.Matcher == "" || hook.Matcher == "*" {
			matches = append(matches, hook)
			continue
		}
		if !validBody || !validField {
			continue
		}
		matched, err := regexp.MatchString(hook.Matcher, value)
		if err != nil || !matched {
			continue
		}
		matches = append(matches, hook)
	}
	return matches
}
