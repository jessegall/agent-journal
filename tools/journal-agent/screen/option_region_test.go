package screen

import (
	"slices"
	"testing"

	"journal-agent/screen/contracts"
)

func TestAMenuNoFamilyKnowsStillGivesItsRowsAndEntries(t *testing.T) {
	snapshot := contracts.Snapshot{Rows: []string{
		"Pick a colour for the theme",
		"",
		"  Red",
		"❯ Green",
		"  Blue",
		"",
		"Enter to confirm",
	}}

	region, found := testLayout().OptionRegion(snapshot)

	if !found || region.Rows != (contracts.RowRange{First: 2, Last: 5}) {
		t.Fatalf("found %v at %+v", found, region.Rows)
	}
	if !slices.Equal(region.Entries.Labels, []string{"Red", "Green", "Blue"}) || region.Entries.Highlighted != 1 {
		t.Fatalf("read %+v", region.Entries)
	}
	if !slices.Equal(region.Markers, []string{"❯ "}) {
		t.Fatalf("found with %q", region.Markers)
	}
}

func TestAKnownFamilyGivesTheSameRowsAsItsOwnOptionRegion(t *testing.T) {
	layout := testLayout()
	snapshot := contracts.Snapshot{Rows: []string{"Do you trust this folder?", "", "❯ Yes, I trust it", "  No, exit"}}

	region, found := layout.OptionRegion(snapshot)
	own, ownFound := layout.Menus[0].Options.Rows(snapshot)

	if !found || !ownFound || region.Rows != own {
		t.Fatalf("the option region is %+v, %v; the family's own is %+v, %v", region.Rows, found, own, ownFound)
	}
}

func TestAReadyPromptWithNoListIsNoOptionRegion(t *testing.T) {
	rule := "────────────────────────────────────────"
	snapshot := contracts.Snapshot{Rows: []string{"Welcome back", "", rule, "❯ ", rule, "  ? for shortcuts"}}

	if region, found := testLayout().OptionRegion(snapshot); found {
		t.Fatalf("a ready prompt was read as an option list at %+v", region.Rows)
	}
}

func TestReorderingOrInsertingAnEntryKeepsTheFirstRow(t *testing.T) {
	layout := testLayout()
	before := contracts.Snapshot{Rows: []string{"Select model", "", "❯ Opus", "  Sonnet", "  Haiku"}}
	after := contracts.Snapshot{Rows: []string{"Select model", "", "  Haiku", "  Fable", "❯ Opus", "  Sonnet"}}

	first, _ := layout.OptionRegion(before)
	second, found := layout.OptionRegion(after)

	if !found || first.Rows.First != second.Rows.First {
		t.Fatalf("the list moved from row %d to %d", first.Rows.First, second.Rows.First)
	}
	if slices.Equal(first.Entries.Labels, second.Entries.Labels) {
		t.Fatalf("the entries did not change: %+v and %+v", first.Entries, second.Entries)
	}
}

func TestTheMarkersOfEveryOptionListFamilyAreTakenOnce(t *testing.T) {
	layout := testLayout()
	layout.Menus = append(layout.Menus,
		MenuFamily{Name: "other", Options: OptionList{Markers: []string{"› ", "❯ "}}},
		MenuFamily{Name: "effort", Options: Slider{Marker: "▲"}},
	)

	if markers := layout.highlightMarkers(); !slices.Equal(markers, []string{"❯ ", "› "}) {
		t.Fatalf("the markers are %q", markers)
	}
}
