package launch

import (
	"errors"
	"fmt"
	"strings"
	"unicode"
	"unicode/utf8"
)

// errBack is what a question gives when the person pressed the left arrow to go back to the one before.
var errBack = errors.New("back to the question before")

// ErrLeft is what a question gives when the person pressed Escape or Ctrl+C to leave without starting.
var ErrLeft = errors.New("Left without starting the journal.")

const (
	pickHint = "↑ ↓ to move · Enter to pick · ← to go back · a number to jump · Esc to leave"
	textHint = "Enter to confirm · ← to go back · Esc to leave"
)

// Question is one question of the boot menu: a list to pick from, or a line of text to type. Header is drawn above it,
// Notes under its title, and Badges after the options they are keyed by. Actions are keys that act on the option under the
// cursor instead of picking it, each with the words that tell the person of it. The last option is set apart by a
// blank line when ApartLast is set.
type Question struct {
	Title     string
	Header    string
	Notes     []string
	Options   []string
	Badges    map[string][]string
	Actions   map[rune]string
	ApartLast bool
	Warning   bool
	Default   string
}

// Selection is the option a person chose, or the option under the cursor when an action key was pressed, with that key.
type Selection struct {
	Option string
	Action rune
}

// Answer draws a question and reads keys until the person picks an option or types a line; the left arrow goes back.
func Answer(terminal Terminal, question Question) (string, error) {
	selection, err := Choose(terminal, question)
	return selection.Option, err
}

// Choose is Answer with the action key the person pressed, if one.
func Choose(terminal Terminal, question Question) (Selection, error) {
	if len(question.Options) == 0 {
		text, err := askText(terminal, question)
		return Selection{Option: text}, err
	}
	cursor := 0
	for index, option := range question.Options {
		if option == question.Default {
			cursor = index
		}
	}
	for {
		terminal.Draw(optionText(terminal.Style(), question, cursor))
		press, err := terminal.Read()
		if err != nil {
			return Selection{}, err
		}
		switch press.Key {
		case KeyEnter:
			return Selection{Option: question.Options[cursor]}, nil
		case KeyLeft:
			return Selection{}, errBack
		case KeyEscape:
			return Selection{}, ErrLeft
		case KeyUp:
			cursor = (cursor + len(question.Options) - 1) % len(question.Options)
		case KeyDown:
			cursor = (cursor + 1) % len(question.Options)
		case KeyRune:
			if _, acts := question.Actions[press.Rune]; acts {
				return Selection{Option: question.Options[cursor], Action: press.Rune}, nil
			}
			if number := int(press.Rune - '0'); unicode.IsDigit(press.Rune) && number >= 1 && number <= len(question.Options) {
				cursor = number - 1
			}
		}
	}
}

func askText(terminal Terminal, question Question) (string, error) {
	text := []rune(question.Default)
	for {
		style := terminal.Style()
		body := []string{"  " + style.Accent("?") + " " + style.Bold(question.Title), "", "  " + style.Accent("›") + " " + string(text) + style.Accent("▌"), "", "  " + style.Dim(textHint)}
		terminal.Draw(screenText(style, question, body))
		press, err := terminal.Read()
		if err != nil {
			return "", err
		}
		switch press.Key {
		case KeyEnter:
			if len(text) > 0 {
				return string(text), nil
			}
		case KeyLeft:
			return "", errBack
		case KeyEscape:
			return "", ErrLeft
		case KeyBackspace:
			if len(text) > 0 {
				text = text[:len(text)-1]
			}
		case KeyRune:
			text = append(text, press.Rune)
		}
	}
}

func optionText(style Style, question Question, cursor int) string {
	title := style.Bold(question.Title)
	if question.Warning {
		title = style.Warn(question.Title)
	}
	lines := []string{"  " + style.Accent("?") + " " + title, ""}
	for _, note := range question.Notes {
		lines = append(lines, "    "+style.Dim(note))
	}
	if len(question.Notes) > 0 {
		lines = append(lines, "")
	}
	width := 0
	for _, option := range question.Options {
		width = max(width, utf8.RuneCountInString(option))
	}
	for index, option := range question.Options {
		if question.ApartLast && index == len(question.Options)-1 && index > 0 {
			lines = append(lines, "")
		}
		label, badges := option, ""
		for _, badge := range question.Badges[option] {
			badges += "  " + style.Badge(badge)
		}
		if badges != "" {
			label = fmt.Sprintf("%-*s", width, option)
		}
		if index == cursor {
			lines = append(lines, "  "+style.Accent("❯")+" "+style.Bold(label)+badges)
			continue
		}
		lines = append(lines, "    "+label+badges)
	}
	return screenText(style, question, append(lines, "", "  "+style.Dim(hintFor(question))))
}

// hintFor is the line of keys under a question, with the words of its actions at the end.
func hintFor(question Question) string {
	hints := []string{pickHint}
	for _, hint := range question.Actions {
		hints = append(hints, hint)
	}
	return strings.Join(hints, " · ")
}

// screenText is a question's header, then its lines each cut to the terminal's width.
func screenText(style Style, question Question, lines []string) string {
	fitted := []string{}
	for _, line := range lines {
		fitted = append(fitted, style.Fit(line))
	}
	if question.Header == "" {
		return strings.Join(fitted, "\r\n")
	}
	return question.Header + "\r\n" + strings.Join(fitted, "\r\n")
}
