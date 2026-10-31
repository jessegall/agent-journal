// Package classify reads what each command of a shell line is and does from the command table, as version 4's
// CommandClassifier does.
package classify

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"os"
	"regexp"
	"sort"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
)

// The command table version 4 ships, src/journal/support/command_table.json.
//
//go:embed command_table.json
var shippedTable []byte

// The sections of a project's own table whose rows are put over the shipped ones.
var projectSections = []string{"programs", "wrappers", "scripts"}

// The signs of the shell's own operators, which a word a wrapper hands on as its command never holds.
const operatorSigns = "<>|&;"

// Row is one row of the table: a program, a subcommand or an option.
type Row struct {
	Kind            string
	Effects         []string
	Uncertain       bool
	Interpreted     bool
	RunsScriptFile  bool
	StartsProcesses bool
	RedirectedLabel string
	Label           string
	BareLabel       string
	Subcommands     map[string]*Row
	Modifiers       map[string]*Row
	ValueFlags      map[string]bool
}

// Wrapper is a command that runs the command after it, as timeout or uv run do.
type Wrapper struct {
	Subcommands    []string
	ValueFlags     map[string]bool
	LeadingValues  int
	Assignments    bool
	OptionsEnd     string
	CodeContains   string
	LookupFlags    map[string]bool
	LimitsTime     bool
	ShapeSkipped   bool
	RunsScriptFile bool
	FollowsScripts bool
}

type scriptRow struct {
	pattern *regexp.Regexp
	row     *Row
}

// Table is the shipped command table with the project's own table merged over it.
type Table struct {
	Version             int
	Programs            map[string]*Row
	Wrappers            map[string]*Wrapper
	scripts             []scriptRow
	redirectOperators   map[string]bool
	redirectTargetsKept map[string]bool
	redirection         *regexp.Regexp
}

type rawTable struct {
	Version   int                        `json:"version"`
	Programs  map[string]json.RawMessage `json:"programs"`
	Wrappers  map[string]json.RawMessage `json:"wrappers"`
	Scripts   map[string]json.RawMessage `json:"scripts"`
	Redirects struct {
		Writes []string `json:"writes"`
		Except []string `json:"except"`
		Reads  []string `json:"reads"`
	} `json:"redirects"`
}

// LoadTable reads the shipped table and merges the project's own table at projectFile over it, when there is one
// that reads; a project table that does not read is left out, as version 4 leaves out one that breaks its schema.
func LoadTable(projectFile string) *Table {
	var shipped rawTable
	if err := json.Unmarshal(shippedTable, &shipped); err != nil {
		panic("the shipped command table does not read: " + err.Error())
	}
	scriptOrder := orderedKeys(shippedTable, "scripts")
	if text, err := os.ReadFile(projectFile); err == nil {
		var project rawTable
		if json.Unmarshal(text, &project) == nil {
			shipped.Programs = mergedRows(shipped.Programs, project.Programs)
			shipped.Wrappers = mergedRows(shipped.Wrappers, project.Wrappers)
			shipped.Scripts = mergedRows(shipped.Scripts, project.Scripts)
			for _, pattern := range orderedKeys(text, "scripts") {
				if !contains(scriptOrder, pattern) {
					scriptOrder = append(scriptOrder, pattern)
				}
			}
		}
	}
	table := &Table{
		Version:             shipped.Version,
		Programs:            map[string]*Row{},
		Wrappers:            map[string]*Wrapper{},
		redirectOperators:   set(shipped.Redirects.Writes),
		redirectTargetsKept: set(shipped.Redirects.Except),
	}
	for name := range shipped.Programs {
		table.Programs[name] = parsedRow(shipped.Programs, name)
	}
	for name := range shipped.Wrappers {
		table.Wrappers[name] = parsedWrapper(shipped.Wrappers, name)
	}
	for _, pattern := range scriptOrder {
		table.scripts = append(table.scripts, scriptRow{pyre.Compile(pattern), parsedRow(shipped.Scripts, pattern)})
	}
	operators := append(append([]string{}, shipped.Redirects.Writes...), shipped.Redirects.Reads...)
	operators = unique(operators)
	sort.SliceStable(operators, func(i, j int) bool { return len(operators[i]) > len(operators[j]) })
	quoted := make([]string, len(operators))
	for index, operator := range operators {
		quoted[index] = regexp.QuoteMeta(operator)
	}
	table.redirection = pyre.Compile(`(\d*)(` + strings.Join(quoted, "|") + `)\s*(&?[^\s;&|]+)`)
	return table
}

// mergedRows puts the project's rows over the shipped ones, a row of the same name replacing the shipped row.
func mergedRows(shipped, project map[string]json.RawMessage) map[string]json.RawMessage {
	merged := map[string]json.RawMessage{}
	for name, row := range shipped {
		merged[name] = row
	}
	for name, row := range project {
		merged[name] = row
	}
	return merged
}

