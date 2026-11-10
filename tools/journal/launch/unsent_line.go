package launch

import "time"

const (
	// unsentLookAfter is how long after an Enter the watcher first judges whether the line was sent.
	unsentLookAfter = 2 * time.Second
	// unsentStill is how long the screen must have been still for the line to count as unsent: a program that took
	// a line draws its work.
	unsentStill = time.Second
	// unsentEnters is how many more Enters a line gets before the watcher gives up.
	unsentEnters = 3

	unsentQuestion    = "A line the journal typed stays in the input box"
	unsentExplanation = "pressed Enter 3 more times, and the screen stayed still each time"
)

// CheckUnsentLine presses Enter again for a line the journal entered that the program did not send: the screen went
// still after the Enter, where a program that took a line draws its work. It says whether it pressed. A menu on the
// screen, text the person is typing and an Enter that changed nothing on the screen each end the watch without a
// press, and after unsentEnters presses the watcher gives up and tells of it.
func (watcher *MenuWatcher) CheckUnsentLine() bool {
	if watcher.EnteredLine == nil {
		return false
	}
	line, ok := watcher.EnteredLine()
	if !ok {
		return false
	}
	watcher.mutex.Lock()
	currentAt, changedAt := watcher.CurrentTime(), watcher.changedAt
	hasMenu := ReadTerminalMenu(string(watcher.screen)) != nil
	watcher.mutex.Unlock()
	if currentAt.Sub(line.EnteredAt) < unsentLookAfter {
		return false
	}
	isStill := currentAt.Sub(changedAt) >= unsentStill
	wasEnterIgnored := line.MoreEnters > 0 && !changedAt.After(line.EnteredAt)
	if !isStill || hasMenu || wasEnterIgnored || watcher.PendingText() != "" {
		watcher.ForgetLine()
		return false
	}
	if line.MoreEnters >= unsentEnters {
		watcher.ForgetLine()
		if watcher.OnAnswer != nil {
			watcher.OnAnswer(unsentQuestion, unsentExplanation)
		}
		return false
	}
	return watcher.EnterAgain()
}
