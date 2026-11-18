package keyscripts

import (
	"errors"
	"fmt"
)

// ErrUnknownScript refuses a script name nobody registered for the profile.
var ErrUnknownScript = errors.New("no key script of that name is registered for the profile")

// Registry holds the key scripts each program build may run, by profile and name; nothing else runs.
type Registry struct {
	scripts map[string]map[string]KeyScript
}

func NewRegistry(scripts ...KeyScript) *Registry {
	registry := &Registry{scripts: map[string]map[string]KeyScript{}}
	for _, script := range scripts {
		if registry.scripts[script.Profile] == nil {
			registry.scripts[script.Profile] = map[string]KeyScript{}
		}
		registry.scripts[script.Profile][script.Name] = script
	}

	return registry
}

// Find gives the registered script of the profile, or ErrUnknownScript.
func (registry *Registry) Find(profile, name string) (KeyScript, error) {
	script, found := registry.scripts[profile][name]
	if !found {
		return KeyScript{}, fmt.Errorf("%w: %s for %s", ErrUnknownScript, name, profile)
	}

	return script, nil
}
