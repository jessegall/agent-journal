package main

import (
	"errors"

	"journal-agent/client"
	"journal-agent/drivers"
	"journal-agent/host"
	"journal-agent/profiles"
)

// ErrCombinationNotDeclared refuses a grant for a driver, build or variant this host did not declare it can run.
var ErrCombinationNotDeclared = errors.New("this host did not declare that driver, build and variant, so it starts nothing")

// declares reports whether a declared combination runs this driver build in this variant.
func declares(declared []client.HostCombination, driver, build, variant string) bool {
	for _, combination := range declared {
		if combination.Driver == driver && combination.Build == build && combination.Variant == variant {
			return true
		}
	}
	return false
}

// combinationsOf is every way this host can run an agent in its arrangement: each pinned driver build, placed on the
// protected host or in a required container, in each variant the driver has. Codex has no terminal variant, and no
// container placement until its provider transport exists.
func combinationsOf(arrangement host.Arrangement) []client.HostCombination {
	placement := "protected_host"
	if arrangement.IsContained() {
		placement = "required_container"
	}
	combination := func(driver, build, variant string) client.HostCombination {
		return client.HostCombination{Driver: driver, Build: build, Arrangement: string(arrangement),
			Placement: placement, Variant: variant}
	}
	combinations := []client.HostCombination{
		combination("claude-code", profiles.ClaudeCode{}.Build(), drivers.TerminalVariant),
		combination("claude-code", profiles.ClaudeCode{}.Build(), drivers.HeadlessVariant),
	}
	if !arrangement.IsContained() {
		combinations = append(combinations, combination("codex", profiles.Codex{}.Build(), drivers.HeadlessVariant))
	}
	return combinations
}
