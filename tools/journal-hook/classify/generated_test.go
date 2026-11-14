package classify

import (
	"encoding/json"
	"math/rand/v2"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"sort"
	"strings"
	"testing"

	"github.com/jessegall/agent-journal/tools/journal-hook/internal/pyre"
)

// The commands generated from version 4's forms fixture, as its tests/generated_commands.py generates them: a chain
// shape or a single part, each part a form whose optional pieces are kept or dropped and whose slots are filled with
// generated values. Python's random numbers cannot be drawn in Go, so the seeded sample is Go's own.
const generatedCommands = 500

// The values each slot kind is filled with, version 4's scripts/splitter_fixture.py VALUES.
var slotValues = map[string][]string{
	"word": {"alpha", "beta", "main", "status"}, "path": {"src/app/main.py", "docs/notes.md", "build/out", "tests/test_app.py"},
	"pattern": {"'TODO'", `"def run"`, "'^import'", "error"}, "number": {"3", "20", "100"}, "text": {"'a short note'", `"two words"`},
	"glob": {"'*.py'", "src/*.js"}, "string": {"'hello'", `"value"`}, "variable": {"$NAME", `"$HOME"`, "${COUNT}"},
	"code": {"'print(1)'", `"import sys; print(sys.path)"`}, "file": {"notes.txt", "out.log"}, "assignment": {"NAME=value", "COUNT=2"},
	"substitution": {"$(pwd)", `"$(date +%s)"`}, "branch": {"feature-x", "main"}, "revision": {"HEAD~1", "abc1234"}, "empty": {"''"},
	"url": {"https://example.com/api", "http://localhost:3000/"}, "version": {"1.2.3"}, "test name": {"test_app.py::test_runs"},
	"range": {"1,20p", "HEAD~3..HEAD"}, "address": {"127.0.0.1"}, "date": {"2.weeks.ago"}, "number range": {"1-5"},
	"json": {`'{"a": 1}'`}, "duration": {"30s"}, "stdin": {"-"}, "email": {"someone@example.com"},
}

var (
	optionalPiece = regexp.MustCompile(`\[([^\]]*)\]`)
	slot          = regexp.MustCompile(`<([^>]+)>`)
	// an option of a form, not inside a word or a slot: version 4's OPTION, whose look-behind is checked by hand
	formOption = pyre.Compile(`--?[A-Za-z][\w-]*`)
)

type generatedForm struct {
	Program    string `json:"program"`
	Subcommand string `json:"subcommand"`
	Form       string `json:"form"`
}

type formsFixture struct {
	Forms  []generatedForm `json:"forms"`
	Chains [][]string      `json:"chains"`
}

// rawRows reads a section of the table as rows of JSON values.
type rawRows map[string]map[string]json.RawMessage

func resolvedRow(rows map[string]json.RawMessage, name string) map[string]json.RawMessage {
	var row map[string]json.RawMessage
	_ = json.Unmarshal(rows[name], &row)
	var alias string
	if json.Unmarshal(row["same_as"], &alias) == nil {
		return resolvedRow(rows, alias)
	}
	return row
}

func sectionOf(row map[string]json.RawMessage, key string) map[string]json.RawMessage {
	var section map[string]json.RawMessage
	_ = json.Unmarshal(row[key], &section)
	return section
}

// formClassification is version 4's classified(): the classification a form gives from the table, its program's base,
// its subcommands and its options' modifiers applied; a wrapper's form says nothing of its own.
func formClassification(table map[string]json.RawMessage, form generatedForm) (Classification, bool) {
	items := strings.Fields(form.Form)[1:]
	var wrappers, programs map[string]json.RawMessage
	_ = json.Unmarshal(table["wrappers"], &wrappers)
	_ = json.Unmarshal(table["programs"], &programs)
	if wrapper := resolvedRow(wrappers, form.Program); len(wrapper) > 0 {
		subcommands := stringsOf(wrapper["subcommands"])
		if len(subcommands) == 0 {
			return Classification{}, true
		}
		for _, subcommand := range subcommands {
			if !hasWords(items, strings.Fields(subcommand)) {
				continue
			}
			return Classification{}, true
		}
	}
	row := resolvedRow(programs, form.Program)
	if len(row) == 0 {
		return Classification{Category: unknown, Effects: []string{}}, false
	}
	base := row
	if raw, present := row["base"]; present {
		base = nil
		_ = json.Unmarshal(raw, &base)
	}
	levels, current := []map[string]json.RawMessage{base}, row
	for _, word := range items {
		if strings.HasPrefix(word, "-") || strings.HasPrefix(word, "<") || strings.HasPrefix(word, "[") || strings.HasPrefix(word, "(") {
			continue
		}
		child := resolvedRow(sectionOf(current, "subcommands"), word)
		if len(child) == 0 {
			break
		}
		levels, current = append(levels, child), child
	}
	categoryLevel := 0
	for index := len(levels) - 1; index >= 0; index-- {
		if _, present := levels[index]["kind"]; present || index == 0 {
			categoryLevel = index
			break
		}
	}
	expected := Classification{Category: textOf(levels[categoryLevel]["kind"]), Effects: []string{}}
	if expected.Category == "" {
		expected.Category = unknown
	}
	for _, level := range levels[categoryLevel:] {
		expected.Effects = append(expected.Effects, stringsOf(level["effects"])...)
		expected.Uncertain = expected.Uncertain || boolOf(level["uncertain"])
	}
	modifiers := map[string]json.RawMessage{}
	for _, level := range append([]map[string]json.RawMessage{row}, levels[1:]...) {
		for name, modifier := range sectionOf(level, "modifiers") {
			modifiers[name] = modifier
		}
	}
	for _, option := range formOptions(form.Form) {
		modifier := resolvedRow(modifiers, option)
		if raw, present := modifier["kind"]; present {
			expected.Effects = stringsOf(modifier["effects"])
			expected.Category = textOf(raw)
		} else {
			expected.Effects = append(expected.Effects, stringsOf(modifier["effects"])...)
		}
		expected.Uncertain = expected.Uncertain || boolOf(modifier["uncertain"])
	}
	expected.Effects = sortedUnique(expected.Effects)
	return expected, false
}

