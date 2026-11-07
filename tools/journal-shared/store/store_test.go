package store

import (
	"slices"
	"testing"
)

func openIn(t *testing.T, folder string) *Store {
	t.Helper()
	opened, err := Open(folder)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { opened.Close() })
	return opened
}

func columnsOf(t *testing.T, opened *Store, table string) []string {
	t.Helper()
	rows, err := opened.DB.Query("SELECT name FROM pragma_table_info(?)", table)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()
	var columns []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			t.Fatal(err)
		}
		columns = append(columns, name)
	}
	return columns
}

func countOf(t *testing.T, opened *Store, query string) int {
	t.Helper()
	var count int
	if err := opened.DB.QueryRow(query).Scan(&count); err != nil {
		t.Fatal(err)
	}
	return count
}

func TestOpenRunsTheMigrationsOnAnEmptyFile(t *testing.T) {
	opened := openIn(t, t.TempDir())
	for _, table := range []string{"server", "users", "tokens", "docs", "sequences", "checks", "item_versions"} {
		if len(columnsOf(t, opened, table)) == 0 {
			t.Errorf("table %s was not made", table)
		}
	}
	if count := countOf(t, opened, "SELECT count(*) FROM migrations WHERE name = '001_tables.sql'"); count != 1 {
		t.Errorf("001_tables.sql is recorded %d times", count)
	}
	var mode string
	if err := opened.DB.QueryRow("PRAGMA journal_mode").Scan(&mode); err != nil || mode != "wal" {
		t.Errorf("journal mode %q, error %v", mode, err)
	}
}

func TestOpenOnAnExistingFileKeepsItsRowsAndRunsNothingTwice(t *testing.T) {
	folder := t.TempDir()
	first := openIn(t, folder)
	if _, err := first.DB.Exec("UPDATE server SET server_key = 'b3f1c9d2', name = 'Acme library'"); err != nil {
		t.Fatal(err)
	}
	first.Close()
	second := openIn(t, folder)
	if second.ServerKey != "b3f1c9d2" || second.ServerName != "Acme library" {
		t.Errorf("the server was made anew: %s %s", second.ServerKey, second.ServerName)
	}
	if count := countOf(t, second, "SELECT count(*) FROM server"); count != 1 {
		t.Errorf("%d server rows", count)
	}
	if count := countOf(t, second, "SELECT count(*) FROM migrations"); count != 1 {
		t.Errorf("%d migrations are recorded", count)
	}
}

func TestEachItemTableCarriesTheFieldsOfItsKind(t *testing.T) {
	opened := openIn(t, t.TempDir())
	for _, kind := range Kinds {
		columns := columnsOf(t, opened, kind.Table)
		for _, field := range slices.Concat(kind.Fields, kind.Search) {
			if !slices.Contains(columns, field) {
				t.Errorf("table %s has no column %s", kind.Table, field)
			}
		}
		for _, column := range []string{"creator_id", "removed_at", "version", "metadata", "created_at", "updated_at"} {
			if !slices.Contains(columns, column) {
				t.Errorf("table %s has no column %s", kind.Table, column)
			}
		}
	}
}

func TestNoTableCarriesWhatTheServerDoesNotHold(t *testing.T) {
	opened := openIn(t, t.TempDir())
	if slices.Contains(columnsOf(t, opened, "sequences"), "triggers") {
		t.Error("a sequence has a triggers column")
	}
	if slices.Contains(columnsOf(t, opened, "users"), "password") {
		t.Error("a user has a password column")
	}
	if slices.Contains(columnsOf(t, opened, "checks"), "stopped") {
		t.Error("a check has a stopped column")
	}
}

func TestTheItemTablesNeverUseANumberTwice(t *testing.T) {
	opened := openIn(t, t.TempDir())
	for _, kind := range Kinds {
		query := "SELECT count(*) FROM sqlite_master WHERE name = '" + kind.Table + "' AND sql LIKE '%AUTOINCREMENT%'"
		if countOf(t, opened, query) != 1 {
			t.Errorf("table %s has no AUTOINCREMENT", kind.Table)
		}
	}
}
