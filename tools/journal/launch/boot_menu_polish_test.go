package launch

import (
	"errors"
	"strings"
	"testing"
)

var (
	escapePress = Press{Key: KeyEscape}
	discardPress = Press{Key: KeyRune, Rune: DiscardKey}
)

func twoEnvironments() *fakeJournal {
	journal := codingProject()
	journal.environments = []Environment{
		{ID: 1, Name: "main", Folder: "/work/shop", Branch: "main", Suite: "coding"},
		{ID: 2, Name: "checkout", Folder: "/work/shop", Branch: "checkout", Suite: "coding"},
	}
	return journal
}

func TestEveryScreenOfTheBootMenuIsUnderABannerNamingTheProgramAndTheProject(t *testing.T) {
	terminal := keys(enterPress, enterPress, enterPress)
	if _, err := Boot(codingProject(), terminal, Request{Program: "claude", Root: "/work/shop"}); err != nil {
		t.Fatal(err)
	}
	for _, screen := range terminal.screens[:len(terminal.screens)-1] {
		if !strings.Contains(screen, "You're about to start Claude under the journal,") || !strings.Contains(screen, "in /work/shop.") {
			t.Fatalf("a screen has no banner:\n%s", screen)
		}
	}
}

func TestAColourTerminalGetsAccentBoldAndDimCodesAndAPlainOneGetsNone(t *testing.T) {
	coloured := keys(enterPress, enterPress, enterPress)
	coloured.style = Style{Colour: true}
	if _, err := Boot(codingProject(), coloured, Request{Program: "claude", Root: "/work/shop"}); err != nil {
		t.Fatal(err)
	}
	for _, code := range []string{accentCode + "❯", boldCode + "main", dimCode + "↑ ↓"} {
		if !strings.Contains(coloured.screenText(), code) {
			t.Fatalf("the colour screens lack %q:\n%s", code, coloured.screenText())
		}
	}
	plain := keys(enterPress, enterPress, enterPress)
	if _, err := Boot(codingProject(), plain, Request{Program: "claude", Root: "/work/shop"}); err != nil {
		t.Fatal(err)
	}
	if strings.Contains(plain.screenText(), "\x1b[") {
		t.Fatalf("a plain terminal was sent colour codes:\n%s", plain.screenText())
	}
}

func TestEscapeLeavesTheBootMenuWithoutStartingAnything(t *testing.T) {
	_, err := Boot(codingProject(), keys(escapePress), Request{Program: "claude", Root: "/work/shop"})
	if !errors.Is(err, ErrLeft) {
		t.Fatalf("Escape gave %v", err)
	}
}

func TestANumberJumpsToItsOption(t *testing.T) {
	terminal := keys(Press{Key: KeyRune, Rune: '2'}, enterPress)
	answer, err := Answer(terminal, Question{Title: "Which?", Options: []string{"one", "two", "three"}})
	if err != nil || answer != "two" {
		t.Fatalf("the number 2 picked %q, %v", answer, err)
	}
}

func TestAnEnvironmentIsDeletedOnlyAfterTheAnswerYes(t *testing.T) {
	journal := twoEnvironments()
	terminal := keys(discardPress, downPress, enterPress, enterPress, enterPress, enterPress)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || len(journal.deleted) != 1 || journal.deleted[0].Name != "checkout" || choice.Environment != "main" {
		t.Fatalf("deleted %+v, chose %+v, %v", journal.deleted, choice, err)
	}
	if !strings.Contains(terminal.screenText(), "Delete checkout?") || !strings.Contains(terminal.screenText(), "This cannot be undone.") {
		t.Fatalf("the person was not asked:\n%s", terminal.screenText())
	}
}

func TestKeepingAnEnvironmentDeletesNothingAndOffersItAgain(t *testing.T) {
	journal := twoEnvironments()
	terminal := keys(discardPress, enterPress, enterPress, enterPress, enterPress)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || len(journal.deleted) != 0 || choice.Environment != "checkout" {
		t.Fatalf("deleted %+v, chose %+v, %v", journal.deleted, choice, err)
	}
}

func TestTheLeftArrowAtTheDeleteQuestionKeepsTheEnvironment(t *testing.T) {
	journal := twoEnvironments()
	terminal := keys(discardPress, backPress, enterPress, enterPress, enterPress)
	if _, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"}); err != nil || len(journal.deleted) != 0 {
		t.Fatalf("deleted %+v, %v", journal.deleted, err)
	}
}

func TestAnEnvironmentWithAnAgentAtWorkIsNeverDeleted(t *testing.T) {
	journal := twoEnvironments()
	journal.environments[1].Working = true
	terminal := keys(discardPress, enterPress, downPress, enterPress, enterPress, enterPress, enterPress)
	if _, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"}); err != nil || len(journal.deleted) != 0 {
		t.Fatalf("deleted %+v, %v", journal.deleted, err)
	}
	if !strings.Contains(terminal.screenText(), "Stop that agent first.") || !strings.Contains(terminal.screenText(), "[working]") {
		t.Fatalf("the person was not told:\n%s", terminal.screenText())
	}
}

func TestTheNewEnvironmentOptionCannotBeDeleted(t *testing.T) {
	journal := codingProject()
	terminal := keys(downPress, discardPress, enterPress, enterPress, enterPress)
	choice, err := Boot(journal, terminal, Request{Program: "claude", Root: "/work/shop"})
	if err != nil || len(journal.deleted) != 0 || choice.Environment != "main" || strings.Contains(terminal.screenText(), "Delete a new environment") {
		t.Fatalf("deleted %+v, chose %+v, %v", journal.deleted, choice, err)
	}
}

func TestTheBootMenuEndsWithWhatItStartsWith(t *testing.T) {
	terminal := keys(enterPress, enterPress, enterPress)
	if _, err := Boot(codingProject(), terminal, Request{Program: "claude", Root: "/work/shop"}); err != nil {
		t.Fatal(err)
	}
	last := terminal.screens[len(terminal.screens)-1]
	for _, line := range []string{"Starting", "✓ environment   main", "✓ conversation  new", "✓ prompts       asked"} {
		if !strings.Contains(last, line) {
			t.Fatalf("the last screen lacks %q:\n%s", line, last)
		}
	}
}

func TestALongLineIsCutToTheTerminalsWidthWithItsColourKept(t *testing.T) {
	style := Style{Colour: true, Columns: 11}
	fitted := style.Fit(style.Accent("0123456789abcdef"))
	if fitted != accentCode+"0123456789"+resetCode+resetCode {
		t.Fatalf("the line was cut to %q", fitted)
	}
	if style.Fit("short") != "short" || (Style{}).Fit("no limit known at all") != "no limit known at all" {
		t.Fatal("a line that fits was changed")
	}
}
