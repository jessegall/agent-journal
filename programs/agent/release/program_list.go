package release

import (
	"encoding/json"
	"fmt"
	"regexp"
	"slices"
)

// mostPrograms bounds how many programs one list may ask the installer to seal.
const mostPrograms = 8

// Program is one program the journal's list asks the installer to seal: its official install found by Executable on
// the machine's PATH, the Build it must report when run with Check, and the HostName plans call it by.
type Program struct {
	Name       string   `json:"name"`
	Executable string   `json:"executable"`
	Build      string   `json:"build"`
	Check      []string `json:"check"`
	HostName   string   `json:"host_name"`
}

// ProgramList is the list the journal serves at releases/current/programs.json.
type ProgramList struct {
	Programs []Program `json:"drivers"`
}

var (
	programName       = regexp.MustCompile(`^[a-z0-9-]{1,32}$`)
	programExecutable = regexp.MustCompile(`^[A-Za-z0-9._-]{1,64}$`)
	programBuild      = regexp.MustCompile(`^\d+\.\d+\.\d+$`)
	programCheck      = regexp.MustCompile(`^[A-Za-z0-9.-]{1,32}$`)
	programHostName   = regexp.MustCompile(`^[A-Z][A-Z0-9_]{0,63}$`)
)

// ParseProgramList reads the journal's program list and refuses it whole, naming the entry, when any entry breaks a
// rule: the list is data the installer checks, never a script it runs.
func ParseProgramList(content []byte) ([]Program, error) {
	var list ProgramList
	if err := json.Unmarshal(content, &list); err != nil {
		return nil, fmt.Errorf("the journal's program list does not read: %w", err)
	}
	if len(list.Programs) > mostPrograms {
		return nil, fmt.Errorf("the journal's program list names %d programs, more than %d", len(list.Programs), mostPrograms)
	}
	seen := map[string]bool{}
	for _, program := range list.Programs {
		if err := checkProgram(program); err != nil {
			return nil, fmt.Errorf("the journal's program list refuses %q: %w", program.Name, err)
		}
		for _, key := range []string{"name:" + program.Name, "executable:" + program.Executable, "host:" + program.HostName} {
			if seen[key] {
				return nil, fmt.Errorf("the journal's program list names %s twice", key)
			}
			seen[key] = true
		}
	}

	return list.Programs, nil
}

func checkProgram(program Program) error {
	switch {
	case !programName.MatchString(program.Name):
		return fmt.Errorf("its name is not lowercase letters, digits and dashes")
	case !programExecutable.MatchString(program.Executable):
		return fmt.Errorf("its executable %q is not a plain file name", program.Executable)
	case !programBuild.MatchString(program.Build):
		return fmt.Errorf("its build %q is not major.minor.patch", program.Build)
	case len(program.Check) > 2:
		return fmt.Errorf("its check has more than two arguments")
	case !programHostName.MatchString(program.HostName) || slices.Contains(reservedHostNames, program.HostName):
		return fmt.Errorf("its host name %q is not an upper-case name of its own", program.HostName)
	}
	for _, argument := range program.Check {
		if !programCheck.MatchString(argument) {
			return fmt.Errorf("its check argument %q is not a plain word", argument)
		}
	}

	return nil
}
