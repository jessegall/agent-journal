package launch

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// The questions and the fixed answers of the boot menu.
const (
	SuiteQuestion        = "Which suite?"
	EnvironmentQuestion  = "Which environment?"
	NameQuestion         = "The new environment's name?"
	BranchQuestion       = "The branch it works on?"
	RunningQuestion      = "A main agent is running in this environment. Stop it and start here?"
	StopRunning          = "stop it and start here"
	LeaveRunning         = "leave it running and quit"
	KeepEnvironment      = "No, keep it"
	DiscardEnvironment   = "Yes, delete it"
	BackToEnvironments   = "Back"
	DiscardKey           = 'x'
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
	ClaudeProgram        = "claude"
)

// Environment is one environment of the journal, with the suite it runs and whether a working session holds it.
type Environment struct {
	ID      int
	Name    string
	Folder  string
	Branch  string
	Suite   string
	Working bool
}

// Conversation is one past main session of a program in an environment.
type Conversation struct {
	Session    string
	Title      string
	ModifiedAt time.Time
}

// Journal is what the boot menu reads from the journal and asks it to make.
type Journal interface {
	Suites() ([]string, error)
	Environments() ([]Environment, error)
	Conversations(environment, program string) ([]Conversation, error)
	MakeEnvironment(environment Environment) error
	PrepareWorktree(folder, source, environment string) error
	StopMainAgent(environment string) error
	DeleteEnvironment(environment Environment) error
}

// ErrLeftRunning is the answer of a person who keeps the main agent that runs in the chosen environment: nothing starts.
var ErrLeftRunning = errors.New("the running main agent was left running, and nothing started")

// Request is what the command line asked for: the program, the project's folder, and a worktree when one is named.
type Request struct {
	Program          string
	Root             string
	Worktree         string
	WorktreeGiven    bool
	ProgramArguments []string
	Answers          map[string]string
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
	journal     Journal
	terminal    Terminal
	request     Request
	choice      Choice
	mainRunning bool
	stopsMain   bool
}

// Boot asks the boot menu's questions one at a time, the last answer as the default and the left arrow going back
// to the last question asked, and gives back the launch it settled.
func Boot(journal Journal, terminal Terminal, request Request) (Choice, error) {
	menu := &boot{journal: journal, terminal: terminal, request: request, choice: Choice{Answers: map[string]string{}, Variables: map[string]string{}}}
	steps := []func() (bool, error){menu.suite, menu.environment, menu.running, menu.conversation, menu.prompts}
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
	if menu.stopsMain {
		if err := journal.StopMainAgent(menu.choice.Environment); err != nil {
			return Choice{}, err
		}
	}
	menu.choice.Variables[EnvironmentVariable], menu.choice.Variables[ActiveVariable] = menu.choice.Environment, "1"
	terminal.Draw(menu.summary())
	return menu.choice, nil
}

// summary is the closing screen: what the launch starts with, one finished step to a line.
func (menu *boot) summary() string {
	style := menu.terminal.Style()
	conversation, prompts := "new", "asked"
	if menu.choice.Session != "" {
		conversation = "continued from " + cut(menu.choice.Session, 8)
	}
	if menu.choice.SkipPrompts {
		prompts = "skipped"
	}
	rows := [][2]string{{"suite", menu.choice.Suite}, {"environment", menu.choice.Environment}, {"conversation", conversation}, {"prompts", prompts}}
	lines := []string{"  " + style.Accent("?") + " " + style.Bold("Starting"), ""}
	for _, row := range rows {
		lines = append(lines, fmt.Sprintf("    %s %-13s %s", style.Good("✓"), row[0], row[1]))
	}
	return strings.Join(lines, "\r\n") + "\r\n"
}

func (menu *boot) answer(question Question) (string, error) {
	selection, err := menu.choose(question)
	return selection.Option, err
}

// choose puts the question under the banner, with the last answer as its default, and keeps the option selection.
func (menu *boot) choose(question Question) (Selection, error) {
	question.Default = menu.request.Answers[question.Title]
	question.Header = Banner(menu.terminal.Style(), menu.request.Program, menu.request.Root)
	selection, err := Choose(menu.terminal, question)
	if err == nil && selection.Action == 0 {
		menu.choice.Answers[question.Title] = selection.Option
	}
	return selection, err
}

