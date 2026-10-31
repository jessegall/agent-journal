package launch

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
)

// The questions and the fixed answers of the boot menu.
const (
	SuiteQuestion        = "Which suite?"
	EnvironmentQuestion  = "Which environment?"
	NameQuestion         = "The new environment's name?"
	BranchQuestion       = "The branch it works on?"
	ConversationQuestion = "Which conversation?"
	PromptQuestion       = "Permission prompts?"
	NewEnvironment       = "a new environment"
	FreshConversation    = "start fresh"
	AskPrompts           = "ask for permissions"
	SkipPrompts          = "skip permission prompts"
	ConversationPrefix   = "carry on "
	MainWorktreeRefusal  = "main is the project's own checkout, never a worktree: give --worktree another name, or leave the name out for a made-up one"
	EnvironmentVariable  = "JOURNAL_ENV"
	ActiveVariable       = "AGENT_JOURNAL_ACTIVE"
	WorkerRole           = "worker"
)

// Environment is one environment of the journal, with the suite it runs and whether a working session holds it.
type Environment struct {
	Name    string
	Folder  string
	Branch  string
	Suite   string
	Working bool
}

// Conversation is one past session of a program in an environment, with the role of its agent.
type Conversation struct {
	Session string
	Role    string
}

// Journal is what the boot menu reads from the journal and asks it to make.
type Journal interface {
	Suites() ([]string, error)
	Environments() ([]Environment, error)
	Conversations(environment, program string) ([]Conversation, error)
	MakeEnvironment(environment Environment) error
	PrepareWorktree(folder, source string) error
}

// Request is what the command line asked for: the program, the project's folder, and a worktree when one is named.
type Request struct {
	Program       string
	Root          string
	Worktree      string
	WorktreeGiven bool
	Answers       map[string]string
}

// Choice is what the boot menu settled: the suite, the environment and its folder, the conversation to carry on,
// the prompts, the variables the program starts with, and the answers to keep as the next launch's defaults.
type Choice struct {
	Suite       string
	Environment string
	Folder      string
	Session     string
	SkipPrompts bool
	Variables   map[string]string
	Answers     map[string]string
}

type boot struct {
	journal  Journal
	terminal Terminal
	request  Request
	choice   Choice
}

// Boot asks the boot menu's questions one at a time, the last answer as the default and the left arrow going back
// to the last question asked, and gives back the launch it settled.
func Boot(journal Journal, terminal Terminal, request Request) (Choice, error) {
	menu := &boot{journal: journal, terminal: terminal, request: request, choice: Choice{Answers: map[string]string{}, Variables: map[string]string{}}}
	steps := []func() (bool, error){menu.suite, menu.environment, menu.conversation, menu.prompts}
	previousSteps := []int{}
	for index := 0; index < len(steps); {
		isQuestion, err := steps[index]()
		if errors.Is(err, errBack) {
			if len(previousSteps) > 0 {
				index, previousSteps = previousSteps[len(previousSteps)-1], previousSteps[:len(previousSteps)-1]
			}
			continue
		}
		if err != nil {
			return Choice{}, err
		}
		if isQuestion {
			previousSteps = append(previousSteps, index)
		}
		index++
	}
	menu.choice.Variables[EnvironmentVariable], menu.choice.Variables[ActiveVariable] = menu.choice.Environment, "1"
	return menu.choice, nil
}

func (menu *boot) answer(question Question) (string, error) {
	question.Default = menu.request.Answers[question.Title]
	answer, err := Answer(menu.terminal, question)
	if err == nil {
		menu.choice.Answers[question.Title] = answer
	}
	return answer, err
}

func (menu *boot) suite() (bool, error) {
	suites, err := menu.journal.Suites()
	if err != nil {
		return false, err
	}
	if len(suites) == 1 {
		menu.choice.Suite = suites[0]
		return false, nil
	}
	menu.choice.Suite, err = menu.answer(Question{Title: SuiteQuestion, Options: suites})
	return true, err
}

