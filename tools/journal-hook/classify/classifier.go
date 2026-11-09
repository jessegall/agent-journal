package classify

import (
	"encoding/json"
	"maps"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"unicode"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
	"github.com/jessegall/agent-journal/tools/journal-hook/shell"
)

// What code handed to an interpreter does when it writes a file, which no table row can tell.
var writeMarkers = regexp.MustCompile(`write_text|write_bytes|open\([^)]*["'][wax]|\.write\(|unlink|os\.remove|shutil\.|os\.rename|\.rename\(|mkdir|writeFileSync|writeFile\(|fs\.write|File\.(write|open|delete)|rm_rf|\.truncate\(`)

// sedCommandStart is where a sed command starts in a script, with the lines it is addressed to.
const sedCommandStart = `(^|[;{'"\s])(\d+(,(\d+|\$))?|\$|/[^/]*/)?`

// sedWritingFlags ends a sed substitution whose flags write its result or run it.
const sedWritingFlags = `[a-zA-Z0-9]*[we]([\s;}'"]|$)`

// What writes, or runs another program, in an awk or sed script. Each language has its own, since a pattern in a
// script is often the very word the other markers look for.
var scriptWriteMarkers = map[string]*regexp.Regexp{
	"awk": regexp.MustCompile(`system\(|printf?[^;}]*(>|\|)\s*"|\|\s*getline`),
	"sed": regexp.MustCompile(sedCommandStart + `([wWe]\s+[^\s'"]|s/[^/]*/[^/]*/` + sedWritingFlags + `|s\|[^|]*\|[^|]*\|` + sedWritingFlags + `|s#[^#]*#[^#]*#` + sedWritingFlags + `|s,[^,]*,[^,]*,` + sedWritingFlags + `)`),
}

// A path written in quotes in code handed to an interpreter, which the code may write.
var quotedPath = regexp.MustCompile(`['"]([^'"\s]*/[^'"\s]*)['"]`)

// Classifier reads commands against a command table, as version 4's CommandClassifier.
type Classifier struct {
	table       *Table
	projectFile string
	aliasLines  map[string]string
	// savedCommands names the aliases registered as tests and builds, and savedCommandsKnown says the list was read.
	savedCommands      []string
	savedCommandsKnown bool
	// savedRuns are the saved commands of the line being read.
	savedRuns []savedRun
	// aliasCategories are the category of each alias that has one, and categorisedRuns those the line being read runs.
	aliasCategories map[string]string
	categorisedRuns []categorisedRun
	// commandTypes are the types agents gave commands by their leading words.
	commandTypes map[string]string
}

func NewClassifier(table *Table) *Classifier {
	return &Classifier{table: table}
}

// ClassifierOf reads the table at the classifier's first use, so a hook that classifies no command never loads it.
func ClassifierOf(projectFile string) *Classifier {
	return &Classifier{projectFile: projectFile}
}

func (classifier *Classifier) loaded() *Table {
	if classifier.table == nil {
		classifier.table = LoadTable(classifier.projectFile)
	}
	return classifier.table
}

// aliasFileName is the file in the journal's runtime folder that names the shell line of each alias.
const aliasFileName = "aliases.json"

// aliasLine is the shell line of the alias a journal command runs: journal <alias> [arguments]. The file is read at
// the first journal command, so a hook that classifies none never loads it.
func (classifier *Classifier) aliasLine(text string) (string, bool) {
	items := strings.FieldsFunc(text, pyre.IsSpace)
	if len(items) < 2 || !journalPrograms[baseName(items[0])] {
		return "", false
	}
	line, exists := classifier.aliases()[items[1]]
	return line, exists
}

func (classifier *Classifier) aliases() map[string]string {
	if classifier.aliasLines == nil {
		classifier.aliasLines = readNamedTexts(filepath.Join(filepath.Dir(classifier.projectFile), "runtime", aliasFileName))
	}
	return classifier.aliasLines
}

// aliasCategoryFileName is the file that names the category of each alias that has one.
const aliasCategoryFileName = "alias-categories.json"

// aliasCategory is the category an alias was saved with, read once per hook.
func (classifier *Classifier) aliasCategory(name string) string {
	if classifier.aliasCategories == nil {
		classifier.aliasCategories = readNamedTexts(filepath.Join(filepath.Dir(classifier.projectFile), "runtime", aliasCategoryFileName))
	}
	return classifier.aliasCategories[name]
}

