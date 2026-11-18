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

// Classification is one reading of the screen: its kind, the menu family when one shows, and whether the region it
// rests on has held still for its interval.
type Classification struct {
	Kind   Kind
	Menu   string
	Stable bool
}

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
}

// matches is whether the snapshot shows this family: its option list is drawn and enough keywords appear.
func (family MenuFamily) matches(snapshot contracts.Snapshot) bool {
	if _, found := family.Options.Rows(snapshot); !found {
		return false
	}

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
	Composer          contracts.Region
	EmptyCursorColumn int
	ComposerStableFor time.Duration
	Menus             []MenuFamily
	Others            []contracts.Region
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

	for _, family := range classifier.layout.Menus {
		if family.matches(snapshot) {
			stable := classifier.heldFor(family.Options.Name(), now, family.StableFor)

			return Classification{Kind: MenuShown, Menu: family.Name, Stable: stable}
		}
	}

	if classifier.composerIsEmptyWithCursor(snapshot) {
		stable := classifier.heldFor(classifier.layout.Composer.Name(), now, classifier.layout.ComposerStableFor)

		return Classification{Kind: PromptReady, Stable: stable}
	}

	return Classification{Kind: Unknown}
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

// Forget drops what the classifier saw, so every region must hold still again from now before it counts as stable:
// a resumed driver acts only on a screen it read afresh.
func (classifier *Classifier) Forget() {
	classifier.seen = map[string]uint64{}
	classifier.since = map[string]time.Time{}
}

// heldFor is whether the region's generation has not changed for at least the interval.
func (classifier *Classifier) heldFor(region string, now time.Time, interval time.Duration) bool {
	generation := classifier.reader.Generation(region)
	if _, known := classifier.since[region]; !known || classifier.seen[region] != generation {
		classifier.seen[region] = generation
		classifier.since[region] = now
	}

	return now.Sub(classifier.since[region]) >= interval
}