// rowData is a row as the table writes it, its same_as followed.
func rowData(rows map[string]json.RawMessage, name string) map[string]json.RawMessage {
	var data map[string]json.RawMessage
	_ = json.Unmarshal(rows[name], &data)
	for {
		var other string
		if json.Unmarshal(data["same_as"], &other) != nil {
			return data
		}
		data = nil
		_ = json.Unmarshal(rows[other], &data)
	}
}

func parsedRow(rows map[string]json.RawMessage, name string) *Row {
	data := rowData(rows, name)
	base := data
	if raw, ok := data["base"]; ok {
		base = nil
		_ = json.Unmarshal(raw, &base)
	}
	row := &Row{Subcommands: map[string]*Row{}, Modifiers: map[string]*Row{}, ValueFlags: set(stringsOf(data["value_flags"]))}
	row.Kind = textOf(base["kind"])
	row.Effects = stringsOf(base["effects"])
	row.Uncertain = truthOf(base["uncertain"])
	row.Interpreted = truthOf(base["interpreted"])
	row.RunsScriptFile = truthOf(base["runs_script_file"])
	row.StartsProcesses = truthOf(base["starts_processes"])
	row.RedirectedLabel = textOf(base["redirected_label"])
	row.Label = textOf(base["label"])
	row.BareLabel = textOf(base["bare_label"])
	for section, into := range map[string]map[string]*Row{"subcommands": row.Subcommands, "modifiers": row.Modifiers} {
		var below map[string]json.RawMessage
		_ = json.Unmarshal(data[section], &below)
		for word := range below {
			into[word] = parsedRow(below, word)
		}
	}
	return row
}

func parsedWrapper(rows map[string]json.RawMessage, name string) *Wrapper {
	data := rowData(rows, name)
	leading := 0
	_ = json.Unmarshal(data["leading_values"], &leading)
	return &Wrapper{
		Subcommands:    stringsOf(data["subcommands"]),
		ValueFlags:     set(stringsOf(data["value_flags"])),
		LeadingValues:  leading,
		Assignments:    truthOf(data["assignments"]),
		OptionsEnd:     textOf(data["until"]),
		CodeContains:   textOf(data["code_contains"]),
		LookupFlags:    set(stringsOf(data["lookup_flags"])),
		LimitsTime:     truthOf(data["limits_time"]),
		ShapeSkipped:   truthOf(data["dropped_from_shape"]),
		RunsScriptFile: truthOf(data["runs_script_file"]),
		FollowsScripts: truthOf(data["may_follow_a_script"]),
	}
}

// RedirectWrites says a redirect writes a file: an operator that writes, to a target that is not a descriptor or one
// the table keeps, as /dev/null.
func (table *Table) RedirectWrites(operator, target string) bool {
	return table.redirectOperators[operator] && !table.redirectTargetsKept[target] && !strings.HasPrefix(target, "&")
}

// Script is the row of the first script pattern the word matches, or nil.
func (table *Table) Script(word string) *Row {
	for _, script := range table.scripts {
		if script.pattern.MatchString(word) {
			return script.row
		}
	}
	return nil
}

// Unwrapped takes the wrappers off the front of a command's words, as timeout 60 pytest is pytest.
func (table *Table) Unwrapped(tokens []string) []string {
	for len(tokens) > 0 {
		wrapper := table.Wrappers[baseName(tokens[0])]
		if wrapper == nil {
			return tokens
		}
		inner := leads(wrapper.Wrapped(tokens))
		if len(inner) == 0 || !isProgramWord(inner[0]) {
			return tokens
		}
		tokens = inner
	}
	return tokens
}

// TimeLimitRemoved takes off the front a wrapper that only limits the command's time.
func (table *Table) TimeLimitRemoved(tokens []string) []string {
	if len(tokens) == 0 {
		return tokens
	}
	if wrapper := table.Wrappers[baseName(tokens[0])]; wrapper != nil && wrapper.LimitsTime {
		if inner := wrapper.Wrapped(tokens); len(inner) > 0 {
			return inner
		}
	}
	return tokens
}

// ShapeUnwrapped takes off the wrappers a run's shape is named past, after a project script that may stand before one.
func (table *Table) ShapeUnwrapped(tokens []string) []string {
	if len(tokens) > 1 && strings.Contains(tokens[0], "/") {
		if follower := table.Wrappers[tokens[1]]; follower != nil && follower.FollowsScripts {
			tokens = tokens[1:]
		}
	}
	for len(tokens) > 0 {
		wrapper := table.Wrappers[baseName(tokens[0])]
		if wrapper == nil || !wrapper.ShapeSkipped {
			return tokens
		}
		inner := leads(wrapper.Wrapped(tokens))
		if len(inner) == 0 || strings.ContainsAny(inner[0], operatorSigns) {
			return tokens
		}
		tokens = inner
	}
	return tokens
}