// commandTypeFileName is the file that names the type agents gave commands the table does not know, by their leading
// words.
const commandTypeFileName = "command-types.json"

// commandType is the type of the longest leading words an agent classified that the command's words start with.
func (classifier *Classifier) commandType(text string) string {
	if classifier.commandTypes == nil {
		classifier.commandTypes = readNamedTexts(filepath.Join(filepath.Dir(classifier.projectFile), "runtime", commandTypeFileName))
	}
	tokens, commandType, longest := classifier.tokens(text), "", 0
	for prefixText, category := range classifier.commandTypes {
		prefixTokens := shell.Tokens(prefixText)
		if len(prefixTokens) > longest && len(prefixTokens) <= len(tokens) && slices.Equal(tokens[:len(prefixTokens)], prefixTokens) {
			commandType, longest = category, len(prefixTokens)
		}
	}
	return commandType
}

// savedCommandFileName is the file that names the aliases registered as a project's tests and builds.
const savedCommandFileName = "saved-commands.json"

// isSaved says an alias is a saved command. The list is read once, and an unread file leaves the mark off the line, so
// a missing file never refuses a test.
func (classifier *Classifier) isSaved(name string) bool {
	if classifier.savedCommands == nil {
		classifier.savedCommands = []string{}
		text, err := os.ReadFile(filepath.Join(filepath.Dir(classifier.projectFile), "runtime", savedCommandFileName))
		classifier.savedCommandsKnown = err == nil && json.Unmarshal(text, &classifier.savedCommands) == nil
	}
	return slices.Contains(classifier.savedCommands, name)
}

func readNamedTexts(path string) map[string]string {
	lines := map[string]string{}
	if text, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(text, &lines)
	}
	return lines
}

// tokens are a command's words with its wrappers taken off.
func (classifier *Classifier) tokens(text string) []string {
	return classifier.loaded().Unwrapped(shell.Tokens(text))
}

// row is the table row of a command's program, or of the script an interpreter or the command itself runs.
func (classifier *Classifier) row(tokens []string) *Row {
	if len(tokens) == 0 {
		return nil
	}
	row := classifier.loaded().Programs[baseName(tokens[0])]
	script := tokens[0]
	if row != nil && row.Interpreted {
		script = ""
		if first := slices.IndexFunc(tokens[1:], isNotFlag); first >= 0 {
			script = tokens[1+first]
		}
	}
	if scriptRow := classifier.loaded().Script(script); scriptRow != nil {
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

// subcommand is the row below a row a word names: the word, unquoted, its last path piece, before a colon, after the
// last colon as in app:test, or its first word; or the row of a glob the word after the last colon matches.
func subcommand(row *Row, token string) (*Row, string) {
	space := strings.SplitN(token, " ", 2)[0]
	colon := strings.SplitN(token, ":", 2)[0]
	lastColon := token[strings.LastIndex(token, ":")+1:]
	spellings := []string{token, strings.Trim(token, `'"`), baseName(token), colon, lastColon, space}
	listed := slices.IndexFunc(spellings, func(word string) bool { return row.Subcommands[word] != nil })
	if listed >= 0 {
		return row.Subcommands[spellings[listed]], spellings[listed]
	}
	for glob, child := range row.SubcommandGlobs {
		if matched, _ := path.Match(glob, lastColon); matched {
			return child, lastColon
		}
	}
	return nil, ""
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
	tokens := classifier.tokens(classifier.loaded().redirection.ReplaceAllLiteralString(blanked(firstLine), " "))
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
	for _, redirect := range classifier.loaded().redirection.FindAllStringSubmatch(blanked(withoutClosedHeredocs(text)), -1) {
		if !classifier.loaded().RedirectWrites(redirect[2], redirect[3]) {
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
	return row != nil && row.carriesWriteSign(text)
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
	if lines := innerLines[baseName(tokens[0])]; lines != nil && isTestOrBuild(classifier.Classify(text).Category) {
		for _, line := range lines(tokens[1:]) {
			for _, part := range classifier.Line(line).Parts {
				if isTestOrBuild(part.Classification.Category) {
					return part.Program, part.Subcommand, part.Arguments
				}
			}
		}
	}
	if row := classifier.row(tokens); row != nil {
		_, items, _ := classifier.walked(row, tokens[1:])
		subcommand = strings.Join(items, " ")
	}
	return baseName(tokens[0]), subcommand, tokens[1:]
}
