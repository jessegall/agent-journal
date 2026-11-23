package main

import (
	"errors"

	"journal-agent/client"
	"journal-agent/host"
	"journal-agent/profiles"
)

// ErrDriverNotAdvertised refuses a grant for a driver key or build this host did not advertise it runs.
var ErrDriverNotAdvertised = errors.New("this host did not advertise that driver and build, so it starts nothing")

// advertises reports whether this host advertised the driver key at this build.
func advertises(advertised []client.HostDescriptor, key, build string) bool {
	for _, descriptor := range advertised {
		if descriptor.Key == key && descriptor.Build == build {
			return true
		}
	}

	return false
}

// descriptorsOf is every driver this host runs in its arrangement, each at its family's pinned build, on the
// protected host or in a required container. The Codex terminal is not advertised until it is proven, and Codex runs
// in no container until its provider transport exists.
func descriptorsOf(arrangement host.Arrangement) []client.HostDescriptor {
	placement := "protected_host"
	if arrangement.IsContained() {
		placement = "required_container"
	}
	descriptor := func(key, build string) client.HostDescriptor {
		return client.HostDescriptor{Key: key, Build: build,
			Arrangement: string(arrangement), Placement: placement}
	}
	descriptors := []client.HostDescriptor{
		descriptor("claude-code", profiles.ClaudeCode{}.Build()),
		descriptor("claude-code-headless", profiles.ClaudeCode{}.Build()),
	}
	if !arrangement.IsContained() {
		descriptors = append(descriptors, descriptor("codex-headless", profiles.Codex{}.Build()))
	}

	return descriptors
}

// isolatedDescriptors are the drivers a connected folder's relay can start with its hooks isolated to one session, a
// one-use start grant and a lease it stops the session at: Claude Code's. Codex stays out until it keeps its hooks to
// one thread.
func isolatedDescriptors() []client.HostDescriptor {
	return descriptorsOf(host.Local)[:2]
}
