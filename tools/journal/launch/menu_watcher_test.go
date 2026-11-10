package launch

import (
	"strings"
	"testing"
	"time"
)

const switchModelScreen = "\x1b[2K\x1b[1A\x1b[2K\x1b[G\x1b[38;2;255;193;7mSwitch model?\x1b[39m\r\n" +
	"\x1b[2mYour next response will be slower and use more tokens\x1b[22m\r\n\r\n" +
	"This conversation is cached for the current model.\r\n\r\n" +
	"\x1b[38;5;153m❯ 1. Yes, switch to Opus 5.5\x1b[39m\r\n  2. No, go back\r\n"

func TestAMenuIsReadFromTheTerminalsBytes(t *testing.T) {
	menu := ReadTerminalMenu(switchModelScreen)
	if menu == nil {
		t.Fatal("the menu was not read")
	}
	if len(menu.Options) != 2 || !menu.Options[0].Cursor || menu.Options[0].Label != "Yes, switch to Opus 5.5" || menu.Options[1].Label != "No, go back" {
		t.Fatalf("the options are %+v", menu.Options)
	}
	if !strings.Contains(menu.Question, "Switch model?") {
		t.Fatalf("the question is %q", menu.Question)
	}
	if !menu.Foreign() || !menu.Confirming() {
		t.Fatalf("the model question is the program's own and asks yes or no: %+v", menu)
	}
	if keys := menu.KeysFor(menu.Accepting()); keys != MenuKeyEnter {
		t.Fatalf("the cursor stands on yes, so only Enter: %q", keys)
	}
}

func TestANumberedListInTheAgentsTextIsNoMenu(t *testing.T) {
	for _, screen := range []string{
		"The steps are:\r\n1. Read the file\r\n2. Change it\r\n",
		"> 1. quoted\r\n  2. lines\r\nmore text below\r\n",
		"1. Read the file\r\n3. Change it\r\nEnter to select\r\n",
	} {
		if menu := ReadTerminalMenu(screen); menu != nil {
			t.Fatalf("read a menu from %q: %+v", screen, menu)
		}
	}
}

func TestAFooterMakesAMenuWithoutACursorAndArrowsReachTheOptionTaken(t *testing.T) {
	menu := ReadTerminalMenu("Pick one\r\n  1. Later\r\n❯ 2. Maybe\r\n  3. Yes\r\nEnter to select · Esc to cancel\r\n")
	if menu == nil {
		t.Fatal("the menu was not read")
	}
	if keys := menu.KeysFor(menu.Accepting()); keys != MenuKeyDown+MenuKeyEnter {
		t.Fatalf("from Maybe down to Yes: %q", keys)
	}
	declining, _ := menu.Declining()
	if keys := menu.KeysFor(declining); keys != MenuKeyUp+MenuKeyEnter {
		t.Fatalf("from Maybe up to Later: %q", keys)
	}
}

func TestAPermissionQuestionAndAListOfPastSessionsAreNotTheProgramsOwn(t *testing.T) {
	for _, screen := range []string{
		"Do you want to proceed?\r\n❯ 1. Yes\r\n  2. No\r\n",
		"Resume a session\r\n❯ 1. Fix the cart\r\n  2. Add the tests\r\n",
	} {
		if menu := ReadTerminalMenu(screen); menu == nil || menu.Foreign() {
			t.Fatalf("not left alone: %q", screen)
		}
	}
}

type watcherClock struct {
	currentAt time.Time
	keyedAt   time.Time
	typedAt   time.Time
	pressed   []string
}

func watched(clock *watcherClock) *MenuWatcher {
	return &MenuWatcher{
		CurrentTime: func() time.Time { return clock.currentAt },
		KeyedAt:     func() time.Time { return clock.keyedAt },
		TypedAt:     func() time.Time { return clock.typedAt },
		Press: func(keys string) bool {
			clock.pressed = append(clock.pressed, keys)
			return true
		},
	}
}

func newWatcherClock() *watcherClock {
	return &watcherClock{currentAt: time.Date(2026, 11, 2, 10, 0, 0, 0, time.UTC)}
}

func TestAMenuCausedByALineTheJournalTypedIsConfirmedOnceTheScreenIsStill(t *testing.T) {
	clock := newWatcherClock()
	clock.typedAt = clock.currentAt.Add(-5 * time.Second)
	watcher := watched(clock)
	_, _ = watcher.Write([]byte(switchModelScreen))
	if answer := watcher.CheckMenu(); answer != nil {
		t.Fatalf("answered a menu still being drawn: %+v", answer)
	}
	clock.currentAt = clock.currentAt.Add(2 * time.Second)
	answer := watcher.CheckMenu()
	if answer == nil || answer.Keys != MenuKeyEnter || !strings.Contains(answer.Explanation, "Yes, switch to Opus 5.5") {
		t.Fatalf("the answer is %+v", answer)
	}
	if repeatedAnswer := watcher.CheckMenu(); repeatedAnswer != nil || len(clock.pressed) != 1 {
		t.Fatalf("answered twice: %+v %v", repeatedAnswer, clock.pressed)
	}
}

