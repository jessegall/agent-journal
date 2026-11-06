package launch

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// LineRunner runs one journal command line and gives back what it printed.
type LineRunner func(argv ...string) (string, error)

// CommandJournal is the Journal the boot menu reads through the journal's own command lines.
type CommandJournal struct {
	Run LineRunner
}

type listing struct {
	Rows []map[string]any `json:"rows"`
}

type suiteRun struct {
	Suite string `json:"suite"`
}

// Suites are the installed top suites, as journal suite list gives them.
func (journal CommandJournal) Suites() ([]string, error) {
	output, err := journal.Run("suite", "list")
	return strings.Fields(output), err
}

// Environments are the journal's environments, oldest first, each with its suite and whether a live session holds it.
func (journal CommandJournal) Environments() ([]Environment, error) {
	rows, err := journal.rows("environment", "list")
	if err != nil {
		return nil, err
	}
	agents, err := journal.rows("agent", "list")
	if err != nil {
		return nil, err
	}
	environments := []Environment{}
	for _, row := range rows {
		name := text(row, "name")
		output, err := journal.Run("suite", "current", name, "--json")
		if err != nil {
			return nil, err
		}
		var run suiteRun
		_ = json.Unmarshal([]byte(output), &run)
		id, _ := row["id"].(float64)
		environments = append(environments, Environment{ID: int(id), Name: name, Folder: text(row, "folder"), Branch: text(row, "branch"), Suite: run.Suite,
			Working: hasOpenMain(agents, row["id"])})
	}
	return environments, nil
}

// Conversations are the program's past sessions in the environment, newest first.
func (journal CommandJournal) Conversations(environment, program string) ([]Conversation, error) {
	rows, err := journal.rows("agent", "list", "--environment", environment)
	if err != nil {
		return nil, err
	}
	conversations := []Conversation{}
	for index := len(rows) - 1; index >= 0; index-- {
		if text(rows[index], "program") == program {
			conversations = append(conversations, Conversation{Session: text(rows[index], "session"), Role: text(rows[index], "role")})
		}
	}
	return conversations, nil
}

// StartAgent makes the agent row a launch runs under, held by its launch name until its first hook names its session.
func (journal CommandJournal) StartAgent(environment, program, launchName string) (int, error) {
	output, err := journal.Run("agent", "start", launchName, program, "main", "--environment", environment, "--json")
	if err != nil {
		return 0, err
	}
	var agent struct {
		ID int `json:"id"`
	}
	if err := json.NewDecoder(strings.NewReader(output)).Decode(&agent); err != nil || agent.ID == 0 {
		return 0, fmt.Errorf("journal agent start gave no agent: %s", output)
	}
	return agent.ID, nil
}

// MakeEnvironment makes the environment with journal environment make and chooses its suite for it.
func (journal CommandJournal) MakeEnvironment(environment Environment) error {
	if _, err := journal.Run("environment", "make", environment.Name, environment.Folder, "--branch", environment.Branch); err != nil {
		return err
	}
	_, err := journal.Run("suite", "choose", environment.Suite, "--environment", environment.Name)
	return err
}

// DeleteEnvironment deletes the environment's row with everything recorded in it.
func (journal CommandJournal) DeleteEnvironment(environment Environment) error {
	_, err := journal.Run("environment", "delete", strconv.Itoa(environment.ID))
	return err
}

// PrepareWorktree has the journal place the source folder's library folders in a freshly cut launch worktree and run the worktree commands of its environment there.
func (journal CommandJournal) PrepareWorktree(folder, source, environment string) error {
	_, err := journal.Run("worktree", "prepare", folder, source, environment)
	return err
}

func (journal CommandJournal) rows(argv ...string) ([]map[string]any, error) {
	output, err := journal.Run(append(argv, "--oldest", "--limit", "1000", "--json")...)
	if err != nil {
		return nil, err
	}
	var page listing
	if err := json.Unmarshal([]byte(output), &page); err != nil {
		return nil, fmt.Errorf("journal %s gave no rows: %s", strings.Join(argv, " "), output)
	}
	return page.Rows, nil
}

