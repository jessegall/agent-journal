package launch

import (
	"errors"
	"strings"
)

// errBack is what a question gives when the person pressed the left arrow to go back to the one before.
var errBack = errors.New("back to the question before")

// Question is one question of the boot menu: a list to pick from, or a line of text to type.
type Question struct {
	Title   string
	Options []string
	Default string
}

// Answer draws a question and reads keys until the person picks an option or types a line; the left arrow goes back.
func Answer(terminal Terminal, question Question) (string, error) {
	if len(question.Options) == 0 {
		return askText(terminal, question)
	}
	cursor := 0
	for index, option := range question.Options {
		if option == question.Default {
			cursor = index
		}
	}
	for {
		terminal.Draw(optionText(question, cursor))
		press, err := terminal.Read()
		if err != nil {
			return "", err
		}
		switch press.Key {
		case KeyEnter:
			return question.Options[cursor], nil
		case KeyLeft:
			return "", errBack
		case KeyUp:
			cursor = (cursor + len(question.Options) - 1) % len(question.Options)
		case KeyDown:
			cursor = (cursor + 1) % len(question.Options)
		}
	}
}

func askText(terminal Terminal, question Question) (string, error) {
	text := []rune(question.Default)
	for {
		terminal.Draw(question.Title + "\r\n> " + string(text))
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
		case KeyBackspace:
			if len(text) > 0 {
				text = text[:len(text)-1]
			}
		case KeyRune:
			text = append(text, press.Rune)
		}
	}
}

func optionText(question Question, cursor int) string {
	lines := []string{question.Title}
	for index, option := range question.Options {
		marker := "  "
		if index == cursor {
			marker = "> "
		}
		lines = append(lines, marker+option)
	}
	return strings.Join(append(lines, "", "enter picks, the left arrow goes back"), "\r\n")
}
