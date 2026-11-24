package keyscripts

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

// ErrUnknownAction refuses a key script step whose action the runner does not know.
var ErrUnknownAction = errors.New("the key script step has an action the runner does not know")

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

// Find gives the registered script of the profile (program@build); a build with no script of that name falls back
// to the newest registered build of the same program, whose script then runs unchanged, each step still waiting for
// its own screen. The script's Profile says which build's script it is. ErrUnknownScript when no build has it.
func (registry *Registry) Find(profile, name string) (KeyScript, error) {
	if script, found := registry.scripts[profile][name]; found {
		return script, nil
	}

	program, _, _ := strings.Cut(profile, "@")
	newest, found := KeyScript{}, false
	for registered, scripts := range registry.scripts {
		script, has := scripts[name]
		registeredDriver, build, _ := strings.Cut(registered, "@")
		if !has || registeredDriver != program {
			continue
		}
		_, newestBuild, _ := strings.Cut(newest.Profile, "@")
		if !found || isNewerBuild(build, newestBuild) {
			newest, found = script, true
		}
	}
	if !found {
		return KeyScript{}, fmt.Errorf("%w: %s for %s", ErrUnknownScript, name, profile)
	}

	return newest, nil
}

// isNewerBuild is whether one dotted build number is newer than the other, part by part, so 2.1.330 is newer than
// 2.1.323 and 2.10.0 newer than 2.9.9.
func isNewerBuild(build, than string) bool {
	parts, others := strings.Split(build, "."), strings.Split(than, ".")
	for at := 0; at < max(len(parts), len(others)); at++ {
		part, other := buildPart(parts, at), buildPart(others, at)
		if part != other {
			return part > other
		}
	}

	return false
}

func buildPart(parts []string, at int) int {
	if at >= len(parts) {
		return 0
	}
	number, err := strconv.Atoi(parts[at])
	if err != nil {
		return 0
	}

	return number
}
