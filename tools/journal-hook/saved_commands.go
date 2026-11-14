package main

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/jessegall/agent-journal/tools/journal-hook/classify"
)

type savedCommandCheck struct {
	Candidate string            `json:"candidate"`
	Saved     map[string]string `json:"saved"`
}

func savedCommandConflict(input io.Reader, output io.Writer, table string) error {
	var check savedCommandCheck
	if err := json.NewDecoder(input).Decode(&check); err != nil {
		return err
	}
	_, err := fmt.Fprint(output, classify.ClassifierOf(table).SavedCommandConflict(check.Candidate, check.Saved))
	return err
}
