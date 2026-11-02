package launch

import (
	"fmt"
	"sync"
	"time"
)

const (
	// menuLookEvery is how often the watcher looks at the screen.
	menuLookEvery = time.Second
	// menuQuiet is how long the screen must have been still, so a menu still being drawn is not answered.
	menuQuiet = 1500 * time.Millisecond
	// menuCausedWithin is how soon after the journal typed a line a menu was caused by that line, and is confirmed.
	menuCausedWithin = 15 * time.Second
	// menuYoursWithin is how soon after keys at the keyboard a menu is the person's own.
	menuYoursWithin = 3 * time.Second
	// menuScreenBytes is how much of the screen's latest bytes the watcher keeps to read a menu from.
	menuScreenBytes   = 8192
	menuQuestionShown = 160
)

// MenuAnswer is what the watcher pressed on a menu and the words for it.
type MenuAnswer struct {
	Keys     string
	Question string
	Said     string
}

// MenuWatcher reads an agent's screen and keeps the agent from sitting at a menu: one the journal or the person caused is
// confirmed, the trust question for the launched folder accepted, any other declined or closed with Escape. A menu the
// person opened at the keyboard that asks no yes or no is theirs, and a permission question or a list of past sessions
// is left alone.
type MenuWatcher struct {
	mutex     sync.Mutex
	screen    []byte
	changedAt time.Time
	seen      string
	seenAt    time.Time
	Now       func() time.Time
	KeyedAt   func() time.Time
	TypedAt   func() time.Time
	Press     func(keys string) bool
	Told      func(question, said string)
}

// NewMenuWatcher watches the agent's terminal through its input, and tells of what it pressed.
func NewMenuWatcher(inputs *TerminalInputs, agentID int, told func(question, said string)) *MenuWatcher {
	return &MenuWatcher{
		Now:     time.Now,
		KeyedAt: func() time.Time { return inputs.KeyedAt(agentID) },
		TypedAt: func() time.Time { return inputs.TypedAt(agentID) },
		Press:   func(keys string) bool { return inputs.PressKeys(agentID, keys) },
		Told:    told,
	}
}

// Write keeps the screen's latest bytes.
func (watcher *MenuWatcher) Write(output []byte) (int, error) {
	watcher.mutex.Lock()
	defer watcher.mutex.Unlock()
	watcher.screen = append(watcher.screen, output...)
	if len(watcher.screen) > menuScreenBytes {
		watcher.screen = watcher.screen[len(watcher.screen)-menuScreenBytes:]
	}
	watcher.changedAt = watcher.Now()
	return len(output), nil
}

// Watch looks at the screen until the stop channel closes.
func (watcher *MenuWatcher) Watch(stop <-chan struct{}) {
	ticker := time.NewTicker(menuLookEvery)
	defer ticker.Stop()
	for {
		select {
		case <-stop:
			return
		case <-ticker.C:
			watcher.Look()
		}
	}
}

// Look is one look at the screen: it answers a menu that waits and tells of it, and says what it pressed, or nil. The
// telling comes after the screen is free again, so a slow journal never holds up the program's output.
func (watcher *MenuWatcher) Look() *MenuAnswer {
	answer := watcher.answered()
	if answer != nil && watcher.Told != nil {
		watcher.Told(answer.Question, answer.Said)
	}
	return answer
}

// answered presses what the menu on the screen asks for. The screen read so far is then dropped, so the same menu drawn
// again later is answered again and an old one never is.
func (watcher *MenuWatcher) answered() *MenuAnswer {
	watcher.mutex.Lock()
	defer watcher.mutex.Unlock()
	now := watcher.Now()
	menu := ReadTerminalMenu(string(watcher.screen))
	if menu == nil || !menu.Foreign() {
		watcher.seen = ""
		return nil
	}
	if watcher.seen != menu.Signature() {
		watcher.seen, watcher.seenAt = menu.Signature(), now
	}
	if now.Sub(watcher.changedAt) < menuQuiet {
		return nil
	}
	yours := watcher.KeyedAt().After(watcher.seenAt.Add(-menuYoursWithin))
	if yours && !menu.Confirming() {
		return nil
	}
	caused := yours || watcher.TypedAt().After(watcher.seenAt.Add(-menuCausedWithin))
	keys, said := menuDecision(menu, caused)
	if !watcher.Press(keys) {
		return nil
	}
	watcher.screen, watcher.seen = nil, ""
	question := menu.Question
	if len(question) > menuQuestionShown {
		question = question[len(question)-menuQuestionShown:]
	}
	return &MenuAnswer{keys, question, said}
}

func menuDecision(menu *TerminalMenu, caused bool) (string, string) {
	if caused {
		taken := menu.Accepting()
		return menu.KeysFor(taken), fmt.Sprintf("chose %q, since it confirms what was asked for", taken.Label)
	}
	if menu.Trusting() {
		taken := menu.Accepting()
		return menu.KeysFor(taken), fmt.Sprintf("chose %q", taken.Label)
	}
	if taken, declines := menu.Declining(); declines {
		return menu.KeysFor(taken), fmt.Sprintf("chose %q", taken.Label)
	}
	return MenuKeyEscape, "closed it with Escape, since nothing asked for it"
}
