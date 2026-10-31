package classify

import (
	"maps"
	"regexp"
	"slices"
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
		if first := slices.IndexFunc(tokens[1:], isNotFlag); first >= 0 {
			script = tokens[1+first]
		}
	}
	if scriptRow := classifier.table.Script(script); scriptRow != nil {
		return scriptRow
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
		var child *Row
		word := ""
		if len(arguments) == 0 {
			child, word = subcommand(rows[len(rows)-1], token)
		}
		if child == nil {
			arguments = append(arguments, token)
		} else {
			rows = append(rows, child)
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
	spellings := []string{token, strings.Trim(token, `'"`), baseName(token), colon, space}
	listed := slices.IndexFunc(spellings, func(word string) bool { return row.Subcommands[word] != nil })
	if listed < 0 {
		return nil, ""
	}
	return row.Subcommands[spellings[listed]], spellings[listed]
}

func isNotFlag(token string) bool {
	return !strings.HasPrefix(token, "-")
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
	if labelled := lastIndex(rows, func(level *Row) bool { return level.Label != "" }); labelled >= 0 {
		label = rows[labelled].Label
	}
	if len(rows) == 1 && len(arguments) == 0 && row.BareLabel != "" {
		label = row.BareLabel
	}
	classification := Classification{Category: unknown, Effects: []string{}, Label: label}
	categorised := lastIndex(rows, func(level *Row) bool { return level.Category != "" || level == row })
	classification = classification.withRow(rows[categorised])
	modifiers := map[string]*Row{}
	for _, level := range rows {
		maps.Copy(modifiers, level.Modifiers)
	}
	for _, token := range tokens[1:] {
		if isNotFlag(token) {
			continue
		}
		classification = modified(classification, modifiers, token)
	}
	return classification
}

// lastIndex is the index of the last row that matches, or -1.
func lastIndex(rows []*Row, matches func(*Row) bool) int {
	for index := len(rows) - 1; index >= 0; index-- {
		if !matches(rows[index]) {
			continue
		}
		return index
	}
	return -1
}

func modified(classification Classification, modifiers map[string]*Row, flag string) Classification {
	for _, name := range flagNames(flag) {
		modifier, present := modifiers[name]
		if !present {
			continue
		}
		label := modifier.Label
		if label == "" {
			label = classification.Label
		}
		classification = classification.withRow(modifier)
		classification.Label = label
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
		if !unicode.IsLetter(letter) {
			continue
		}
		names = append(names, "-"+string(letter))
	}
	return names
}

// isAlphanumeric is Python's str.isalnum.
func isAlphanumeric(characters []rune) bool {
	for _, character := range characters {
		if unicode.IsLetter(character) || unicode.IsNumber(character) {
			continue
		}
		return false
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
	_, _, items := classifier.walked(row, tokens[1:])
	remainingWords := []string{}
	for _, word := range items {
		if word == "" || strings.HasPrefix(word, "<") || strings.HasPrefix(word, "|") {
			continue
		}
		remainingWords = append(remainingWords, word)
	}
	return remainingWords
}

// redirectTargets are the files a command's redirects write.
func (classifier *Classifier) redirectTargets(text string) []string {
	targets := []string{}
	for _, redirect := range classifier.table.redirection.FindAllStringSubmatch(blanked(text), -1) {
		if !classifier.table.RedirectWrites(redirect[2], redirect[3]) {
			continue
		}
		targets = append(targets, strings.Trim(redirect[3], "'"))
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
	for _, quoted := range quotedPath.FindAllStringSubmatch(text, -1) {
		paths = append(paths, quoted[1])
	}
	for _, word := range classifier.arguments(text) {
		if !strings.Contains(word, "/") {
			continue
		}
		paths = append(paths, word)
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
			if path == "" {
				continue
			}
			paths = append(paths, path)
		}
	}
	return paths
}

// ReadPaths are the files a part prints: the arguments of each command of its pipe whose row prints files.
func (classifier *Classifier) ReadPaths(text string) []string {
	paths := []string{}
	for _, piped := range commands(text) {
		if !classifier.rowClassification(piped).has(printsFiles) {
			continue
		}
		paths = append(paths, classifier.arguments(piped)...)
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
		_, items, _ := classifier.walked(row, tokens[1:])
		subcommand = strings.Join(items, " ")
	}
	return baseName(tokens[0]), subcommand, tokens[1:]
}
