package main

import (
	"io"
	"slices"
)

const (
	bodyFlag      = "--body"
	inputArgument = "-"
)

// BodyFromInput puts standard input in place of the - in `--body -`, so a heredoc can hold a long text.
func BodyFromInput(argv []string, input io.Reader) ([]string, error) {
	index := slices.Index(argv, bodyFlag)
	if index < 0 || index+1 >= len(argv) || argv[index+1] != inputArgument {
		return argv, nil
	}
	text, err := io.ReadAll(input)
	if err != nil {
		return nil, err
	}
	filled := slices.Clone(argv)
	filled[index+1] = string(text)
	return filled, nil
}
