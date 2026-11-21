package main

import (
	"journal-agent/client"
	"journal-agent/drivers"
	"journal-agent/host"
	"journal-agent/profiles"
)

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
