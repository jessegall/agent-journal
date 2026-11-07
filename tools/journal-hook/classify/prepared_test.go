package classify

import (
	"reflect"
	"testing"
)

// equalValues compares two values as the table reads them: an empty map or slice and a missing one are the same.
func equalValues(first, second reflect.Value) bool {
	switch first.Kind() {
	case reflect.Pointer:
		if first.IsNil() || second.IsNil() {
			return first.IsNil() == second.IsNil()
		}
		return equalValues(first.Elem(), second.Elem())
	case reflect.Map:
		if first.Len() != second.Len() {
			return false
		}
		for _, key := range first.MapKeys() {
			second_entry := second.MapIndex(key)
			if !second_entry.IsValid() || !equalValues(first.MapIndex(key), second_entry) {
				return false
			}
		}
		return true
	case reflect.Slice:
		if first.Len() != second.Len() {
			return false
		}
		for index := 0; index < first.Len(); index++ {
			if !equalValues(first.Index(index), second.Index(index)) {
				return false
			}
		}
		return true
	case reflect.Struct:
		for index := 0; index < first.NumField(); index++ {
			if !equalValues(first.Field(index), second.Field(index)) {
				return false
			}
		}
		return true
	}
	return first.Interface() == second.Interface()
}

func TestTheTableBuiltAtReleaseIsTheTableFile(t *testing.T) {
	built, prepared := builtTable(""), preparedShipped()
	if prepared == nil {
		t.Fatal("command_table.gob is empty: run go generate ./classify")
	}
	form := func(table *Table) preparedForm {
		var flattened preparedForm
		for _, script := range table.scripts {
			flattened.ScriptPatterns = append(flattened.ScriptPatterns, script.pattern.String())
			flattened.ScriptRows = append(flattened.ScriptRows, script.row)
		}
		flattened.Version, flattened.Programs, flattened.Wrappers = table.Version, table.Programs, table.Wrappers
		flattened.RedirectOperators, flattened.RedirectTargetsKept, flattened.Redirection = table.redirectOperators, table.redirectTargetsKept, table.redirection.String()
		return flattened
	}
	if !equalValues(reflect.ValueOf(form(built)), reflect.ValueOf(form(prepared))) {
		t.Fatal("command_table.gob differs from command_table.json: run go generate ./classify")
	}
}
