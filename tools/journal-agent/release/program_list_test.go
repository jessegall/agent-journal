package release

import (
	"encoding/json"
	"strings"
	"testing"
)

func listOf(t *testing.T, programs ...Program) []byte {
	t.Helper()
	content, err := json.Marshal(ProgramList{Programs: programs})
	if err != nil {
		t.Fatal(err)
	}
	return content
}

func agentProgram() Program {
	return Program{Name: "first-agent", Executable: "first", Build: "2.1.323", Check: []string{"--version"},
		HostName: "FIRST_EXECUTABLE"}
}

func TestTheJournalsListReadsBackAsItsPrograms(t *testing.T) {
	second := Program{Name: "second", Executable: "second", Build: "0.165.0", Check: []string{"--version"},
		HostName: "SECOND_EXECUTABLE"}

	programs, err := ParseProgramList(listOf(t, agentProgram(), second))

	if err != nil || len(programs) != 2 || programs[1].Executable != "second" {
		t.Fatalf("the list read as %+v, %v", programs, err)
	}
}

func TestAListBreakingARuleIsRefusedWhole(t *testing.T) {
	broken := map[string]func(*Program){
		"a path for an executable":  func(program *Program) { program.Executable = "/usr/bin/first" },
		"a build that is no number": func(program *Program) { program.Build = "latest" },
		"a check of three words":    func(program *Program) { program.Check = []string{"a", "b", "c"} },
		"a check with a shell word": func(program *Program) { program.Check = []string{"$(id)"} },
		"a reserved host name":      func(program *Program) { program.HostName = "HOOK_COMMAND" },
		"a lowercase host name":     func(program *Program) { program.HostName = "first" },
	}
	for rule, breaks := range broken {
		program := agentProgram()
		breaks(&program)

		if _, err := ParseProgramList(listOf(t, program)); err == nil || !strings.Contains(err.Error(), "first-agent") {
			t.Fatalf("%s was not refused with the entry named: %v", rule, err)
		}
	}
}

func TestAProgramListedTwiceOrTooManyProgramsAreRefused(t *testing.T) {
	many := []Program{}
	for range mostPrograms + 1 {
		many = append(many, agentProgram())
	}

	_, twice := ParseProgramList(listOf(t, agentProgram(), agentProgram()))
	_, tooMany := ParseProgramList(listOf(t, many...))

	if twice == nil || tooMany == nil {
		t.Fatalf("a repeated or overlong list was taken: %v, %v", twice, tooMany)
	}
}
