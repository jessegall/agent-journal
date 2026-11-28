package main

import (
	"fmt"
	"io"

	"journal-runner/terminal"
)

var recordingTools = map[string]func(string, io.Writer) error{
	"annotate": func(folder string, _ io.Writer) error { return terminal.Annotate(folder) },
	"screen": terminal.PrintScreen,
	"render": renderRecordings,
}

func renderRecordings(folder string, output io.Writer) error {
	rendered, err := terminal.RenderFolder(folder)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(output, "rendered %d recordings\n", len(rendered))
	return err
}
