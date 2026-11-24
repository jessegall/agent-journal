package terminal

import (
	"bytes"
	"testing"
	"time"

	"journal-agent/profiles"
	"journal-agent/recording"
	"journal-agent/screen"
)

// replayed reads a recording's last screen through the Claude Code layout, held still long enough to be stable.
func replayed(t *testing.T, folder string) (*screen.EmulatorReader, screen.Classification) {
	t.Helper()
	layout := profiles.ClaudeCode{}.Screens()
	fixture, err := recording.Load("../testdata/recordings/" + folder)
	if err != nil {
		t.Fatal(err)
	}
	reader, err := screen.NewEmulatorReader(120, 40, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	for _, chunk := range fixture.Output {
		if err := reader.Feed(chunk.Bytes); err != nil {
			t.Fatal(err)
		}
	}
	classifier := screen.NewClassifier(layout, reader)
	classifier.Classify(time.Unix(0, 0))

	return reader, classifier.Classify(time.Unix(1, 0))
}

// drawn reads a hand-drawn screen through the Claude Code layout.
func drawn(t *testing.T, rows string) screen.Classification {
	t.Helper()
	layout := profiles.ClaudeCode{}.Screens()
	reader, err := screen.NewEmulatorReader(80, 12, screen.DefaultLimits, layout.Regions())
	if err != nil {
		t.Fatal(err)
	}
	reader.Feed([]byte(rows))

	return screen.NewClassifier(layout, reader).Classify(time.Unix(0, 0))
}

func newHolds(t *testing.T, reader *screen.EmulatorReader) (*Holds, *bytes.Buffer) {
	t.Helper()
	layout := profiles.ClaudeCode{}.Screens()
	program := &bytes.Buffer{}
	gate := NewInputGate(program, reader, layout.Composer, func() time.Time { return time.Unix(0, 0) })

	return NewHolds(layout, "claude@2.1.323", gate), program
}

func TestTheRecordedTrustScreenHoldsForTrustAndSendsNoKey(t *testing.T) {
	reader, reading := replayed(t, "claude-code/2.1.323/screens/folder-trust")
	holds, program := newHolds(t, reader)

	report, err := holds.Observe(reading, "request-1", 2*time.Second)
	if err != nil || report.Reason != "trust_required" || report.Menu != "folder-trust" {
		t.Fatalf("the trust screen reported %+v, %v", report, err)
	}
	if program.Len() != 0 {
		t.Fatalf("a held screen got keys %q", program.String())
	}
}

func TestTheRecordedWelcomeScreenIsPassedWithItsRecordedEnterAndHoldsNothing(t *testing.T) {
	reader, reading := replayed(t, "claude-code/2.1.323/screens/welcome-theme")
	holds, program := newHolds(t, reader)

	report, err := holds.Observe(reading, "request-1", time.Second)
	if err != nil || report.Reason != HoldNone || report.Menu != "theme" {
		t.Fatalf("the welcome screen reported %+v, %v", report, err)
	}
	if program.String() != "\r" {
		t.Fatalf("the welcome screen got keys %q, not its recorded Enter", program.String())
	}
}

// A paste of several lines is drawn as the program's own fold marker, and the copy of the screen
// may hold it with stray characters. The line counts as drawn once the composer changed and holds anything; its
// characters are not compared.
func TestAPasteOfSeveralLinesCountsAsDrawnOnceTheComposerChangedAndHoldsSomething(t *testing.T) {
	reader, reading := replayed(t, "claude-code/2.1.323/screens/folded-paste")
	layout := profiles.ClaudeCode{}.Screens()
	gate := NewInputGate(&bytes.Buffer{}, reader, layout.Composer, func() time.Time { return time.Unix(0, 0) })
	drawnNow := reader.Generation(layout.Composer.Name())

	if reading.Kind == screen.MenuShown {
		t.Fatalf("the folded paste read as the menu %q", reading.Menu)
	}
	if !gate.Shows(&TypedLine{drawnFrom: drawnNow - 1}) {
		t.Fatal("a composer that changed and holds the fold marker was not taken as the pasted line drawn")
	}
	if gate.Shows(&TypedLine{drawnFrom: drawnNow}) {
		t.Fatal("a composer the program has not redrawn since the paste was taken as the pasted line drawn")
	}
}

func TestTwoYesNoQuestionsAreToldApartByTheirQuestionText(t *testing.T) {
	permission := drawn(t, "\x1b[2;1HBash command\x1b[3;1HDo you want to proceed?"+
		"\x1b[4;1H❯ Yes\x1b[5;1H  No, and tell Claude what to do differently (esc)")
	bypass := drawn(t, "\x1b[2;1HWARNING: Claude Code running in Bypass Permissions mode"+
		"\x1b[3;1Hpotentially dangerous commands\x1b[4;1H❯ No, exit\x1b[5;1H  Yes, I accept")

	if permission.Menu != "tool-permission" || bypass.Menu != "bypass-warning" {
		t.Fatalf("the questions read as %q and %q", permission.Menu, bypass.Menu)
	}
}

func TestAnUnmatchedScreenReportsUnknownWithItsBuildRequestAndAge(t *testing.T) {
	reading := drawn(t, "\x1b[2;1HPick a flavour\x1b[3;1H❯ Vanilla\x1b[4;1H  Chocolate")
	reader, _ := replayed(t, "claude-code/2.1.323/screens/folder-trust")
	holds, program := newHolds(t, reader)

	report, err := holds.Observe(reading, "request-7", 3*time.Second)
	if err != nil || report.Reason != HoldUnknownScreen {
		t.Fatalf("an unknown menu reported %+v, %v", report, err)
	}
	if report.Build != "claude@2.1.323" || report.RequestID != "request-7" || report.ObservationAge != 3*time.Second {
		t.Fatalf("the unknown screen's report lacks its build, request or age: %+v", report)
	}
	if program.Len() != 0 {
		t.Fatalf("an unknown screen got keys %q: nothing may be guessed", program.String())
	}
}

func TestASecretScreenStillHoldsForItsFamilysReason(t *testing.T) {
	reading := drawn(t, "\x1b[2;1HDetected a custom API key in your environment\x1b[3;1HDo you want to use this API key?"+
		"\x1b[5;1H❯ 1. Yes\x1b[6;1H  2. No (recommended)")
	reader, _ := replayed(t, "claude-code/2.1.323/screens/folder-trust")
	holds, program := newHolds(t, reader)

	report, err := holds.Observe(reading, "request-3", 0)
	if err != nil || reading.Menu != "api-key" || report.Reason != "login_required" || program.Len() != 0 {
		t.Fatalf("the api key screen read %+v and reported %+v, %v, keys %q", reading, report, err, program.String())
	}
}

func TestOnlyARecordedLaterIsAnswered(t *testing.T) {
	reader, _ := replayed(t, "claude-code/2.1.323/screens/folder-trust")
	layout := profiles.ClaudeCode{}.Screens()
	update := screen.MenuFamily{Name: "optional-update", Hold: "update_required", LaterKeys: "\x1b"}
	layout.Menus = append(layout.Menus, update)
	program := &bytes.Buffer{}
	gate := NewInputGate(program, reader, layout.Composer, func() time.Time { return time.Unix(0, 0) })
	holds := NewHolds(layout, "claude@2.1.323", gate)

	shown := screen.Classification{Kind: screen.MenuShown, Menu: "optional-update", Stable: true}
	report, err := holds.Observe(shown, "request-2", 0)
	if err != nil || report.Reason != HoldNone || program.String() != "\x1b" {
		t.Fatalf("the optional update gave %+v, %v and keys %q", report, err, program.String())
	}
}