func TestTheSameMenuDrawnAgainLaterIsAnsweredAgain(t *testing.T) {
	clock := newWatcherClock()
	clock.typedAt = clock.currentAt
	watcher := watched(clock)
	for round := 0; round < 2; round++ {
		_, _ = watcher.Write([]byte(switchModelScreen))
		_ = watcher.CheckMenu()
		clock.currentAt = clock.currentAt.Add(2 * time.Second)
		if watcher.CheckMenu() == nil {
			t.Fatalf("round %d was not answered", round)
		}
		clock.typedAt = clock.currentAt
	}
}

func TestAYesOrNoMenuAfterKeysAtTheKeyboardIsConfirmedAndAnyOtherIsLeftToThePerson(t *testing.T) {
	clock := newWatcherClock()
	clock.keyedAt = clock.currentAt.Add(-time.Second)
	watcher := watched(clock)
	_, _ = watcher.Write([]byte(switchModelScreen))
	_ = watcher.CheckMenu()
	clock.currentAt = clock.currentAt.Add(2 * time.Second)
	if answer := watcher.CheckMenu(); answer == nil || answer.Keys != MenuKeyEnter {
		t.Fatalf("what the person asked for was not confirmed: %+v", answer)
	}
	clock.keyedAt = clock.currentAt
	_, _ = watcher.Write([]byte("Choose a theme\r\n❯ 1. Dark\r\n  2. Light\r\n"))
	_ = watcher.CheckMenu()
	clock.currentAt = clock.currentAt.Add(2 * time.Second)
	if answer := watcher.CheckMenu(); answer != nil {
		t.Fatalf("a person's own menu was answered: %+v", answer)
	}
}

func TestAMenuNothingAskedForIsDeclinedOrClosedAndTheTrustQuestionAccepted(t *testing.T) {
	cases := []struct {
		screen string
		keys   string
	}{
		{"Enable the new thing?\r\n❯ 1. Yes\r\n  2. No\r\n", MenuKeyDown + MenuKeyEnter},
		{"Choose a theme\r\n❯ 1. Dark\r\n  2. Light\r\n", MenuKeyEscape},
		{"Do you trust the files in this folder?\r\n  1. No, exit\r\n❯ 2. Yes, proceed\r\n", MenuKeyEnter},
	}
	for _, testCase := range cases {
		clock := newWatcherClock()
		clock.keyedAt = clock.currentAt.Add(-time.Hour)
		clock.typedAt = clock.currentAt.Add(-time.Hour)
		watcher := watched(clock)
		_, _ = watcher.Write([]byte(testCase.screen))
		_ = watcher.CheckMenu()
		clock.currentAt = clock.currentAt.Add(2 * time.Second)
		if answer := watcher.CheckMenu(); answer == nil || answer.Keys != testCase.keys {
			t.Fatalf("%q was answered %+v", testCase.screen, answer)
		}
	}
}

func TestAPermissionQuestionIsLeftAlone(t *testing.T) {
	clock := newWatcherClock()
	clock.typedAt = clock.currentAt
	watcher := watched(clock)
	_, _ = watcher.Write([]byte("Do you want to proceed?\r\n❯ 1. Yes\r\n  2. No\r\n"))
	_ = watcher.CheckMenu()
	clock.currentAt = clock.currentAt.Add(2 * time.Second)
	if answer := watcher.CheckMenu(); answer != nil {
		t.Fatalf("a permission question was answered: %+v", answer)
	}
}

func TestTerminalInputsRecordKeysAndTypedLinesAndPressKeys(t *testing.T) {
	inputs := NewTerminalInputs()
	reader := inputs.Open(7, strings.NewReader("a"))
	buffer := make([]byte, 16)
	if _, err := reader.Read(buffer); err != nil {
		t.Fatal(err)
	}
	if inputs.KeyedAt(7).IsZero() {
		t.Fatal("keys at the keyboard were not noted")
	}
	keyResult := make(chan bool)
	go func() { keyResult <- inputs.PressKeys(7, MenuKeyDown+MenuKeyEnter) }()
	pressed := ""
	for !strings.HasSuffix(pressed, MenuKeyEnter) {
		count, err := reader.Read(buffer)
		if err != nil {
			t.Fatal(err)
		}
		pressed += string(buffer[:count])
	}
	if !<-keyResult || pressed != MenuKeyDown+MenuKeyEnter {
		t.Fatalf("pressed %q", pressed)
	}
	if !inputs.TypedAt(7).IsZero() {
		t.Fatal("keys the watcher pressed are no typed line")
	}
}

