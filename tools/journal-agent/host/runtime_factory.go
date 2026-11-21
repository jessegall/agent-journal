package host

import (
	"fmt"

	"journal-agent/drivers/contracts"
)

// StartGrant is what the journal hands a host for one runtime: which driver and profile, and its credential.
type StartGrant struct {
	RuntimeID  string
	Variant    string
	Profile    string
	Credential string
	// ProfilePin is the start's pinned authorization profile as environment entries; empty when it has none.
	ProfilePin []string
}

// DriverConstructor opens the driver of one runtime from its grant.
type DriverConstructor func(grant StartGrant) (contracts.AgentDriver, error)

// RuntimeFactory picks a runtime's driver once, when the runtime opens; the process and terminal drivers register here.
type RuntimeFactory struct{ constructors map[string]DriverConstructor }

// NewRuntimeFactory returns a factory with no drivers yet.
func NewRuntimeFactory() *RuntimeFactory {
	return &RuntimeFactory{constructors: map[string]DriverConstructor{}}
}

// Register makes a driver type available.
func (factory *RuntimeFactory) Register(driverType string, constructor DriverConstructor) {
	factory.constructors[driverType] = constructor
}

// Open builds the driver the grant names.
func (factory *RuntimeFactory) Open(grant StartGrant) (contracts.AgentDriver, error) {
	constructor, found := factory.constructors[grant.Variant]
	if !found {
		return nil, fmt.Errorf("no driver of type %q is registered", grant.Variant)
	}
	return constructor(grant)
}
