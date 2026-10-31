package classify

import (
	"cmp"
	"encoding/json"
	"slices"
	"sort"
)

const (
	unknown         = "unknown"
	journalCategory = "journal"
	writesFiles     = "writes_files"
	deletesFiles    = "deletes_files"
	printsFiles     = "prints_files"
)

// CategoryOrder names a line by its heaviest part: a test run over the tee that keeps its log, an edit over a read, a
// journal command or a program the table does not know over a read. It is version 4's KIND_ORDER, kept in the table's
// category_order, the one place Go and Python both read it from.
var CategoryOrder = shippedCategoryOrder()

func shippedCategoryOrder() []string {
	var table struct {
		CategoryOrder []string `json:"category_order"`
	}
	if err := json.Unmarshal(shippedTable, &table); err != nil || len(table.CategoryOrder) == 0 {
		panic("the shipped command table names no category_order")
	}
	return table.CategoryOrder
}

// The categories whose words name the files they write, as rm build and sed -i s/a/b/ notes.txt do.
var namingCategories = map[string]bool{"edit": true, "version control": true}

// Classification is what a command is and does: its category, its effects, whether the line alone leaves it uncertain,
// and the activity it is shown as.
type Classification struct {
	Category  string
	Effects   []string
	Uncertain bool
	Label     string
}

func newClassification() Classification {
	return Classification{Category: unknown, Effects: []string{}}
}

func categoryRank(category string) int {
	if index := slices.Index(CategoryOrder, category); index >= 0 {
		return index
	}
	return len(CategoryOrder)
}

// Union is the classification of commands taken together: the heaviest category, every effect, uncertain when any is,
// and the label of the first command of that category that has one, else of any.
func Union(classifications []Classification) Classification {
	if len(classifications) == 0 {
		return newClassification()
	}
	category := slices.MinFunc(classifications, func(first, second Classification) int {
		return cmp.Compare(categoryRank(first.Category), categoryRank(second.Category))
	}).Category
	combined := Classification{Category: category}
	var effects []string
	for _, entry := range classifications {
		effects = append(effects, entry.Effects...)
		combined.Uncertain = combined.Uncertain || entry.Uncertain
	}
	combined.Effects = sortedUnique(effects)
	ordered := append([]Classification{}, classifications...)
	sort.SliceStable(ordered, func(i, j int) bool { return ordered[i].Category == category && ordered[j].Category != category })
	if labelled := slices.IndexFunc(ordered, func(entry Classification) bool { return entry.Label != "" }); labelled >= 0 {
		combined.Label = ordered[labelled].Label
	}
	return combined
}

// withRow is the classification a row gives: a row that names a category replaces the effects, one that names none adds
// to them.
func (classification Classification) withRow(row *Row) Classification {
	effects := row.Effects
	if row.Category == "" {
		effects = append(append([]string{}, classification.Effects...), row.Effects...)
	}
	changed := classification
	if row.Category != "" {
		changed.Category = row.Category
	}
	changed.Effects = sortedUnique(effects)
	changed.Uncertain = classification.Uncertain || row.Uncertain
	return changed
}

func (classification Classification) withEffect(effect string) Classification {
	changed := classification
	changed.Effects = sortedUnique(append(append([]string{}, classification.Effects...), effect))
	return changed
}

func (classification Classification) has(effect string) bool {
	return slices.Contains(classification.Effects, effect)
}

// IsWrite says the command changes files: not the journal's own, and it writes or deletes files or leaves its meaning
// uncertain.
func (classification Classification) IsWrite() bool {
	return classification.Category != journalCategory && (classification.has(writesFiles) || classification.has(deletesFiles) || classification.Uncertain)
}

func sortedUnique(items []string) []string {
	uniqueItems := unique(items)
	sort.Strings(uniqueItems)
	return uniqueItems
}
