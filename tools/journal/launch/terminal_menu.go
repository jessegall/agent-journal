package launch

import (
	"regexp"
	"strconv"
	"strings"
)

// The keys a menu takes.
const (
	MenuKeyUp     = "\x1b[A"
	MenuKeyDown   = "\x1b[B"
	MenuKeyEnter  = "\r"
	MenuKeyEscape = "\x1b"
)

// menuQuestionLines is how many lines above a menu's options are kept as its question.
const menuQuestionLines = 6

var (
	terminalCodes  = regexp.MustCompile(`\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|[\x00-\x08\x0b-\x1f\x7f]`)
	menuOption     = regexp.MustCompile(`(?m)^[ \t\x{00a0}]*([❯›>])?[ \t\x{00a0}]*(\d{1,2})[.)][ \t\x{00a0}]+(\S.*?)[ \t\x{00a0}]*$`)
	menuFooter     = regexp.MustCompile(`(?i)Enter to (?:select|confirm|continue)|Esc to (?:cancel|exit|go back)|↑/↓|to navigate|press enter`)
	trustQuestion  = regexp.MustCompile(`(?i)\btrust\b`)
	ownQuestion    = regexp.MustCompile(`(?i)do you want to (?:proceed|make|create)|would you like to run|allow command|approve`)
	pastList       = regexp.MustCompile(`(?i)\(current\)|rewind|restore|resume|checkpoint`)
	acceptingLabel = regexp.MustCompile(`(?i)^(?:yes|trust|i am using|continue|ok)\b`)
	decliningLabel = regexp.MustCompile(`(?i)^(?:no\b|don't|do not|decline|deny|skip|not now|later|cancel|never|reject|disable)`)
)

// MenuOption is one numbered line of a menu, and whether the cursor stands on it.
type MenuOption struct {
	Number int
	Label  string
	Cursor bool
}

// TerminalMenu is a menu in an agent's terminal, known by its shape: option lines numbered in a row from one, with the
// cursor on one of them or the selection footer below them. A numbered list in the agent's own text has neither.
type TerminalMenu struct {
	Question string
	Options  []MenuOption
}

// PlainTerminalText is the terminal's bytes as text: escape codes and control bytes gone, carriage returns kept as line
// ends.
func PlainTerminalText(raw string) string {
	return terminalCodes.ReplaceAllString(strings.NewReplacer("\r\n", "\n", "\r", "\n").Replace(raw), "")
}

// ReadTerminalMenu finds the last menu on the screen's bytes, or nil with none.
func ReadTerminalMenu(screen string) *TerminalMenu {
	text := PlainTerminalText(screen)
	menuText, hasFooter := text, false
	if footers := menuFooter.FindAllStringIndex(text, -1); len(footers) > 0 {
		menuText, hasFooter = text[:footers[len(footers)-1][0]], true
	}
	matches := menuOption.FindAllStringSubmatchIndex(menuText, -1)
	options := []MenuOption{}
	start := 0
	for index := len(matches) - 1; index >= 0; index-- {
		match := matches[index]
		number, _ := strconv.Atoi(menuText[match[4]:match[5]])
		if len(options) > 0 && number != options[0].Number-1 {
			break
		}
		cursor := match[2] >= 0
		options = append([]MenuOption{{number, menuText[match[6]:match[7]], cursor}}, options...)
		start = match[0]
	}
	if len(options) < 2 || options[0].Number != 1 {
		return nil
	}
	if !hasFooter && !hasPointer(menuText, matches[len(matches)-len(options):]) {
		return nil
	}
	return &TerminalMenu{questionAbove(menuText[:start]), options}
}

// hasPointer says whether one of the option lines holds a cursor that a quoted line of text could not: > starts a quote.
func hasPointer(text string, matches [][]int) bool {
	for _, match := range matches {
		if match[2] >= 0 && text[match[2]:match[3]] != ">" {
			return true
		}
	}
	return false
}

func questionAbove(text string) string {
	lines := []string{}
	for _, line := range strings.Split(text, "\n") {
		if trimmed := strings.TrimSpace(line); trimmed != "" {
			lines = append(lines, trimmed)
		}
	}
	if len(lines) > menuQuestionLines {
		lines = lines[len(lines)-menuQuestionLines:]
	}
	return strings.Join(lines, " ")
}

// Foreign says whether the menu is the program's own: not a permission question the agent's tool asks, nor a list of
// past messages, sessions or checkpoints a person opened.
func (menu *TerminalMenu) Foreign() bool {
	labels := []string{menu.Question}
	for _, option := range menu.Options {
		labels = append(labels, option.Label)
	}
	return !ownQuestion.MatchString(menu.Question) && !pastList.MatchString(strings.Join(labels, " "))
}

// Signature tells this menu from another.
func (menu *TerminalMenu) Signature() string {
	question := menu.Question
	if len(question) > 200 {
		question = question[len(question)-200:]
	}
	parts := []string{question}
	for _, option := range menu.Options {
		parts = append(parts, option.Label)
	}
	return strings.Join(parts, "\n")
}

// Accepting is the option that says yes, or else the one under the cursor.
func (menu *TerminalMenu) Accepting() MenuOption {
	for _, option := range menu.Options {
		if acceptingLabel.MatchString(option.Label) {
			return option
		}
	}
	for _, option := range menu.Options {
		if option.Cursor {
			return option
		}
	}
	return menu.Options[0]
}

// Declining is the option that says no, if there is one.
func (menu *TerminalMenu) Declining() (MenuOption, bool) {
	for _, option := range menu.Options {
		if decliningLabel.MatchString(option.Label) {
			return option, true
		}
	}
	return MenuOption{}, false
}

// Confirming says whether the menu asks yes or no.
func (menu *TerminalMenu) Confirming() bool {
	_, declines := menu.Declining()
	return declines && acceptingLabel.MatchString(menu.Accepting().Label)
}

// Trusting says whether the menu asks to trust the folder the journal launched the agent in.
func (menu *TerminalMenu) Trusting() bool {
	return trustQuestion.MatchString(menu.Question)
}

// KeysFor is the arrow keys from the option under the cursor to the one taken, then Enter.
func (menu *TerminalMenu) KeysFor(target MenuOption) string {
	cursorIndex, targetIndex := 0, 0
	for index, option := range menu.Options {
		if option.Cursor {
			cursorIndex = index
		}
		if option.Number == target.Number {
			targetIndex = index
		}
	}
	if targetIndex >= cursorIndex {
		return strings.Repeat(MenuKeyDown, targetIndex-cursorIndex) + MenuKeyEnter
	}
	return strings.Repeat(MenuKeyUp, cursorIndex-targetIndex) + MenuKeyEnter
}
