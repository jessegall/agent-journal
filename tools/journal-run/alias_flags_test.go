package main

import (
	"slices"
	"testing"
)

func TestARunKeepsTheAliasesItWasToldOf(t *testing.T) {
	options := Flags{Aliases: []string{"sins"}}.runOptions("/home", "sh")
	if !slices.Equal(options.Aliases, []string{"sins"}) {
		t.Fatalf("aliases %v", options.Aliases)
	}
}
