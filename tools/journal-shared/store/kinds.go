package store

// Kind is one sort of item: its name on the wire, its table, the fields it carries and the fields a search reads.
type Kind struct {
	Name   string
	Table  string
	Fields []string
	Search []string
}

// Kinds lists what this server holds. All SQL is built from it with bound values, and table names only come from it.
var Kinds = []Kind{
	{Name: "doc", Table: "docs", Fields: []string{"title", "abstract", "body"}, Search: []string{"title", "abstract", "body"}},
	{Name: "sequence", Table: "sequences", Fields: []string{"title", "steps", "step_guards"}, Search: []string{"title", "steps"}},
	{Name: "check", Table: "checks", Fields: []string{"title", "command", "brief", "interval_minutes"}, Search: []string{"title", "brief", "command"}},
}

// KindNames lists the wire name of each kind.
func KindNames() []string {
	names := make([]string, len(Kinds))
	for index, kind := range Kinds {
		names[index] = kind.Name
	}
	return names
}
