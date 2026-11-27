package hostapi

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
)

// AllowedProgramsFile is the file in the host's state folder the installer writes for one sealed release: each sealed
// program by its host name. Each release has its own, so an upgrade that switches back keeps the list it had.
func AllowedProgramsFile(stateFolder, release string) string {
	return filepath.Join(stateFolder, "allowed", release+".json")
}

// AllowedPrograms are the executables a connected host may open: the programs its installer sealed, nothing else.
type AllowedPrograms struct {
	Release  string            `json:"release"`
	Programs map[string]string `json:"drivers"`
}

// LoadAllowedPrograms reads the installer's list of the release; a release with no list allows nothing.
func LoadAllowedPrograms(stateFolder, release string) (*AllowedPrograms, error) {
	content, err := os.ReadFile(AllowedProgramsFile(stateFolder, release))
	if errors.Is(err, os.ErrNotExist) {
		return &AllowedPrograms{Programs: map[string]string{}}, nil
	}
	if err != nil {
		return nil, err
	}
	allowed := &AllowedPrograms{}
	if err := json.Unmarshal(content, allowed); err != nil {
		return nil, err
	}
	if allowed.Programs == nil {
		allowed.Programs = map[string]string{}
	}

	return allowed, nil
}

// Permits is whether the executable is one of the sealed programs, exactly.
func (allowed *AllowedPrograms) Permits(executable string) bool {
	for _, path := range allowed.Programs {
		if path == executable {
			return true
		}
	}

	return false
}

// AllowOnly limits the processes this table opens to the listed programs, as a connected host is limited; a table
// with no list, as on a co-located host, opens any executable.
func (table *ProcessTable) AllowOnly(allowed *AllowedPrograms) {
	table.allowed = allowed
}

// requireListed refuses a plan whose program, or the program it heals with, is not on the list.
func (table *ProcessTable) requireListed(plan OpenPlan) error {
	if table.allowed == nil {
		return nil
	}
	for _, argv := range [][]string{plan.Argv, plan.RestartArgv} {
		program := programOf(argv)
		if program != "" && !table.allowed.Permits(program) {
			return RefusalError{Refusal: Unsafe, Reason: "the executable " + program + " is not on the installer's list"}
		}
	}

	return nil
}

// programOf is the program an argv runs.
func programOf(argv []string) string {
	if len(argv) == 0 {
		return ""
	}

	return argv[0]
}
