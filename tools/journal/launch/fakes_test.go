package launch

import (
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

// fakeTerminal plays the keys a story presses and keeps every screen it was screenText.
type fakeTerminal struct {
	presses []Press
	screens []string
}

func (terminal *fakeTerminal) Read() (Press, error) {
	if len(terminal.presses) == 0 {
		return Press{}, ErrNoInput
	}
	press := terminal.presses[0]
	terminal.presses = terminal.presses[1:]
	return press, nil
}

func (terminal *fakeTerminal) Draw(text string) {
	terminal.screens = append(terminal.screens, text)
}

func (terminal *fakeTerminal) screenText() string {
	return strings.Join(terminal.screens, "\n")
}

func keys(presses ...Press) *fakeTerminal {
	return &fakeTerminal{presses: presses}
}

func textPresses(text string) []Press {
	presses := make([]Press, 0, len(text)+1)
	for _, character := range text {
		presses = append(presses, Press{Key: KeyRune, Rune: character})
	}
	return append(presses, enterPress)
}

var (
	enterPress = Press{Key: KeyEnter}
	downPress  = Press{Key: KeyDown}
	backPress  = Press{Key: KeyLeft}
)

// fakeJournal answers the launcher's questions to the journal from rows a story sets, and keeps what it was asked to make.
type fakeJournal struct {
	suites        []string
	environments  []Environment
	conversations []Conversation
	created       []Environment
}

func (journal *fakeJournal) Suites() ([]string, error) { return journal.suites, nil }

func (journal *fakeJournal) Environments() ([]Environment, error) { return journal.environments, nil }

func (journal *fakeJournal) Conversations(environment, program string) ([]Conversation, error) {
	return journal.conversations, nil
}

func (journal *fakeJournal) MakeEnvironment(environment Environment) error {
	journal.created = append(journal.created, environment)
	journal.environments = append(journal.environments, environment)
	return nil
}

// gitRepository makes a git repository with one commit in a story's own folder.
func gitRepository(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	run(t, root, "git", "init", "--initial-branch", "main")
	run(t, root, "git", "-c", "user.name=Story", "-c", "user.email=story@example.com", "commit", "--allow-empty", "-m", "The first commit")
	return root
}

func run(t *testing.T, folder string, program string, arguments ...string) string {
	t.Helper()
	command := exec.Command(program, arguments...)
	command.Dir = folder
	command.Env = []string{"GIT_CONFIG_GLOBAL=/dev/null", "GIT_CONFIG_NOSYSTEM=1", "PATH=/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin", "HOME=" + folder}
	output, err := command.CombinedOutput()
	if err != nil {
		t.Fatalf("%s %v failed: %v %s", program, arguments, err, output)
	}
	return strings.TrimSpace(string(output))
}

func worktreeFolder(root, name string) string {
	return filepath.Join(root, ".claude", "worktrees", name)
}
