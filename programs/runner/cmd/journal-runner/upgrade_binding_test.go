package main

import (
	"context"
	"errors"
	"testing"

	"journal-runner/hostapi"
)

func TestAnUpgradeIsRefusedWhileAProcessLives(t *testing.T) {
	relay := bindingRelay{}
	stopped := false
	upgrade := bindingUpgrade{binder: relay, live: func() []string { return []string{"terminal-1"} }, stop: func() { stopped = true }}
	executor := hostInstructions{ProcessTable: &hostapi.ProcessTable{}, upgrade: &upgrade}.executors()["upgrade"]
	payload := `{"version":"6.1.0","manifest":"","signature":"","drivers":""}`

	_, err := executor(context.Background(), hostapi.Instruction{ID: "upgrade", Type: "upgrade", Payload: payload})

	var refusal hostapi.RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != hostapi.Fenced || stopped {
		t.Fatalf("an upgrade with a live process answered %v, stopped %v", err, stopped)
	}
}

func TestAnUpgradeThatNamesNoReleaseOrABadSignatureIsRefused(t *testing.T) {
	relay := bindingRelay{}
	upgrade := bindingUpgrade{binder: relay, live: func() []string { return []string{} }, stop: func() {}}
	executor := hostInstructions{ProcessTable: &hostapi.ProcessTable{}, upgrade: &upgrade}.executors()["upgrade"]
	unnamedPayload := `{"version":"","manifest":"","signature":"","drivers":""}`
	unsignedPayload := `{"version":"6.1.0","manifest":"","signature":"%%","drivers":""}`

	_, unnamed := executor(context.Background(), hostapi.Instruction{ID: "a", Type: "upgrade", Payload: unnamedPayload})
	_, unsigned := executor(context.Background(), hostapi.Instruction{ID: "b", Type: "upgrade", Payload: unsignedPayload})

	var refusal hostapi.RefusalError
	if !errors.As(unnamed, &refusal) || !errors.As(unsigned, &refusal) {
		t.Fatalf("a release-less or unreadable upgrade was not refused: %v, %v", unnamed, unsigned)
	}
}