// query puts a question under the banner and keeps nothing of its answer: a line of text, or a question about the
// environment chosen.
func (menu *boot) query(question Question) (Selection, error) {
	question.Header = Banner(menu.terminal.Style(), menu.request.Program, menu.request.Root)
	return Choose(menu.terminal, question)
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
	for {
		offered := suiteEnvironments(environments, menu.choice.Suite)
		options, badges := []string{}, map[string][]string{}
		for _, environment := range offered {
			options, badges[environment.Name] = append(options, environment.Name), menu.badges(environment)
		}
		selection, err := menu.choose(Question{Title: EnvironmentQuestion, Notes: []string{"An environment is one line of work with a record of its own."},
			Options: append(options, NewEnvironment), Badges: badges, Actions: map[rune]string{DiscardKey: "x to delete"}, ApartLast: true})
		if err != nil {
			return true, err
		}
		if selection.Action == DiscardKey {
			if selection.Option != NewEnvironment {
				err = menu.discard(offered[indexOf(options, selection.Option)])
			}
			if err != nil {
				return true, err
			}
			if environments, err = menu.journal.Environments(); err != nil {
				return true, err
			}
			continue
		}
		if selection.Option != NewEnvironment {
			return true, menu.useEnvironment(offered[indexOf(options, selection.Option)])
		}
		if err := menu.newEnvironment(); !errors.Is(err, errBack) {
			return true, err
		}
	}
}

// inWorktree says whether the environment works in a worktree this launcher cuts.
func (menu *boot) inWorktree(environment Environment) bool {
	return filepath.Dir(environment.Folder) == (Worktrees{Root: menu.request.Root}).Folder()
}

// badges are the facts shown after an environment's name: whether an agent works in it and whether it is a worktree.
func (menu *boot) badges(environment Environment) []string {
	badges := []string{}
	if environment.Working {
		badges = append(badges, "working")
	}
	if menu.inWorktree(environment) {
		badges = append(badges, "worktree")
	}
	return badges
}

// discard asks before an environment is deleted with everything recorded in it; an environment with an agent at work is
// never deleted. The left arrow keeps it.
func (menu *boot) discard(environment Environment) error {
	if environment.Working {
		_, err := menu.query(Question{Title: environment.Name + " has an agent working", Warning: true, Notes: []string{"Stop that agent first."}, Options: []string{BackToEnvironments}})
		return ignoringBack(err)
	}
	notes := []string{"Everything recorded in it goes with it: tasks, messages, plans, memory, the record. This cannot be undone."}
	if menu.inWorktree(environment) {
		notes = append(notes, "Its worktree folder and its branch stay.")
	}
	selection, err := menu.query(Question{Title: "Delete " + environment.Name + "?", Warning: true, Notes: notes, Options: []string{KeepEnvironment, DiscardEnvironment}, Default: KeepEnvironment})
	if err != nil || selection.Option != DiscardEnvironment {
		return ignoringBack(err)
	}
	return menu.journal.DeleteEnvironment(environment)
}

func ignoringBack(err error) error {
	if errors.Is(err, errBack) {
		return nil
	}
	return err
}

func (menu *boot) newEnvironment() error {
	name, err := menu.query(Question{Title: NameQuestion})
	if err != nil {
		return err
	}
	branch, err := menu.query(Question{Title: BranchQuestion})
	if err != nil {
		return err
	}
	environment := Environment{Name: name.Option, Folder: menu.request.Root, Branch: branch.Option, Suite: menu.choice.Suite}
	if err := menu.journal.MakeEnvironment(environment); err != nil {
		return err
	}
	return menu.useEnvironment(environment)
}

func (menu *boot) useEnvironment(environment Environment) error {
	menu.choice.Environment, menu.choice.Folder = environment.Name, environment.Folder
	menu.mainRunning = environment.Working
	if !menu.inWorktree(environment) {
		return nil
	}
	worktrees := Worktrees{Root: menu.request.Root}
	folder, created, err := menu.cut(worktrees, filepath.Base(environment.Folder))
	if err != nil || !created {
		return err
	}
	return menu.journal.PrepareWorktree(folder, menu.request.Root, environment.Name)
}

