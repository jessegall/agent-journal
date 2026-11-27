package main

import (
	"maps"
	"slices"
	"testing"

	"journal-agent/client"
	"journal-agent/hostapi"
)

// The host carries out exactly the order types protocol/host.json names: none missing, none of its own.
func TestTheHostCarriesOutEveryOrderOfTheProtocol(t *testing.T) {
	table := &hostapi.ProcessTable{}
	executors := table.Executors()
	maps.Copy(executors, hostapi.NewProcessInput(table, nil, nil).Executors())
	maps.Copy(executors, hostapi.ProjectReads{}.Executors())
	maps.Copy(executors, bindingRelay{}.upgradeOrders(nil, nil))

	carried := slices.Sorted(maps.Keys(executors))
	named := slices.Sorted(maps.Keys(hostapi.OrderTypes))
	if !slices.Equal(carried, named) {
		t.Fatalf("the host carries out %v, the protocol names %v", carried, named)
	}
}

// The host fills exactly the {host:NAME} names protocol/host.json names, so a plan the journal writes finds each.
func TestTheHostFillsTheProtocolsHostNames(t *testing.T) {
	names := hostNamesOf(client.New(client.Enrollment{JournalURL: "http://journal.test"}), "/installation", "/installation/bin/journal-hook")

	filled := slices.Sorted(maps.Keys(names))
	named := slices.Sorted(slices.Values(hostapi.HostNames))
	if !slices.Equal(filled, named) {
		t.Fatalf("the host fills %v, the protocol names %v", filled, named)
	}
}
