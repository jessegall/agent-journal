package screen

import (
	"strings"
	"time"

	"journal-agent/screen/contracts"
)

// Kind is what a screen is ready for.
type Kind string

const (
	// PromptReady is an empty composer that holds the cursor, with no menu over it, as the program draws it when it
	// waits for a prompt. It is a reading of the screen, not proof that no turn runs; hooks say that.
	PromptReady Kind = "prompt-ready"
	// MenuShown is a known menu family the program put up, which keys have to answer before anything else.
	MenuShown Kind = "menu"
	// Unknown is any other screen: a turn being drawn, a draft in the composer, or a menu nobody recognised.
	Unknown Kind = "unknown"
)

// Classification is one reading of the screen: its kind, the menu family when one shows, whether the region it
// rests on has held still for its interval, the whole-screen generation it was read at, and whether an option list
// is drawn with no composer, as a picker is and a draft or a turn is not.
type Classification struct {
	Kind       Kind
	Menu       string
	Stable     bool
	Generation uint64
	Options    bool
}

// defaultUnknownStableFor is how long an unknown screen's text must hold still when the layout names no interval.
const defaultUnknownStableFor = 500 * time.Millisecond

// wholeScreen is the name the classifier keeps the whole screen's stillness under, beside its regions'.
const wholeScreen = "\x00whole screen"

// MenuFamily is one kind of menu a program puts up, known by shape and words rather than exact text: its option
// list is found by its shape, and enough of its keywords must appear on the screen, in any case and order, so a
// slightly reworded menu still matches.
type MenuFamily struct {
	Name        string
	Options     contracts.Region
	Keywords    []string
	MinKeywords int
	StableFor   time.Duration
	// Hold is the reason the runtime holds while the menu shows, such as permission_required.
	Hold string
	// LaterKeys are the recorded keys that choose a menu's harmless Later; empty means nothing is answered.
	LaterKeys string
	// Secret is whether this family's screen asks the user for a password, key or other secret.
	Secret bool
}

// matches is whether the snapshot shows this family: its option list is drawn and enough keywords appear.
func (family MenuFamily) matches(snapshot contracts.Snapshot) bool {
	if _, found := family.Options.Rows(snapshot); !found {
		return false
	}

	return family.matchesWords(snapshot)
}

// matchesWords is whether enough of the family's keywords appear on the screen, with or without its option list.
func (family MenuFamily) matchesWords(snapshot contracts.Snapshot) bool {
	text := strings.ToLower(strings.Join(snapshot.Rows, "\n"))
	present := 0
	for _, keyword := range family.Keywords {
		if strings.Contains(text, strings.ToLower(keyword)) {
			present++
		}
	}

	return present >= family.MinKeywords
}

// Layout is how one program build draws its screen, measured from its recordings: the buffer its prompt is on, where
// its composer is and the cursor column of an empty one, how long the composer must hold still, its menu families
// and the other regions worth counting, such as its spinner and status line.
type Layout struct {
	Buffer            contracts.Buffer
	Composer          contracts.ComposerRegion
	EmptyCursorColumn int
	ComposerStableFor time.Duration
	Menus             []MenuFamily
	Others            []contracts.Region
	// UnknownStableFor is how long an unknown screen's text must hold still to count as stable; zero is 500ms.
	UnknownStableFor time.Duration
	// BracketedPaste is whether the driver takes a paste of several lines between the bracketed paste markers.
	BracketedPaste bool
}

// unknownStableFor is the layout's interval for an unknown screen, or the default when it names none.
func (layout Layout) unknownStableFor() time.Duration {
	if layout.UnknownStableFor == 0 {
		return defaultUnknownStableFor
	}

	return layout.UnknownStableFor
}

// Regions are every region the layout names, for the reader to count generations of.
func (layout Layout) Regions() []contracts.Region {
	regions := []contracts.Region{layout.Composer}
	for _, family := range layout.Menus {
		regions = append(regions, family.Options)
	}

	return append(regions, layout.Others...)
}

// Classifier reads a program's screen as PromptReady, a known menu, or Unknown. It remembers since when each region's
// generation has held, so a region counts as stable only after its own interval, whatever else redraws meanwhile.
type Classifier struct {
	layout Layout
	reader contracts.ScreenReader
	seen   map[string]uint64
	since  map[string]time.Time
}

func NewClassifier(layout Layout, reader contracts.ScreenReader) *Classifier {
	return &Classifier{layout: layout, reader: reader, seen: map[string]uint64{}, since: map[string]time.Time{}}
}

// Classify reads the screen as it stands at the given time: the wall clock on a live terminal, the chunk's offset in
// a replay.
func (classifier *Classifier) Classify(now time.Time) Classification {
	snapshot := classifier.reader.Snapshot()
	generation := classifier.reader.ScreenGeneration()
	options := classifier.showsOptions(snapshot)

	for _, family := range classifier.layout.Menus {
		if family.matches(snapshot) {
			name := family.Options.Name()
			stable := classifier.heldFor(name, classifier.reader.Generation(name), now, family.StableFor)

			return Classification{
				Kind:       MenuShown,
				Menu:       family.Name,
				Stable:     stable,
				Generation: generation,
				Options:    options,
			}
		}
	}

	if classifier.composerIsEmptyWithCursor(snapshot) {
		name := classifier.layout.Composer.Name()
		stable := classifier.heldFor(name, classifier.reader.Generation(name), now, classifier.layout.ComposerStableFor)

		return Classification{Kind: PromptReady, Stable: stable, Generation: generation, Options: options}
	}

	stable := classifier.heldFor(wholeScreen, generation, now, classifier.layout.unknownStableFor())

	return Classification{Kind: Unknown, Stable: stable, Generation: generation, Options: options}
}

// showsOptions is whether an option list is drawn, known or not, while no composer is: a picker, not a draft.
func (classifier *Classifier) showsOptions(snapshot contracts.Snapshot) bool {
	_, listed := classifier.layout.OptionRegion(snapshot)
	_, composing := classifier.layout.Composer.Rows(snapshot)

	return listed && !composing
}

// composerIsEmptyWithCursor is whether the composer is drawn where the layout says, on the layout's buffer, with the
// visible cursor in it at the column of an empty composer: nothing anybody typed is there.
func (classifier *Classifier) composerIsEmptyWithCursor(snapshot contracts.Snapshot) bool {
	rows, found := classifier.layout.Composer.Rows(snapshot)
	cursor := snapshot.Cursor

	return found &&
		snapshot.Buffer == classifier.layout.Buffer &&
		cursor.Visible &&
		cursor.Row >= rows.First && cursor.Row < rows.Last &&
		cursor.Column == classifier.layout.EmptyCursorColumn
}

// Snapshot is the screen the classifier reads, as it stands.
func (classifier *Classifier) Snapshot() contracts.Snapshot {
	return classifier.reader.Snapshot()
}

// Forget drops what the classifier saw, so every region must hold still again from now before it counts as stable:
// a resumed driver acts only on a screen it read afresh.
func (classifier *Classifier) Forget() {
	classifier.seen = map[string]uint64{}
	classifier.since = map[string]time.Time{}
}

// heldFor is whether the generation kept under the name has not changed for at least the interval.
func (classifier *Classifier) heldFor(region string, generation uint64, now time.Time, interval time.Duration) bool {
	if _, known := classifier.since[region]; !known || classifier.seen[region] != generation {
		classifier.seen[region] = generation
		classifier.since[region] = now
	}

	return now.Sub(classifier.since[region]) >= interval
}
