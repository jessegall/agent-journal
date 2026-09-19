import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine import steps  # noqa: E402
from engine.terminal import pid_of, session_of  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from tests.kit import check, done  # noqa: E402

AGENT = 100
rows = {
    AGENT: (1, "claude"),
    101: (AGENT, "npm exec @playwright/mcp@latest"),
    102: (AGENT, "/bin/zsh -c source snapshot; python3 tests/test_a.py && cat notes.md"),
    103: (102, "python3 tests/test_a.py"),
    104: (103, "node helper.js"),
    200: (1, "/bin/zsh -c other"),
    201: (200, "vim x"),
}
check("the newest process under the agent's command shell is the running step", steps.running(AGENT, rows), "node helper.js")
del rows[104]
check("when it ends, its parent is the step again", steps.running(AGENT, rows), "python3 tests/test_a.py")
rows[105] = (102, "cat notes.md")
del rows[103]
check("the chain moves on to its next command", steps.running(AGENT, rows), "cat notes.md")
check("a server started straight under the agent is never a step", steps.running(AGENT, {AGENT: (1, "claude"), 101: (AGENT, "npm exec mcp")}), "")
check("another shell's processes are not this agent's", "vim" in steps.running(AGENT, rows), False)
check("nothing running: no step", steps.running(AGENT, {AGENT: (1, "claude")}), "")
check("the supervisor's session name carries the agent's pid both ways", pid_of(session_of("claude", 12837)), 12837)
check("a session name without a pid gives none", pid_of("9a08cbbb"), 0)
claude = PROVIDERS["claude"]()
check("a step's effect is worded like a command's", [claude.effect_of(c) for c in ("python3 tests/test_a.py", "cat notes.md", "rm -rf build", "node helper.js")], ["tests", "reads", "deletes", ""])

done()
