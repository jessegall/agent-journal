package main

import (
	"errors"
	"testing"

	"journal-agent/client"
	"journal-agent/drivers"
	"journal-agent/host"
	"journal-agent/profiles"
)

func TestALocalHostDeclaresCodexOnlyHeadlessAndAContainedHostNoCodex(t *testing.T) {
	codex := profiles.Codex{}.Build()
	claude := profiles.ClaudeCode{}.Build()
	local := combinationsOf(host.Local)
	contained := combinationsOf(host.Contained)

	if !declares(local, "codex", codex, drivers.HeadlessVariant) || declares(local, "codex", codex, drivers.TerminalVariant) {
		t.Fatalf("a local host declares %v; want codex headless only", local)
	}
	if declares(contained, "codex", codex, drivers.HeadlessVariant) {
		t.Fatalf("a contained host declares codex: %v", contained)
	}
	if !declares(contained, "claude-code", claude, drivers.TerminalVariant) || !declares(contained, "claude-code", claude, drivers.HeadlessVariant) {
		t.Fatalf("a contained host declares %v; want both claude-code variants", contained)
	}
}

func TestAGrantForAnUndeclaredCombinationStartsNothing(t *testing.T) {
	opener := runtimeOpener{stateFolder: t.TempDir(), declared: combinationsOf(host.Contained)}
	prepared := host.PreparedStart{Grant: client.Grant{Runtime: client.RuntimeStart{
		Driver: "codex", DriverBuild: profiles.Codex{}.Build(), Variant: drivers.HeadlessVariant,
	}}}

	_, err := opener.open("runtime-1", prepared)

	if !errors.Is(err, ErrCombinationNotDeclared) {
		t.Fatalf("an undeclared grant gave %v, want ErrCombinationNotDeclared", err)
	}
}