// cut cuts the launch worktree when it is missing and says whether it was cut now, so the journal can then give it the
// project's library folders and run the worktree commands of its environment.
func (menu *boot) cut(worktrees Worktrees, name string) (string, bool, error) {
	_, missing := os.Stat(filepath.Join(worktrees.Folder(), name))
	folder, err := worktrees.Prepare(name)
	return folder, err == nil && os.IsNotExist(missing), err
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
	name = UnusedName(name, working)
	folder, created, err := menu.cut(worktrees, name)
	if err != nil {
		return err
	}
	if indexOf(names, name) < 0 {
		environment := Environment{Name: name, Folder: folder, Branch: BranchPrefix + name, Suite: menu.choice.Suite}
		if err := menu.journal.MakeEnvironment(environment); err != nil {
			return err
		}
	}
	menu.choice.Environment, menu.choice.Folder = name, folder
	if !created {
		return nil
	}
	return menu.journal.PrepareWorktree(folder, menu.request.Root, name)
}

// running asks before a second main agent starts in an environment: one environment has one main agent.
func (menu *boot) running() (bool, error) {
	menu.stopsMain = false
	if !menu.mainRunning {
		return false, nil
	}
	answer, err := menu.answer(Question{Title: RunningQuestion, Warning: true, Notes: []string{"One environment has one main agent. Stopping it ends its row."}, Options: []string{StopRunning, LeaveRunning}})
	if err != nil {
		return true, err
	}
	if answer == LeaveRunning {
		return true, ErrLeftRunning
	}
	menu.stopsMain = true
	return true, nil
}

func (menu *boot) conversation() (bool, error) {
	if named := menu.request.NamedSession(); named != "" {
		menu.choice.Session = named
		return true, nil
	}
	conversations, err := menu.journal.Conversations(menu.choice.Environment, menu.request.Program)
	if err != nil {
		return false, err
	}
	if menu.request.Program == ClaudeProgram {
		home, _ := os.UserHomeDir()
		conversations = OpenFirst(ClaudeTranscripts{Home: home}.Titled(menu.choice.Folder, conversations), conversations)
	} else {
		conversations = limited(conversations)
	}
	options, sessions, currentAt := []string{}, map[string]string{}, time.Now()
	for _, conversation := range conversations {
		label := conversation.Label(currentAt)
		options, sessions[label] = append(options, label), conversation.Session
	}
	answer, err := menu.answer(Question{Title: ConversationQuestion, Notes: []string{"Carrying on opens an earlier conversation of this environment again."}, Options: append(options, FreshConversation), ApartLast: true})
	menu.choice.Session = sessions[answer]
	return true, err
}

func (menu *boot) prompts() (bool, error) {
	answer, err := menu.answer(Question{Title: PromptQuestion, Notes: []string{"Skipping them lets " + capitalised(menu.request.Program) + " run without stopping to ask before each tool call."}, Options: []string{AskPrompts, SkipPrompts}})
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

// NamedSession is the conversation the person named with --resume <session> (or --resume=<session>) after the
// program's name; that one is resumed, and the menu does not ask which conversation to carry on.
func (request Request) NamedSession() string {
	for index, argument := range request.ProgramArguments {
		if value, found := strings.CutPrefix(argument, ResumeFlag+"="); found {
			return value
		}
		if argument == ResumeFlag && index+1 < len(request.ProgramArguments) {
			return request.ProgramArguments[index+1]
		}
	}
	return ""
}

// ArgumentsBesideSession are the program arguments without the --resume the menu's choice already carries, so the
// program is never handed two sessions.
func (request Request) ArgumentsBesideSession() []string {
	kept := []string{}
	for index := 0; index < len(request.ProgramArguments); index++ {
		argument := request.ProgramArguments[index]
		if strings.HasPrefix(argument, ResumeFlag+"=") {
			continue
		}
		if argument == ResumeFlag {
			index++
			continue
		}
		kept = append(kept, argument)
	}
	return kept
}

// ResumeFlag is the flag a person names a conversation with on the command line.
const ResumeFlag = "--resume"

// OpenFirst keeps the journal's first conversation, the one of the main agent still open, at the top after the
// transcripts are sorted by their last write, so Continue never lands on an older agent that merely ran later.
func OpenFirst(titled, listed []Conversation) []Conversation {
	if len(listed) == 0 {
		return titled
	}
	for index, conversation := range titled {
		if conversation.Session != listed[0].Session {
			continue
		}
		return append([]Conversation{conversation}, append(append([]Conversation{}, titled[:index]...), titled[index+1:]...)...)
	}
	return titled
}
