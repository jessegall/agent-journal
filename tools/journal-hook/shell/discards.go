package shell

import (
	"strings"

	"mvdan.cc/sh/v3/syntax"
)

const nullDevice = "/dev/null"

// Discards is what the redirects at the end of a command throw away: Bare is the command without them, and Stdout and
// Stderr say which stream no longer reaches the line's output. HasDiscard is false when no redirect goes to /dev/null.
type Discards struct {
	Bare       string
	Stdout     bool
	Stderr     bool
	HasDiscard bool
}

// ReadDiscards reads the redirects at the end of one command from its syntax tree, in the order the shell applies them,
// so 2>&1 >/dev/null keeps stderr and >/dev/null 2>&1 drops both.
func ReadDiscards(text string) Discards {
	command := strings.TrimSpace(text)
	file, err := Parse(command)
	if err != nil || len(file.Stmts) != 1 || len(file.Stmts[0].Redirs) == 0 {
		return Discards{Bare: text}
	}
	redirects := file.Stmts[0].Redirs
	first := len(redirects)
	for first > 0 && (goesToNull(redirects[first-1]) || joinsStderr(redirects[first-1])) {
		first--
	}
	trailing := redirects[first:]
	if len(trailing) == 0 || int(trailing[len(trailing)-1].End().Offset()) != len(command) || !hasNull(trailing) {
		return Discards{Bare: text}
	}
	stdoutShown, stderrShown := true, true
	for _, redirect := range trailing {
		switch {
		case joinsStderr(redirect):
			stderrShown = stdoutShown
		case redirect.Op == syntax.RdrAll || redirect.Op == syntax.AppAll:
			stdoutShown, stderrShown = false, false
		case redirect.N != nil && redirect.N.Value == "2":
			stderrShown = false
		default:
			stdoutShown = false
		}
	}
	return Discards{Bare: strings.TrimSpace(command[:trailing[0].Pos().Offset()]), Stdout: !stdoutShown, Stderr: !stderrShown, HasDiscard: true}
}

func goesToNull(redirect *syntax.Redirect) bool {
	switch redirect.Op {
	case syntax.RdrOut, syntax.AppOut, syntax.RdrAll, syntax.AppAll:
		return redirect.Word != nil && redirect.Word.Lit() == nullDevice
	}
	return false
}

func joinsStderr(redirect *syntax.Redirect) bool {
	return redirect.Op == syntax.DplOut && redirect.N != nil && redirect.N.Value == "2" && redirect.Word != nil && redirect.Word.Lit() == "1"
}

func hasNull(redirects []*syntax.Redirect) bool {
	for _, redirect := range redirects {
		if goesToNull(redirect) {
			return true
		}
	}
	return false
}
