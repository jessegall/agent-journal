package store

// ItemType is one sort of item: its name on the wire, its table, the fields it carries and the fields a search reads.
type ItemType struct {
	Name   string
	Table  string
	Fields []string
	Search []string
}

// Kinds lists what this server holds. All SQL is built from it with bound values, and table names only come from it.
var Kinds = []ItemType{
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

// KindByName finds the kind a name on the wire stands for.
func KindByName(name string) (ItemType, bool) {
	for _, kind := range Kinds {
		if kind.Name == name {
			return kind, true
		}
	}
	return ItemType{}, false
}
