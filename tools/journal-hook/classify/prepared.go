package classify

import (
	"bytes"
	_ "embed"
	"encoding/gob"
	"regexp"
)

//go:generate go run ./gen

// The shipped table as the release built it, written by go generate; empty until the first generate.
//
//go:embed command_table.gob
var preparedBytes []byte

// preparedForm is a table with its parts written out in the form the program decodes, so it needs no JSON parse and
// no merge at start.
type preparedForm struct {
	Version             int
	Programs            map[string]*Row
	Wrappers            map[string]*Wrapper
	ScriptPatterns      []string
	ScriptRows          []*Row
	RedirectOperators   map[string]bool
	RedirectTargetsKept map[string]bool
	Redirection         string
}

// EncodedShipped is the shipped table in the form go generate writes to command_table.gob.
func EncodedShipped() []byte {
	table := builtTable("")
	form := preparedForm{Version: table.Version, Programs: table.Programs, Wrappers: table.Wrappers,
		RedirectOperators: table.redirectOperators, RedirectTargetsKept: table.redirectTargetsKept, Redirection: table.redirection.String()}
	for _, script := range table.scripts {
		form.ScriptPatterns = append(form.ScriptPatterns, script.pattern.String())
		form.ScriptRows = append(form.ScriptRows, script.row)
	}
	var encoded bytes.Buffer
	if err := gob.NewEncoder(&encoded).Encode(form); err != nil {
		panic("the shipped command table does not encode: " + err.Error())
	}
	return encoded.Bytes()
}

// preparedShipped is the table decoded from the release's form, or nil when the release built none.
func preparedShipped() *Table {
	var form preparedForm
	if len(preparedBytes) == 0 || gob.NewDecoder(bytes.NewReader(preparedBytes)).Decode(&form) != nil {
		return nil
	}
	table := &Table{Version: form.Version, Programs: form.Programs, Wrappers: form.Wrappers,
		redirectOperators: form.RedirectOperators, redirectTargetsKept: form.RedirectTargetsKept, redirection: regexp.MustCompile(form.Redirection)}
	for index, pattern := range form.ScriptPatterns {
		table.scripts = append(table.scripts, scriptRow{regexp.MustCompile(pattern), form.ScriptRows[index]})
	}
	return table
}
