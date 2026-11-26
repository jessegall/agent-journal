package main

import (
	"context"
	"errors"
	"testing"

	"journal-agent/hostapi"
)

func TestAnUpgradeIsRefusedWhileAProcessLives(t *testing.T) {
	relay := bindingRelay{}
	stopped := false
	executor := relay.upgradeOrders(func() []string { return []string{"terminal-1"} }, func() { stopped = true })["upgrade"]

	_, err := executor(context.Background(), hostapi.Order{ID: "upgrade", Type: "upgrade", Payload: `{"version":"6.1.0"}`})

	var refusal hostapi.RefusalError
	if !errors.As(err, &refusal) || refusal.Refusal != hostapi.Fenced || stopped {
		t.Fatalf("an upgrade with a live process answered %v, stopped %v", err, stopped)
	}
}

func TestAnUpgradeThatNamesNoReleaseOrABadSignatureIsRefused(t *testing.T) {
	relay := bindingRelay{}
	executor := relay.upgradeOrders(func() []string { return []string{} }, func() {})["upgrade"]

	_, unnamed := executor(context.Background(), hostapi.Order{ID: "a", Type: "upgrade", Payload: `{}`})
	_, unsigned := executor(context.Background(), hostapi.Order{ID: "b", Type: "upgrade", Payload: `{"version":"6.1.0","signature":"%%"}`})

	var refusal hostapi.RefusalError
	if !errors.As(unnamed, &refusal) || !errors.As(unsigned, &refusal) {
		t.Fatalf("a release-less or unreadable upgrade was not refused: %v, %v", unnamed, unsigned)
	}
}
