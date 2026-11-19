package profiles

import (
	"path/filepath"
	"slices"
	"testing"
	"time"

	"journal-agent/recording"
	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// screenAt replays a recording until the given offset and gives the screen as it stands then.
func screenAt(t *testing.T, folder string, layout screen.Layout, until time.Duration) screencontracts.Snapshot {
	t.Helper()
	fixture, err := recording.Load(filepath.Join("../testdata/recordings", folder))
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	for _, chunk := range fixture.Output {
		if chunk.Offset >= until {
			break
		}
		if err := reader.Feed(chunk.Bytes); err != nil {
			t.Fatal(err)
		}
	}

	return reader.Snapshot()
}

func familyNamed(t *testing.T, layout screen.Layout, name string) screen.MenuFamily {
	t.Helper()
	for _, family := range layout.Menus {
		if family.Name == name {
			return family
		}
	}
	t.Fatalf("no menu family %q", name)

	return screen.MenuFamily{}
}

func TestTheRecordedCodexModelPickerGivesTheSameRegionKnownOrNot(t *testing.T) {
	layout := Codex{}.Screens()
	snapshot := screenAt(t, "codex/0.165.0/keyscripts/model-and-status", layout, 6500*time.Millisecond)
	family := familyNamed(t, layout, "model-picker")
	own, _ := family.Options.Rows(snapshot)
	ownEntries, _ := family.Options.(screen.OptionList).Entries(snapshot)

	unknown := layout
	unknown.Menus = slices.DeleteFunc(slices.Clone(layout.Menus), func(each screen.MenuFamily) bool {
		return each.Name == "model-picker"
	})
	for _, each := range []screen.Layout{layout, unknown} {
		region, found := each.OptionRegion(snapshot)
		if !found || region.Rows != own || !slices.Equal(region.Entries.Labels, ownEntries.Labels) ||
			region.Entries.Highlighted != ownEntries.Highlighted {
			t.Fatalf("read %+v, %v; the model picker's own region is %+v with %+v", region, found, own, ownEntries)
		}
	}
	if len(ownEntries.Labels) < 2 {
		t.Fatalf("the recording shows no picker: %+v", ownEntries)
	}
}

func TestTheRecordedClaudeCodeTrustMenuGivesItsFamilysRows(t *testing.T) {
	layout := ClaudeCode{}.Screens()
	snapshot := screenAt(t, "claude-code/2.1.323/screens/folder-trust", layout, time.Hour)
	own, ownFound := familyNamed(t, layout, "folder-trust").Options.Rows(snapshot)

	region, found := layout.OptionRegion(snapshot)

	if !found || !ownFound || region.Rows != own {
		t.Fatalf("the option region is %+v, %v; the trust menu's own is %+v, %v", region.Rows, found, own, ownFound)
	}
}
