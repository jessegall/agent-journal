package shellbridge

import (
	"errors"
	"testing"
)

// observedScript is the command string Claude Code 2.1.323 handed its shell for one Bash tool call, as recorded in
// docs/accounts/claude-integration.md, section Shell handoff: the model's command single-quoted inside an eval.
const observedScript = `{ \builtin shopt -u extglob || \builtin setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true && ` +
	`eval 'GREETING=hello; echo "$GREETING $HOME" > /workspace/redirected.txt; echo piped | tr a-z A-Z; sleep 1 & id -u'` +
	` < /dev/null && pwd -P >| /tmp/claude-f418-cwd`

func TestTheCommandOfClaudesLoginShellCallIsKeptExactly(t *testing.T) {
	command, err := CommandOf([]string{"-c", "-l", observedScript})
	if err != nil {
		t.Fatalf("CommandOf: %v", err)
	}

	if command != observedScript {
		t.Fatalf("the command changed on its way: %q", command)
	}
}

func TestGroupedOptionsAndAnEndOfOptionsMarkAreRead(t *testing.T) {
	for _, arguments := range [][]string{{"-lc", "env"}, {"-c", "--", "env"}, {"-c", "env"}} {
		command, err := CommandOf(arguments)
		if err != nil || command != "env" {
			t.Fatalf("CommandOf(%q) = %q, %v; want env", arguments, command, err)
		}
	}
}

func TestACallWithoutACommandIsRefused(t *testing.T) {
	for _, arguments := range [][]string{{}, {"-l"}, {"-i"}, {"-c"}, {"script.sh"}} {
		if _, err := CommandOf(arguments); !errors.Is(err, ErrNoCommand) {
			t.Fatalf("CommandOf(%q) answered %v; want ErrNoCommand", arguments, err)
		}
	}
}

func TestArgumentsAfterTheCommandAreRefused(t *testing.T) {
	if _, err := CommandOf([]string{"-c", "echo $1", "name", "first"}); !errors.Is(err, ErrPositionalArguments) {
		t.Fatalf("answered %v; want ErrPositionalArguments", err)
	}
}
