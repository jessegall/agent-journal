package profiles

import (
	"slices"
	"strings"
	"testing"
	"time"

	"journal-agent/screen"
	screencontracts "journal-agent/screen/contracts"
)

// trustScreen is the recorded Claude Code folder-trust menu, its options on rows 14 and 15.
func trustScreen(t *testing.T) (screen.Layout, screencontracts.Snapshot) {
	t.Helper()
	layout := ClaudeCode{}.Screens()

	return layout, screenAt(t, "claude-code/2.1.323/screens/folder-trust", layout, time.Hour)
}

// changed is the snapshot with its rows changed, the original left as it was.
func changed(snapshot screencontracts.Snapshot, change func(rows []string) []string) screencontracts.Snapshot {
	snapshot.Rows = change(slices.Clone(snapshot.Rows))

	return snapshot
}

// withOptions is the snapshot with its two recorded option rows replaced by these.
func withOptions(snapshot screencontracts.Snapshot, options ...string) screencontracts.Snapshot {
	return changed(snapshot, func(rows []string) []string {
		return slices.Concat(rows[:14], options, rows[16:])
	})
}

func TestTheSameRecordedScreenGivesTheSameFingerprint(t *testing.T) {
	layout, snapshot := trustScreen(t)
	_, again := trustScreen(t)

	first, replayable := screen.FingerprintOf(layout, "claude-code", snapshot, "folder-trust")

	if !replayable || !strings.HasPrefix(first, "fp1:") {
		t.Fatalf("the trust menu gave %q, replayable %v", first, replayable)
	}
	if second := screen.Fingerprint(layout, "claude-code", again, "folder-trust"); second != first {
		t.Fatalf("the same screen gave %q and %q", first, second)
	}
}

func TestReorderedInsertedOrMovedOptionsKeepTheFingerprint(t *testing.T) {
	layout, snapshot := trustScreen(t)
	want := screen.Fingerprint(layout, "claude-code", snapshot, "folder-trust")

	variants := map[string]screencontracts.Snapshot{
		"reordered":         withOptions(snapshot, " ❯ Yes, I trust this folder", "   No, exit"),
		"inserted":          withOptions(snapshot, " ❯ No, exit", "   Ask me later", "   Yes, I trust this folder"),
		"highlight moved":   withOptions(snapshot, "   No, exit", " ❯ Yes, I trust this folder"),
		"another workspace": changed(snapshot, func(rows []string) []string {
			rows[4] = " /home/ann/code/2"

			return rows
		}),
	}
	for name, variant := range variants {
		if got := screen.Fingerprint(layout, "claude-code", variant, "folder-trust"); got != want {
			t.Fatalf("the %s screen gave %q, not %q", name, got, want)
		}
	}
}

func TestChangedDigitsAddressesAndPathsKeepTheFingerprint(t *testing.T) {
	layout, snapshot := trustScreen(t)
	signedIn := func(line string) screencontracts.Snapshot {
		return changed(snapshot, func(rows []string) []string { rows[12] = line; return rows })
	}

	ann := signedIn(" ann@example.com · 3 servers · ~/a")
	bob := signedIn(" bob@example.org · 12 servers · ~/b")
	first := screen.Fingerprint(layout, "claude-code", ann, "folder-trust")
	second := screen.Fingerprint(layout, "claude-code", bob, "folder-trust")

	if first != second {
		t.Fatalf("an address, a count and a path changed the fingerprint: %q and %q", first, second)
	}
}

func TestARewordedTitleOrAnotherFamilyChangesTheFingerprint(t *testing.T) {
	layout, snapshot := trustScreen(t)
	want := screen.Fingerprint(layout, "claude-code", snapshot, "folder-trust")
	reworded := changed(snapshot, func(rows []string) []string { rows[2] = " Opening workspace:"; return rows })

	if screen.Fingerprint(layout, "claude-code", reworded, "folder-trust") == want {
		t.Fatal("a reworded title kept the fingerprint")
	}
	if screen.Fingerprint(layout, "claude-code", snapshot, "bypass-warning") == want {
		t.Fatal("another menu family kept the fingerprint")
	}
}

func TestAnUnknownMenuWithATickingSpinnerAndStatusKeepsItsFingerprint(t *testing.T) {
	layout := ClaudeCode{}.Screens()
	sample := func(glyph, seconds, clock string) screencontracts.Snapshot {
		return screencontracts.Snapshot{Buffer: screencontracts.NormalBuffer, Rows: []string{
			" Choose an output style",
			"",
			" ❯ Default",
			"   Explanatory",
			"   Learning",
			"",
			glyph + " Thinking… (" + seconds + "s · esc to interrupt)",
			"",
			"  ⏵⏵ auto mode on (shift+tab to cycle) · " + clock,
		}}
	}

	first, replayable := screen.FingerprintOf(layout, "claude-code", sample("✻", "3", "12:01"), "")
	if !replayable {
		t.Fatal("an unknown menu was not replayable")
	}
	for _, later := range []screencontracts.Snapshot{sample("✶", "4", "12:02"), sample("✳", "15", "12:10")} {
		if got := screen.Fingerprint(layout, "claude-code", later, ""); got != first {
			t.Fatalf("a spinner tick changed the fingerprint: %q and %q", first, got)
		}
	}
}

func TestAScreenWithNoOptionListIsHashedWholeAndNotReplayable(t *testing.T) {
	layout := Codex{}.Screens()
	snapshot := screenAt(t, "codex/0.165.0/screens/first-start", layout, time.Hour)

	first, replayable := screen.FingerprintOf(layout, "codex", snapshot, "")
	if replayable || !strings.HasPrefix(first, "fp1:") {
		t.Fatalf("the first start screen gave %q, replayable %v", first, replayable)
	}
	if second, _ := screen.FingerprintOf(layout, "codex", snapshot, ""); second != first {
		t.Fatalf("the same screen gave %q and %q", first, second)
	}
}
