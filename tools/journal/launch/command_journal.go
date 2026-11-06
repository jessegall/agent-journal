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

type environmentRow struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Folder      string `json:"folder"`
	Branch      string `json:"branch"`
	Suite       string `json:"suite"`
	MainRunning bool   `json:"main_running"`
}

type sessionRow struct {
	Session string `json:"session"`
}

type runningRow struct {
	ID int `json:"id"`
}

// Suites are the installed top suites, as journal suite list gives them.
func (journal CommandJournal) Suites() ([]string, error) {
	output, err := journal.Run("suite", "list")
	return strings.Fields(output), err
}

// Environments are the journal's environments, oldest first, each with its suite and whether a main agent runs in it.
func (journal CommandJournal) Environments() ([]Environment, error) {
	rows, err := readRows[environmentRow](journal, "environment", "menu")
	if err != nil {
		return nil, err
	}
	environments := make([]Environment, 0, len(rows))
	for _, row := range rows {
		environments = append(environments, Environment{ID: row.ID, Name: row.Name, Folder: row.Folder, Branch: row.Branch, Suite: row.Suite, Working: row.MainRunning})
	}
	return environments, nil
}

// Conversations are the program's past main sessions in the environment, newest first.
func (journal CommandJournal) Conversations(environment, program string) ([]Conversation, error) {
	rows, err := readRows[sessionRow](journal, "agent", "main-sessions", program, "--environment", environment)
	if err != nil {
		return nil, err
	}
	conversations := make([]Conversation, 0, len(rows))
	for _, row := range rows {
		conversations = append(conversations, Conversation{Session: row.Session})
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

// StopMainAgent stops the main agents that run in the environment, each through the journal.
func (journal CommandJournal) StopMainAgent(environment string) error {
	agents, err := readRows[runningRow](journal, "agent", "running-main-agents", "--environment", environment)
	if err != nil {
		return err
	}
	for _, agent := range agents {
		if _, err := journal.Run("agent", "stop", strconv.Itoa(agent.ID), "--environment", environment); err != nil {
			return err
		}
	}
	return nil
}

// readRows reads the rows a journal read line answers with.
func readRows[Row any](journal CommandJournal, argv ...string) ([]Row, error) {
	output, err := journal.Run(append(argv, "--json")...)
	if err != nil {
		return nil, err
	}
	var page struct {
		Rows []Row `json:"rows"`
	}
	if err := json.Unmarshal([]byte(output), &page); err != nil {
		return nil, fmt.Errorf("journal %s gave no rows: %s", strings.Join(argv, " "), output)
	}
	return page.Rows, nil
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
func (journal CommandJournal) TellProgramExit(agentID, exitCode, pid int) {
	_, _ = journal.Run("agent", "exited", strconv.Itoa(agentID), strconv.Itoa(exitCode), "--pid", strconv.Itoa(pid))
}

// TellLaunchEnded tells the journal a program was stopped because the launch that ran it ended.
func (journal CommandJournal) TellLaunchEnded(agentID, exitCode, pid int) {
	_, _ = journal.Run("agent", "exited", strconv.Itoa(agentID), strconv.Itoa(exitCode), "--launch-ended", "--pid", strconv.Itoa(pid))
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