// StopMainAgent stops the main agents that run in the environment, each through the journal.
func (journal CommandJournal) StopMainAgent(environment string) error {
	agents, err := journal.rows("agent", "list", "--environment", environment)
	if err != nil {
		return err
	}
	for _, agent := range agents {
		if agent["ended_at"] == nil && text(agent, "role") == MainRole {
			if _, err := journal.Run("agent", "stop", fmt.Sprint(agent["id"]), "--environment", environment); err != nil {
				return err
			}
		}
	}
	return nil
}

func hasOpenMain(agents []map[string]any, environmentID any) bool {
	for _, agent := range agents {
		if agent["environment_id"] == environmentID && agent["ended_at"] == nil && text(agent, "role") == "main" {
			return true
		}
	}
	return false
}

func text(row map[string]any, column string) string {
	value, _ := row[column].(string)
	return value
}

// AnswersFile is where a journal keeps the boot menu's last answers, the next launch's defaults.
func AnswersFile(home string) string {
	return filepath.Join(home, "launch-answers.json")
}

// LoadAnswers reads the last answers, or none.
func LoadAnswers(home string) map[string]string {
	answers := map[string]string{}
	if content, err := os.ReadFile(AnswersFile(home)); err == nil {
		_ = json.Unmarshal(content, &answers)
	}
	return answers
}

// SaveAnswers keeps the answers for the next launch.
func SaveAnswers(home string, answers map[string]string) error {
	content, err := json.Marshal(answers)
	if err != nil {
		return err
	}
	return os.WriteFile(AnswersFile(home), content, 0o600)
}

// ProgramCommand is the command line that starts the program on the choice, as the program's provider in the
// journal builds it: its conversation, its prompts, its launch name and the arguments the person gave. Each argument
// is one line of the answer, so one holding a space stays whole.
func (journal CommandJournal) ProgramCommand(request Request, choice Choice, launchName string) ([]string, error) {
	argv := []string{"program", "command", request.Program, choice.Folder, "--launch", launchName}
	if choice.Session != "" {
		argv = append(argv, "--resume", choice.Session)
	}
	if !choice.SkipPrompts {
		argv = append(argv, "--ask-prompts")
	}
	for _, argument := range request.ProgramArguments {
		argv = append(argv, "--program-argument="+argument)
	}
	output, err := journal.Run(argv...)
	if err != nil {
		return nil, err
	}
	trimmed := strings.TrimSpace(output)
	if trimmed == "" {
		return nil, fmt.Errorf("the journal gave no command line for %s", request.Program)
	}
	return strings.Split(trimmed, "\n"), nil
}

// TellMenuAnswer shows in the chat what the launcher pressed on a menu in the agent's terminal; a journal that does not
// answer loses the mark, never the press.
func (journal CommandJournal) TellMenuAnswer(agentID int, question, answer string) {
	_, _ = journal.Run("agent", "menu-answer", strconv.Itoa(agentID), question, answer)
}

// TellProgramExit tells the journal a program it asked for has exited; an older journal ends the row by its idle rule.
func (journal CommandJournal) TellProgramExit(agentID, exitCode int) {
	_, _ = journal.Run("agent", "exited", strconv.Itoa(agentID), strconv.Itoa(exitCode))
}

// TellLaunchEnded tells the journal a program was stopped because the launch that ran it ended.
func (journal CommandJournal) TellLaunchEnded(agentID, exitCode int) {
	_, _ = journal.Run("agent", "exited", strconv.Itoa(agentID), strconv.Itoa(exitCode), "--launch-ended")
}

// HookTrustLine is the one line a Codex launch prints when Codex does not trust the journal's hooks yet, or no longer.
func HookTrustLine(trust string) string {
	switch trust {
	case "untrusted":
		return "Codex does not trust the journal's hooks in this folder yet, so they will not run: trust them in Codex's Hooks need review menu, or with /hooks inside codex"
	case "changed":
		return "the journal's Codex hooks changed since you trusted them, so they will not run: trust them again in Codex's Hooks need review menu, or with /hooks inside codex"
	}
	return ""
}
