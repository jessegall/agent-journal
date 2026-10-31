package classify

import "sort"

const (
	unknown      = "unknown"
	journalKind  = "journal"
	writesFiles  = "writes_files"
	deletesFiles = "deletes_files"
	printsFiles  = "prints_files"
)

// KindOrder names a line by its weightiest part: a test run over the tee that keeps its log, an edit over a read, a
// journal command or a program the table does not know over a read; version 4's KIND_ORDER.
var KindOrder = []string{"test run", "build", "package", "edit", "network", "version control", "check", "process", journalKind, unknown, "search", "read"}

// The kinds whose words name the files they write, as rm build and sed -i s/a/b/ notes.txt do.
var namingKinds = map[string]bool{"edit": true, "version control": true}

// Classification is what a command is and does: its kind, its effects, whether the line alone leaves it uncertain,
// and the activity it is shown as.
type Classification struct {
	Kind      string
	Effects   []string
	Uncertain bool
	Label     string
}

func newClassification() Classification {
	return Classification{Kind: unknown, Effects: []string{}}
}

func kindRank(kind string) int {
	for index, each := range KindOrder {
		if each == kind {
			return index
		}
	}
	return len(KindOrder)
}

// Union is the classification of commands taken together: the weightiest kind, every effect, uncertain when any is,
// and the label of the first command of that kind that has one, else of any.
func Union(classifications []Classification) Classification {
	if len(classifications) == 0 {
		return newClassification()
	}
	kind := classifications[0].Kind
	for _, each := range classifications[1:] {
		if kindRank(each.Kind) < kindRank(kind) {
			kind = each.Kind
		}
	}
	united := Classification{Kind: kind}
	var effects []string
	for _, each := range classifications {
		effects = append(effects, each.Effects...)
		united.Uncertain = united.Uncertain || each.Uncertain
	}
	united.Effects = sortedUnique(effects)
	ordered := append([]Classification{}, classifications...)
	sort.SliceStable(ordered, func(i, j int) bool { return ordered[i].Kind == kind && ordered[j].Kind != kind })
	for _, each := range ordered {
		if each.Label != "" {
			united.Label = each.Label
			break
		}
	}
	return united
}

// withRow is the classification a row gives: a row that names a kind replaces the effects, one that names none adds
// to them.
func (classification Classification) withRow(row *Row) Classification {
	effects := row.Effects
	if row.Kind == "" {
		effects = append(append([]string{}, classification.Effects...), row.Effects...)
	}
	changed := classification
	if row.Kind != "" {
		changed.Kind = row.Kind
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
	for _, each := range classification.Effects {
		if each == effect {
			return true
		}
	}
	return false
}

// IsWrite says the command changes files: not the journal's own, and it writes or deletes files or leaves its meaning
// uncertain.
func (classification Classification) IsWrite() bool {
	return classification.Kind != journalKind && (classification.has(writesFiles) || classification.has(deletesFiles) || classification.Uncertain)
}

func sortedUnique(words []string) []string {
	kept := unique(words)
	sort.Strings(kept)
	return kept
}