func isProgramWord(word string) bool {
	return !strings.ContainsAny(word, operatorSigns) && !strings.HasPrefix(word, "$")
}

// Wrapped is the command the wrapper runs, or nothing when the words do not run one.
func (wrapper *Wrapper) Wrapped(tokens []string) []string {
	if len(tokens) > 1 && wrapper.LookupFlags[tokens[1]] {
		return nil
	}
	tokens = wrapper.pastOptions(tokens[1:])
	var matched []string
	for _, subcommand := range wrapper.Subcommands {
		split := strings.Fields(subcommand)
		if hasWords(tokens, split) {
			matched = split
			break
		}
	}
	if len(wrapper.Subcommands) > 0 && matched == nil {
		return nil
	}
	tokens = wrapper.pastOptions(tokens[len(matched):])
	if wrapper.OptionsEnd != "" {
		for index, token := range tokens {
			if token == wrapper.OptionsEnd {
				tokens = tokens[index+1:]
				break
			}
		}
	}
	for len(tokens) > 0 && wrapper.Assignments && strings.Contains(tokens[0], "=") {
		tokens = tokens[1:]
	}
	if wrapper.CodeContains != "" && !(len(tokens) > 0 && strings.Contains(tokens[0], wrapper.CodeContains)) {
		return nil
	}
	if wrapper.LeadingValues >= len(tokens) {
		return []string{}
	}
	return tokens[wrapper.LeadingValues:]
}

func (wrapper *Wrapper) isWrapperFlag(token string) bool {
	return strings.HasPrefix(token, "-") && token != wrapper.OptionsEnd && !contains(wrapper.Subcommands, token)
}

func (wrapper *Wrapper) pastOptions(tokens []string) []string {
	for len(tokens) > 0 && wrapper.isWrapperFlag(tokens[0]) {
		if wrapper.ValueFlags[tokens[0]] {
			tokens = tokens[min(2, len(tokens)):]
		} else {
			tokens = tokens[1:]
		}
	}
	return tokens
}

// leads is version 4's Part.leads: the words before the first that is not a NAME=value assignment left out.
func leads(tokens []string) []string {
	for len(tokens) > 0 && strings.Contains(tokens[0], "=") && !strings.HasPrefix(tokens[0], "-") {
		tokens = tokens[1:]
	}
	return tokens
}

// baseName is a word's last path piece, as word.rsplit("/", 1)[-1].
func baseName(word string) string {
	return word[strings.LastIndex(word, "/")+1:]
}

func hasWords(tokens, words []string) bool {
	if len(tokens) < len(words) {
		return false
	}
	for index, word := range words {
		if tokens[index] != word {
			return false
		}
	}
	return true
}

// orderedKeys gives the keys of one object of a JSON document in the order the document writes them.
func orderedKeys(document []byte, section string) []string {
	decoder := json.NewDecoder(bytes.NewReader(document))
	if token, err := decoder.Token(); err != nil || token != json.Delim('{') {
		return nil
	}
	for decoder.More() {
		key, _ := decoder.Token()
		if key != section {
			var skipped json.RawMessage
			_ = decoder.Decode(&skipped)
			continue
		}
		if token, err := decoder.Token(); err != nil || token != json.Delim('{') {
			return nil
		}
		var keys []string
		for decoder.More() {
			name, _ := decoder.Token()
			keys = append(keys, name.(string))
			var skipped json.RawMessage
			_ = decoder.Decode(&skipped)
		}
		return keys
	}
	return nil
}

func textOf(raw json.RawMessage) string {
	var text string
	_ = json.Unmarshal(raw, &text)
	return text
}

func stringsOf(raw json.RawMessage) []string {
	var texts []string
	_ = json.Unmarshal(raw, &texts)
	return texts
}

// truthOf is Python's bool() of a JSON value.
func truthOf(raw json.RawMessage) bool {
	var value any
	if json.Unmarshal(raw, &value) != nil {
		return false
	}
	switch value := value.(type) {
	case bool:
		return value
	case string:
		return value != ""
	case float64:
		return value != 0
	case []any:
		return len(value) > 0
	case map[string]any:
		return len(value) > 0
	}
	return false
}

func set(words []string) map[string]bool {
	found := map[string]bool{}
	for _, word := range words {
		found[word] = true
	}
	return found
}

func unique(words []string) []string {
	seen, kept := map[string]bool{}, []string{}
	for _, word := range words {
		if !seen[word] {
			seen[word] = true
			kept = append(kept, word)
		}
	}
	return kept
}

func contains(words []string, word string) bool {
	for _, each := range words {
		if each == word {
			return true
		}
	}
	return false
}
