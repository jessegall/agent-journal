package classify

import (
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
)

// The parts of version 4's CommandShape a loop's classification reads: a loop or branch is classified by the commands
// inside it, with the shell's own words, headers, captured values, assignments, wrappers and container runs taken off.
// Python's $ matches before a final newline too, so it is written \n?\z where that can matter.
var (
	loopPattern      = pyre.Compile(`^\s*(?:while|until|for|if|case|select)\s`)
	controlPattern   = pyre.Compile(`^\s*(?:(?:while|until|if|elif|then|else|do|!)\s+)+`)
	headerPattern    = pyre.Compile(`^\s*(?:(?:done|fi|esac|;;)\b.*|(?:for|select|case)\s.*)\n?\z`)
	capturePattern   = pyre.Compile(`^\s*[A-Za-z_][A-Za-z0-9_]*=\$\((.*)\)\s*\n?\z`)
	variablePattern  = pyre.Compile(`^\s*(?:[A-Za-z_][A-Za-z0-9_]*=(?:'[^']*'|"[^"]*"|\S*)(?:\s+|\n?\z))+`)
	containerPattern = pyre.Compile(`^\s*docker(?:\s+compose|-compose)?\s+exec\s+(?:(?:-[euw]|--(?:env|env-file|user|workdir))[ =]\S+\s+|-{1,2}[\w-]+\s+)*\S+\s+`)
	gitStart         = pyre.Compile(`^\s*git`)
	gitOption        = pyre.Compile(`^(?:\s+(?:-C|-c|--git-dir|--work-tree)\s+\S+|\s+--no-pager)`)
	shellWord        = pyre.Compile(`(?:'[^']*'|"(?:\\.|[^"\\])*"|[^\s'"])+`)
	branchSwitch     = pyre.Compile(`^git\s+(?:checkout|switch)\b`)
	chainSeparator   = regexp.MustCompile(`&&|\|\||;|\|`)
	groupPattern     = pyre.Compile(`(?s)^\s*\{.*\}\s*\z`)
)

// Commands that only set the scene for the one that does the work.
var setupCommands = map[string]bool{"cd": true, "export": true, "unset": true, "set": true, "source": true, ".": true, "pushd": true, "popd": true, "true": true, "mkdir": true, "read": true, "rm": true}

// The separators CommandShape.commands cuts a text at outside quotes.
var shapeSeparators = []string{"&&", "||", ";", "|"}

// shapeCommands is CommandShape.commands: the text cut at &&, ||, ; and | outside quotes.
func shapeCommands(text string) []string {
	var found []string
	var command strings.Builder
	openQuote := rune(0)
	characters := []rune(text)
	for index := 0; index < len(characters); {
		separator := ""
		if openQuote == 0 {
			rest := string(characters[index:])
			for _, symbol := range shapeSeparators {
				if strings.HasPrefix(rest, symbol) {
					separator = symbol
					break
				}
			}
		}
		if separator != "" {
			found = append(found, command.String())
			command.Reset()
			index += len(separator)
			continue
		}
		character := characters[index]
		switch {
		case character == openQuote:
			openQuote = 0
		case openQuote == 0 && (character == '\'' || character == '"'):
			openQuote = character
		}
		command.WriteRune(character)
		index++
	}
	found = append(found, command.String())
	kept := []string{}
	for _, each := range found {
		if stripped := pyre.Strip(each); stripped != "" {
			kept = append(kept, stripped)
		}
	}
	return kept
}

func isSetup(command string) bool {
	words := strings.FieldsFunc(command, pyre.IsSpace)
	return len(words) > 0 && setupCommands[words[0]] || branchSwitch.MatchString(command)
}

// pastSetup is the first command of a chain that is not setup, else its first.
func pastSetup(chain string) string {
	var commands []string
	for _, each := range chainSeparator.Split(chain, -1) {
		if stripped := pyre.Strip(each); stripped != "" {
			commands = append(commands, stripped)
		}
	}
	for _, command := range commands {
		if !isSetup(command) {
			return command
		}
	}
	if len(commands) > 0 {
		return commands[0]
	}
	return chain
}

// shapeInner is CommandShape.inner: the command a loop's or a branch's line runs, or nothing for its own words.
func (classifier *Classifier) shapeInner(part string) string {
	unlooped := replaceFirst(controlPattern, part, "")
	if headerPattern.MatchString(unlooped) {
		return ""
	}
	command := unlooped
	if captured := capturePattern.FindStringSubmatch(unlooped); captured != nil {
		command = pastSetup(captured[1])
	}
	return withoutGitOptions(replaceFirst(containerPattern, classifier.unwrappedAll(replaceFirst(variablePattern, command, "")), ""))
}

// unwrappedAll cuts the wrappers a run's shape is named past from the command as it was written.
func (classifier *Classifier) unwrappedAll(command string) string {
	spans := shellWord.FindAllStringIndex(command, -1)
	tokens := make([]string, len(spans))
	for index, span := range spans {
		tokens[index] = strings.Trim(command[span[0]:span[1]], `'"`)
	}
	remaining := classifier.table.ShapeUnwrapped(tokens)
	if len(remaining) > 0 && len(remaining) < len(tokens) {
		return command[spans[len(tokens)-len(remaining)][0]:]
	}
	return command
}

// withoutGitOptions is GIT_OPTION_PATTERN.sub: git's own options before its subcommand taken off, as far as a space
// follows them, which Python's look-ahead asks and Go's patterns cannot.
func withoutGitOptions(command string) string {
	start := gitStart.FindStringIndex(command)
	if start == nil {
		return command
	}
	position, kept := start[1], -1
	for {
		option := gitOption.FindStringIndex(command[position:])
		if option == nil {
			break
		}
		position += option[1]
		if position < len(command) && pyre.IsSpace([]rune(command[position:])[0]) {
			kept = position
		}
	}
	if kept < 0 {
		return command
	}
	return command[:start[1]] + command[kept:]
}

func replaceFirst(pattern *regexp.Regexp, text, replacement string) string {
	found := pattern.FindStringIndex(text)
	if found == nil {
		return text
	}
	return text[:found[0]] + replacement + text[found[1]:]
}