func (menu *boot) environment() (bool, error) {
	environments, err := menu.journal.Environments()
	if err != nil {
		return false, err
	}
	if menu.request.WorktreeGiven {
		return false, menu.worktreeEnvironment(environments)
	}
	offered := suiteEnvironments(environments, menu.choice.Suite)
	options := []string{}
	for _, environment := range offered {
		options = append(options, environment.Name)
	}
	for {
		answer, err := menu.answer(Question{Title: EnvironmentQuestion, Options: append(options, NewEnvironment)})
		if err != nil {
			return true, err
		}
		if answer != NewEnvironment {
			return true, menu.useEnvironment(offered[indexOf(options, answer)])
		}
		if err := menu.newEnvironment(); !errors.Is(err, errBack) {
			return true, err
		}
	}
}

func (menu *boot) newEnvironment() error {
	name, err := Answer(menu.terminal, Question{Title: NameQuestion})
	if err != nil {
		return err
	}
	branch, err := Answer(menu.terminal, Question{Title: BranchQuestion})
	if err != nil {
		return err
	}
	environment := Environment{Name: name, Folder: menu.request.Root, Branch: branch, Suite: menu.choice.Suite}
	if err := menu.journal.MakeEnvironment(environment); err != nil {
		return err
	}
	return menu.useEnvironment(environment)
}

func (menu *boot) useEnvironment(environment Environment) error {
	menu.choice.Environment, menu.choice.Folder = environment.Name, environment.Folder
	worktrees := Worktrees{Root: menu.request.Root}
	if filepath.Dir(environment.Folder) != worktrees.Folder() {
		return nil
	}
	return menu.prepared(worktrees, filepath.Base(environment.Folder))
}

// prepared cuts the launch worktree when it is missing and, once cut, has the journal give it the project's library
// folders and run the worktree commands in it.
func (menu *boot) prepared(worktrees Worktrees, name string) error {
	_, missing := os.Stat(filepath.Join(worktrees.Folder(), name))
	folder, err := worktrees.Prepare(name)
	if err != nil || !os.IsNotExist(missing) {
		return err
	}
	return menu.journal.PrepareWorktree(folder, menu.request.Root)
}

func (menu *boot) worktreeEnvironment(environments []Environment) error {
	name := menu.request.Worktree
	if name == "main" {
		return errors.New(MainWorktreeRefusal)
	}
	names, working := []string{}, []string{}
	for _, environment := range environments {
		names = append(names, environment.Name)
		if environment.Working {
			working = append(working, environment.Name)
		}
	}
	worktrees := Worktrees{Root: menu.request.Root}
	if name == "" {
		name = worktrees.UnusedName(names)
	}
	name = UnheldName(name, working)
	folder := filepath.Join(worktrees.Folder(), name)
	if err := menu.prepared(worktrees, name); err != nil {
		return err
	}
	if indexOf(names, name) < 0 {
		environment := Environment{Name: name, Folder: folder, Branch: BranchPrefix + name, Suite: menu.choice.Suite}
		if err := menu.journal.MakeEnvironment(environment); err != nil {
			return err
		}
	}
	menu.choice.Environment, menu.choice.Folder = name, folder
	return nil
}

func (menu *boot) conversation() (bool, error) {
	conversations, err := menu.journal.Conversations(menu.choice.Environment, menu.request.Program)
	if err != nil {
		return false, err
	}
	options := []string{}
	for _, conversation := range conversations {
		if conversation.Role != WorkerRole {
			options = append(options, ConversationPrefix+conversation.Session)
		}
	}
	answer, err := menu.answer(Question{Title: ConversationQuestion, Options: append(options, FreshConversation)})
	menu.choice.Session = strings.TrimPrefix(answer, ConversationPrefix)
	if answer == FreshConversation {
		menu.choice.Session = ""
	}
	return true, err
}

func (menu *boot) prompts() (bool, error) {
	answer, err := menu.answer(Question{Title: PromptQuestion, Options: []string{AskPrompts, SkipPrompts}})
	menu.choice.SkipPrompts = answer == SkipPrompts
	return true, err
}

// suiteEnvironments are the environments that run the suite, newest first.
func suiteEnvironments(environments []Environment, suite string) []Environment {
	offered := []Environment{}
	for index := len(environments) - 1; index >= 0; index-- {
		if environments[index].Suite == suite {
			offered = append(offered, environments[index])
		}
	}
	return offered
}

func indexOf(values []string, value string) int {
	for index, candidate := range values {
		if candidate == value {
			return index
		}
	}
	return -1
}