// formOptions are the options a form names, each not right after a word character or a slot's <.
func formOptions(form string) []string {
	var options []string
	for searchStart := 0; searchStart < len(form); {
		span := formOption.FindStringIndex(form[searchStart:])
		if span == nil {
			break
		}
		start, end := searchStart+span[0], searchStart+span[1]
		if start > 0 && (pyre.IsWord(rune(form[start-1])) || form[start-1] == '<') {
			searchStart = start + 1
			continue
		}
		options = append(options, form[start:end])
		searchStart = end
	}
	return options
}

// filledForm is version 4's filled(): each optional piece kept six times in ten, each slot given a value of its kind.
func filledForm(form string, random *rand.Rand) string {
	optional := optionalPiece.ReplaceAllStringFunc(form, func(bracketed string) string {
		if random.Float64() < 0.6 {
			return bracketed[1 : len(bracketed)-1]
		}
		return ""
	})
	filled := slot.ReplaceAllStringFunc(optional, func(slotText string) string {
		values, present := slotValues[slotText[1:len(slotText)-1]]
		if !present {
			values = []string{"value"}
		}
		return values[random.IntN(len(values))]
	})
	return strings.Join(strings.Fields(filled), " ")
}

type generatedCommand struct {
	text     string
	expected Classification
}

func generated(t *testing.T, seed uint64, count int) []generatedCommand {
	var fixture formsFixture
	text, err := os.ReadFile(filepath.Join("..", "testdata", "version4", "generated_forms.json"))
	if err != nil || json.Unmarshal(text, &fixture) != nil {
		t.Fatalf("generated_forms.json does not read: %v", err)
	}
	var table map[string]json.RawMessage
	_ = json.Unmarshal(shippedTable, &table)
	var forms []generatedForm
	expectations := map[string]Classification{}
	for _, form := range fixture.Forms {
		if classification, wrapper := formClassification(table, form); !wrapper {
			forms = append(forms, form)
			expectations[form.Form] = classification
		}
	}
	random := rand.New(rand.NewPCG(seed, seed))
	var commands []generatedCommand
	for range count {
		shape := []string{"PART"}
		if random.Float64() < 0.5 {
			shape = fixture.Chains[random.IntN(len(fixture.Chains))]
		}
		var items []string
		var classifications []Classification
		for _, token := range shape {
			if token != "PART" {
				items = append(items, token)
				continue
			}
			form := forms[random.IntN(len(forms))]
			items = append(items, filledForm(form.Form, random))
			classifications = append(classifications, expectations[form.Form])
		}
		commands = append(commands, generatedCommand{strings.Join(items, " "), Union(classifications)})
	}
	return commands
}

// Every generated command is classified as its forms say, but for the ones in generated_differences.json, where the
// reading differs from the forms with a reason recorded.
func TestGeneratedCommandsAreClassifiedAsTheirFormsSay(t *testing.T) {
	var frozen map[string]string
	text, err := os.ReadFile(filepath.Join("..", "testdata", "version4", "generated_differences.json"))
	if err != nil || json.Unmarshal(text, &frozen) != nil {
		t.Fatalf("generated_differences.json does not read: %v", err)
	}
	differences := map[string]string{}
	for _, command := range generated(t, 7, generatedCommands) {
		actual := shippedClassifier.ClassifyLine(command.text)
		want := command.expected
		if actual.Category != want.Category || !reflect.DeepEqual(nonNil(actual.Effects), nonNil(want.Effects)) || actual.Uncertain != want.Uncertain {
			differences[command.text] = describe(actual) + " where the forms say " + describe(want)
		}
	}
	var lines []string
	for line, difference := range differences {
		if _, present := frozen[line]; !present {
			lines = append(lines, line+"\n   "+difference)
		}
	}
	sort.Strings(lines)
	for _, line := range lines {
		t.Errorf("read otherwise than its forms say: %s", line)
	}
	for line := range frozen {
		if _, present := differences[line]; !present {
			t.Errorf("a known difference is read as its forms say now; take it out of generated_differences.json: %s", line)
		}
	}
	t.Logf("%d of %d generated commands differ from their forms, %d of them known", len(differences), generatedCommands, len(frozen))
}

func describe(classification Classification) string {
	text := classification.Category + " " + strings.Join(classification.Effects, ",")
	if classification.Uncertain {
		text += " uncertain"
	}
	return text
}

func nonNil(items []string) []string {
	if items == nil {
		return []string{}
	}
	return items
}
