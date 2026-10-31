package classify

import (
	"regexp"
	"strings"
	"unicode"

	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// What code handed to an interpreter does when it writes a file, which no table row can tell.
var writeMarkers = regexp.MustCompile(`write_text|write_bytes|open\([^)]*["'][wax]|\.write\(|unlink|os\.remove|shutil\.|os\.rename|\.rename\(|mkdir|writeFileSync|writeFile\(|fs\.write|File\.(write|open|delete)|rm_rf|\.truncate\(`)

// A path written in quotes in code handed to an interpreter, which the code may write.
var quotedPath = regexp.MustCompile(`['"]([^'"\s]*/[^'"\s]*)['"]`)

// Classifier reads commands against a command table, as version 4's CommandClassifier.
type Classifier struct {
	table *Table
}

func NewClassifier(table *Table) *Classifier {
	return &Classifier{table: table}
}

// tokens are a command's words with its wrappers taken off.
func (classifier *Classifier) tokens(text string) []string {
	return classifier.table.Unwrapped(shell.Tokens(text))
}

// row is the table row of a command's program, or of the script an interpreter or the command itself runs.
func (classifier *Classifier) row(tokens []string) *Row {
	if len(tokens) == 0 {
		return nil
	}
	row := classifier.table.Programs[baseName(tokens[0])]
	script := tokens[0]
	if row != nil && row.Interpreted {
		script = ""
		for _, token := range tokens[1:] {
			if !strings.HasPrefix(token, "-") {
				script = token
				break
			}
		}
	}
	if found := classifier.table.Script(script); found != nil {
		return found
	}
	return row
}

// walked follows a command's words down its row's subcommands: the rows it passed, the subcommand words that named
// them, and the words left as its arguments.
func (classifier *Classifier) walked(row *Row, tokens []string) (rows []*Row, subcommands []string, arguments []string) {
	rows = []*Row{row}
	isFlagValue := false
	for _, token := range tokens {
		if isFlagValue || row.ValueFlags[token] {
			isFlagValue = !isFlagValue && row.ValueFlags[token]
			continue
		}
		if strings.HasPrefix(token, "-") || strings.Contains(token, "=") {
			continue
		}
		var below *Row
		word := ""
		if len(arguments) == 0 {
			below, word = subcommand(rows[len(rows)-1], token)
		}
		if below == nil {
			arguments = append(arguments, token)
		} else {
			rows = append(rows, below)
			subcommands = append(subcommands, word)
		}
	}
	return rows, subcommands, arguments
}

// subcommand is the row below a row a word names: the word, unquoted, its last path piece, before a colon or its first
// word.
func subcommand(row *Row, token string) (*Row, string) {
	space := strings.SplitN(token, " ", 2)[0]
	colon := strings.SplitN(token, ":", 2)[0]
	for _, word := range []string{token, strings.Trim(token, `'"`), baseName(token), colon, space} {
		if below, ok := row.Subcommands[word]; ok {
			return below, word
		}
	}
	return nil, ""
}

// rowClassification is a command's classification from its row, its subcommands and the options it carries.
func (classifier *Classifier) rowClassification(text string) Classification {
	tokens := classifier.tokens(text)
	row := classifier.row(tokens)
	if row == nil {
		return newClassification()
	}
	rows, _, arguments := classifier.walked(row, tokens[1:])
	label := ""
	if len(rows) == 1 && len(arguments) == 0 && row.BareLabel != "" {
		label = row.BareLabel
	} else {
		for index := len(rows) - 1; index >= 0; index-- {
			if rows[index].Label != "" {
				label = rows[index].Label
				break
			}
		}
	}
	classification := Classification{Category: unknown, Effects: []string{}, Label: label}
	for index := len(rows) - 1; index >= 0; index-- {
		if rows[index].Category != "" || rows[index] == row {
			classification = classification.withRow(rows[index])
			break
		}
	}
	modifiers := map[string]*Row{}
	for _, level := range rows {
		for name, modifier := range level.Modifiers {
			modifiers[name] = modifier
		}
	}
	for _, token := range tokens[1:] {
		if strings.HasPrefix(token, "-") {
			classification = modified(classification, modifiers, token)
		}
	}
	return classification
}

func modified(classification Classification, modifiers map[string]*Row, flag string) Classification {
	for _, name := range flagNames(flag) {
		if modifier, ok := modifiers[name]; ok {
			label := modifier.Label
			if label == "" {
				label = classification.Label
			}
			classification = classification.withRow(modifier)
			classification.Label = label
		}
	}
	return classification
}

// flagNames are the names a flag is matched by: a long flag or a short one by its name, a bundle of short flags by
// itself and by each letter in it.
func flagNames(flag string) []string {
	name := strings.SplitN(flag, "=", 2)[0]
	characters := []rune(name)
	if strings.HasPrefix(flag, "--") || len(characters) <= 2 {
		return []string{name}
	}
	if !isAlphanumeric(characters[1:]) {
		return []string{name, string([]rune(flag)[:2])}
	}
	names := []string{name}
	for _, letter := range characters[1:] {
		if unicode.IsLetter(letter) {
			names = append(names, "-"+string(letter))
		}
	}
	return names
}

// isAlphanumeric is Python's str.isalnum.
func isAlphanumeric(characters []rune) bool {
	for _, character := range characters {
		if !unicode.IsLetter(character) && !unicode.IsNumber(character) {
			return false
		}
	}
	return len(characters) > 0
}

// arguments are the words of a command's first line its row leaves as arguments, quoted words and redirects left out.
func (classifier *Classifier) arguments(text string) []string {
	firstLine := strings.SplitN(text, "\n", 2)[0]
	tokens := classifier.tokens(classifier.table.redirection.ReplaceAllLiteralString(blanked(firstLine), " "))
	row := classifier.row(tokens)
	if row == nil {
		return []string{}
	}
	_, _, words := classifier.walked(row, tokens[1:])
	kept := []string{}
	for _, word := range words {
		if word != "" && !strings.HasPrefix(word, "<") && !strings.HasPrefix(word, "|") {
			kept = append(kept, word)
		}
	}
	return kept
}

// redirectTargets are the files a command's redirects write.
func (classifier *Classifier) redirectTargets(text string) []string {
	targets := []string{}
	for _, found := range classifier.table.redirection.FindAllStringSubmatch(blanked(text), -1) {
		if classifier.table.RedirectWrites(found[2], found[3]) {
			targets = append(targets, strings.Trim(found[3], "'"))
		}
	}
	return targets
}

// targetArguments are the arguments that name the files a command writes: those of an edit or a version control
// command that changes files, and the paths in code an interpreter is handed that writes.
func (classifier *Classifier) targetArguments(text string) []string {
	program := classifier.rowClassification(text)
	if program.IsWrite() {
		if namingCategories[program.Category] && (program.has(writesFiles) || program.has(deletesFiles)) {
			return classifier.arguments(text)
		}
		return []string{}
	}
	if !classifier.runsWritingCode(text) {
		return []string{}
	}
	var paths []string
	for _, found := range quotedPath.FindAllStringSubmatch(text, -1) {
		paths = append(paths, found[1])
	}
	for _, word := range classifier.arguments(text) {
		if strings.Contains(word, "/") {
			paths = append(paths, word)
		}
	}
	return paths
}

func (classifier *Classifier) runsWritingCode(text string) bool {
	row := classifier.row(classifier.tokens(text))
	return row != nil && row.Interpreted && writeMarkers.MatchString(text)
}

// WritePaths are the files a part writes: its redirects' targets and the arguments that name what it writes, for each
// command of its pipe.
func (classifier *Classifier) WritePaths(text string) []string {
	paths := []string{}
	for _, piped := range commands(text) {
		for _, path := range append(classifier.redirectTargets(piped), classifier.targetArguments(piped)...) {
			if path != "" {
				paths = append(paths, path)
			}
		}
	}
	return paths
}

// ReadPaths are the files a part prints: the arguments of each command of its pipe whose row prints files.
func (classifier *Classifier) ReadPaths(text string) []string {
	paths := []string{}
	for _, piped := range commands(text) {
		if classifier.rowClassification(piped).has(printsFiles) {
			paths = append(paths, classifier.arguments(piped)...)
		}
	}
	return paths
}

// Program, its subcommand words and its arguments, as the table reads a command once its wrappers are off.
func (classifier *Classifier) Program(text string) (program string, subcommand string, arguments []string) {
	tokens := classifier.tokens(text)
	if len(tokens) == 0 {
		return "", "", []string{}
	}
	if row := classifier.row(tokens); row != nil {
		_, words, _ := classifier.walked(row, tokens[1:])
		subcommand = strings.Join(words, " ")
	}
	return baseName(tokens[0]), subcommand, tokens[1:]
}