type unsentLineTerminal struct {
	watcher *MenuWatcher
	current time.Time
	line    *EnteredLine
	enters  int
	pending string
	answers []string
	onEnter func(terminal *unsentLineTerminal)
}

func newUnsentLineTerminal() *unsentLineTerminal {
	terminal := &unsentLineTerminal{current: time.Unix(1000, 0)}
	terminal.line = &EnteredLine{EnteredAt: terminal.current}
	terminal.watcher = &MenuWatcher{
		CurrentTime: func() time.Time { return terminal.current },
		EnteredLine: func() (EnteredLine, bool) {
			if terminal.line == nil {
				return EnteredLine{}, false
			}
			return *terminal.line, true
		},
		ForgetLine: func() { terminal.line = nil },
		EnterAgain: func() bool {
			terminal.enters++
			terminal.line = &EnteredLine{terminal.current, terminal.line.MoreEnters + 1}
			if terminal.onEnter != nil {
				terminal.onEnter(terminal)
			}
			return true
		},
		PendingText: func() string { return terminal.pending },
		OnAnswer: func(question, explanation string) {
			terminal.answers = append(terminal.answers, question+": "+explanation)
		},
	}
	return terminal
}

func (terminal *unsentLineTerminal) draw(text string) {
	_, _ = terminal.watcher.Write([]byte(text))
}

func (terminal *unsentLineTerminal) later(duration time.Duration) {
	terminal.current = terminal.current.Add(duration)
}

func TestALineLeftInTheInputBoxIsSentByASecondEnter(t *testing.T) {
	terminal := newUnsentLineTerminal()
	terminal.draw("❯ [journal] your context was compacted\r\n")
	terminal.later(time.Second)
	if terminal.watcher.CheckUnsentLine() || terminal.enters != 0 {
		t.Fatal("pressed Enter before the line had time to be sent")
	}
	terminal.later(2 * time.Second)
	terminal.onEnter = func(terminal *unsentLineTerminal) { terminal.draw("working\r\n") }
	if !terminal.watcher.CheckUnsentLine() || terminal.enters != 1 {
		t.Fatalf("the still screen got %d more Enters", terminal.enters)
	}
	terminal.later(2100 * time.Millisecond)
	terminal.draw("still working\r\n")
	if terminal.watcher.CheckUnsentLine() || terminal.enters != 1 || terminal.line != nil {
		t.Fatalf("a program that draws its work took the line: %d Enters, watched %v", terminal.enters, terminal.line)
	}
}

func TestALineTheProgramTookGetsNoSecondEnter(t *testing.T) {
	terminal := newUnsentLineTerminal()
	terminal.later(2500 * time.Millisecond)
	terminal.draw("working\r\n")
	if terminal.watcher.CheckUnsentLine() || terminal.enters != 0 || terminal.line != nil {
		t.Fatalf("a screen that changed half a second ago is a program at work: %d Enters", terminal.enters)
	}
}

func TestAMenuOrTextThePersonTypesKeepsTheSecondEnterAway(t *testing.T) {
	onMenu := newUnsentLineTerminal()
	onMenu.draw(switchModelScreen)
	onMenu.later(3 * time.Second)
	typing := newUnsentLineTerminal()
	typing.pending = "half a sen"
	typing.later(3 * time.Second)
	for name, terminal := range map[string]*unsentLineTerminal{"a menu": onMenu, "typed text": typing} {
		if terminal.watcher.CheckUnsentLine() || terminal.enters != 0 || terminal.line != nil {
			t.Fatalf("with %s on the screen Enter was pressed %d times", name, terminal.enters)
		}
	}
}

func TestAnEnterThatChangesNothingEndsTheWatchAndThreeThatDoNotSendAreToldOf(t *testing.T) {
	ignored := newUnsentLineTerminal()
	ignored.later(3 * time.Second)
	ignored.watcher.CheckUnsentLine()
	ignored.later(3 * time.Second)
	if ignored.watcher.CheckUnsentLine() || ignored.enters != 1 || ignored.line != nil || len(ignored.answers) != 0 {
		t.Fatalf("an Enter the screen did not answer was repeated: %d Enters, %v", ignored.enters, ignored.answers)
	}
	stubborn := newUnsentLineTerminal()
	stubborn.onEnter = func(terminal *unsentLineTerminal) {
		terminal.later(100 * time.Millisecond)
		terminal.draw("\r\n")
	}
	for range 5 {
		stubborn.later(3 * time.Second)
		stubborn.watcher.CheckUnsentLine()
	}
	if stubborn.enters != 3 || len(stubborn.answers) != 1 || !strings.Contains(stubborn.answers[0], "stays in the input box") || stubborn.line != nil {
		t.Fatalf("%d Enters and told %v", stubborn.enters, stubborn.answers)
	}
}
