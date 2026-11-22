package main

import (
	"errors"
	drivercontracts "journal-agent/drivers/contracts"
	"strings"
	"testing"

	"journal-agent/client"
	"journal-agent/drivers"
	"journal-agent/host"
	"journal-agent/profiles"
)

func TestALocalHostAdvertisesCodexOnlyHeadlessAndAContainedHostNoCodex(t *testing.T) {
	codex := profiles.Codex{}.Build()
	claude := profiles.ClaudeCode{}.Build()
	local := descriptorsOf(host.Local)
	contained := descriptorsOf(host.Contained)

	if !advertises(local, "codex-headless", codex) || advertises(local, "codex", codex) {
		t.Fatalf("a local host advertises %v; want codex headless only", local)
	}
	if advertises(contained, "codex-headless", codex) {
		t.Fatalf("a contained host advertises codex: %v", contained)
	}
	if !advertises(contained, "claude-code", claude) || !advertises(contained, "claude-code-headless", claude) {
		t.Fatalf("a contained host advertises %v; want both Claude Code drivers", contained)
	}
	for _, descriptor := range local {
		if descriptor.ProtocolVersion != DriverProtocolVersion {
			t.Fatalf("%s advertises protocol %d", descriptor.Key, descriptor.ProtocolVersion)
		}
	}
}

func TestAGrantForADriverTheHostDidNotAdvertiseStartsNothing(t *testing.T) {
	opener := runtimeOpener{stateFolder: t.TempDir(), declared: descriptorsOf(host.Contained)}
	prepared := host.PreparedStart{Grant: client.Grant{Runtime: client.RuntimeStart{
		Driver: "codex", DriverKey: "codex-headless", DriverBuild: profiles.Codex{}.Build(), Variant: drivers.HeadlessVariant,
	}}}

	_, err := opener.open("runtime-1", prepared)

	if !errors.Is(err, ErrDriverNotAdvertised) {
		t.Fatalf("a grant the host did not advertise gave %v, want ErrDriverNotAdvertised", err)
	}
	refused, found := drivercontracts.StartRefusalOf(err)
	if !found || refused.Reason != drivercontracts.RefusalPinnedBuildMissing {
		t.Fatalf("a grant for a build the host does not run refused %+v, want the missing pinned build named", refused)
	}
}

func TestARelayOffersOnlyTheDriversItRunsIsolatedWithALease(t *testing.T) {
	isolated := isolatedDescriptors()

	if len(isolated) == 0 {
		t.Fatal("a relay offers no driver at all")
	}
	for _, descriptor := range isolated {
		if (descriptor.Key != "claude-code" && descriptor.Key != "claude-code-headless") ||
			descriptor.Arrangement != string(host.Local) {
			t.Fatalf("a relay offers %+v, which it cannot run isolated with a lease", descriptor)
		}
	}
}

func TestEachDefaultDriverIsRegisteredByItsKeyAndTheCodexTerminalRefuses(t *testing.T) {
	for _, key := range []string{"claude-code", "claude-code-headless", "codex", "codex-headless"} {
		if _, found := driverRegistrations[key]; !found {
			t.Fatalf("the host has no registration for %q", key)
		}
	}
	codex := driverRegistrations["codex"]

	if _, err := codex.open(runtimeOpener{}, "runtime-1", host.PreparedStart{}, nil, nil, nil); !errors.Is(err, ErrCodexTerminalUnproven) {
		t.Fatalf("the codex terminal opened with %v, want ErrCodexTerminalUnproven", err)
	}
	if _, err := codex.openContained(runtimeOpener{}, "runtime-1", host.PreparedStart{}, nil, host.ContainerManifest{}); !errors.Is(err, ErrCodexTerminalUnproven) {
		t.Fatalf("the contained codex terminal opened with %v, want ErrCodexTerminalUnproven", err)
	}
	if !errors.Is(driverRegistrations["codex-headless"].confinementRefusal, ErrCodexChildUnconfined) {
		t.Fatal("codex headless does not refuse a confined child")
	}
}

func TestAGrantForAnAdvertisedKeyWithNoRegistrationStartsNothing(t *testing.T) {
	declared := append(descriptorsOf(host.Local), client.HostDescriptor{Key: "acme/reader", Build: profiles.ClaudeCode{}.Build()})
	opener := runtimeOpener{stateFolder: t.TempDir(), declared: declared}
	prepared := host.PreparedStart{Grant: client.Grant{Runtime: client.RuntimeStart{
		Driver: "claude-code", DriverKey: "acme/reader", DriverBuild: profiles.ClaudeCode{}.Build(),
		Variant: drivers.HeadlessVariant,
	}}}

	_, err := opener.open("runtime-1", prepared)

	if err == nil || !strings.Contains(err.Error(), "acme/reader") {
		t.Fatalf("an unregistered key gave %v, want a refusal naming it", err)
	}
}
