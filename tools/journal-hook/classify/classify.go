package classify

import (
	"regexp"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

var (
	// the commands a line runs in a substitution: $(...), `...` and <(...)
	substitutions = regexp.MustCompile("\\$\\(([^()]*)\\)|`([^`]*)`|<\\(([^()]*)\\)")
	// a make or CI variable written as $(NAME), which names a value and runs nothing
	variableReference = regexp.MustCompile(`^[A-Z_][A-Z0-9_]*\z`)
)

var (
	execFlags       = map[string]bool{"-exec": true, "-execdir": true, "-ok": true}
	execEnds        = map[string]bool{";": true, `\;`: true, "+": true}
	sshValueFlags   = map[string]bool{"-p": true, "-i": true, "-o": true, "-l": true, "-F": true, "-J": true, "-L": true, "-R": true, "-D": true, "-W": true, "-b": true, "-c": true, "-E": true, "-m": true, "-O": true, "-Q": true, "-S": true, "-w": true}
	journalPrograms = map[string]bool{"journal": true, "journal.sh": true, "journal.py": true}
)

// innerLines are the programs that run a command line of their own and how each hands it over: sh -c '<line>',
// eval <line>, find -exec <line> ;, ssh host '<line>'.
var innerLines = map[string]func([]string) []string{
	"sh": scriptLines, "bash": scriptLines, "zsh": scriptLines, "eval": joinedLines, "find": executedLines, "ssh": remoteLines,
}

// Classify is version 4's CommandClassifier.classify: a part by each command of its pipe or its || alternatives.
func (classifier *Classifier) Classify(text string) Classification {
	var classifications []Classification
	for _, piped := range commands(text) {
		classifications = append(classifications, classifier.classifyCommand(piped))
	}
	return Union(classifications)
}

// ClassifyLine is classify_line: a line by each of its parts.
func (classifier *Classifier) ClassifyLine(line string) Classification {
	parts, _, err := shell.Split(line)
	if err != nil {
		return classifier.Classify(pyre.Strip(line))
	}
	var classifications []Classification
	for _, part := range parts {
		classifications = append(classifications, classifier.Classify(part.Text))
	}
	return Union(classifications)
}

func (classifier *Classifier) classifyCommand(text string) Classification {
	if isSubshell(text) || groupPattern.MatchString(text) {
		content := []rune(pyre.Strip(text))
		return classifier.ClassifyLine(string(content[1 : len(content)-1]))
	}
	if loopPattern.MatchString(text) {
		var looped []string
		for _, command := range shapeCommands(text) {
			if inner := classifier.shapeInner(command); inner != "" {
				looped = append(looped, inner)
			}
		}
		if len(looped) != 1 || looped[0] != text {
			var classifications []Classification
			for _, command := range looped {
				classifications = append(classifications, classifier.Classify(command))
			}
			return classifier.redirected(Union(classifications), text)
		}
	}
	return Union(append([]Classification{classifier.programClassification(text)}, classifier.innerClassifications(text)...))
}

func (classifier *Classifier) programClassification(text string) Classification {
	row := classifier.row(classifier.tokens(text))
	if row == nil {
		return classifier.redirected(newClassification(), text)
	}
	return interpreted(classifier.redirected(classifier.rowClassification(text), text), row, text)
}

// redirected adds a file written when a redirect of the command writes one.
func (classifier *Classifier) redirected(classification Classification, text string) Classification {
	if len(classifier.redirectTargets(text)) > 0 {
		return classification.withEffect(writesFiles)
	}
	return classification
}

// interpreted makes code handed to an interpreter a write, and uncertain, when the line carries a sign of writing.
func interpreted(classification Classification, row *Row, text string) Classification {
	if row.Interpreted && writeMarkers.MatchString(text) {
		changed := classification.withEffect(writesFiles)
		changed.Uncertain = true
		return changed
	}
	return classification
}

// innerClassifications are the classifications of the lines a command runs inside it: its substitutions and the line
// a shell, eval, find or ssh is handed.
func (classifier *Classifier) innerClassifications(text string) []Classification {
	var classifications []Classification
	for _, groups := range substitutions.FindAllStringSubmatch(unexpanded(text), -1) {
		body := ""
		for _, group := range groups[1:] {
			if group == "" {
				continue
			}
			body = group
			break
		}
		if body != "" && !variableReference.MatchString(pyre.Strip(body)) {
			classifications = append(classifications, classifier.ClassifyLine(body))
		}
	}
	tokens := classifier.tokens(text)
	if len(tokens) == 0 {
		return classifications
	}
	if lines := innerLines[baseName(tokens[0])]; lines != nil {
		for _, line := range lines(tokens[1:]) {
			if line == "" {
				continue
			}
			classifications = append(classifications, classifier.ClassifyLine(line))
		}
	}
	return classifications
}

func scriptLines(tokens []string) []string {
	for index, token := range tokens {
		if token != "-c" {
			continue
		}
		return tokens[index+1 : min(index+2, len(tokens))]
	}
	return nil
}

func joinedLines(tokens []string) []string {
	return []string{strings.Join(tokens, " ")}
}

func executedLines(tokens []string) []string {
	var lines []string
	for index, token := range tokens {
		if !execFlags[token] {
			continue
		}
		lines = append(lines, strings.Join(executed(tokens[index+1:]), " "))
	}
	return lines
}

func executed(tokens []string) []string {
	for index, token := range tokens {
		if !execEnds[token] {
			continue
		}
		return tokens[:index]
	}
	return tokens
}

func remoteLines(tokens []string) []string {
	position := 0
	for position < len(tokens) && strings.HasPrefix(tokens[position], "-") {
		if sshValueFlags[tokens[position]] {
			position += 2
		} else {
			position++
		}
	}
	return []string{strings.Join(tokens[min(position+1, len(tokens)):], " ")}
}

// isJournal is Chain.is_journal: a part whose first word is the journal's own command.
func isJournal(text string) bool {
	items := strings.FieldsFunc(text, pyre.IsSpace)
	return len(items) > 0 && journalPrograms[baseName(items[0])]
}
