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
check("the running step is the command the shell started, not a helper under it", steps.running(AGENT, rows), "python3 tests/test_a.py")
rows[105] = (102, "cat notes.md")
del rows[103]
check("the chain moves on to its next command", steps.running(AGENT, rows), "cat notes.md")
check("a server started straight under the agent is never a step", steps.running(AGENT, {AGENT: (1, "claude"), 101: (AGENT, "npm exec mcp")}), "")
check("another shell's processes are not this agent's", "vim" in steps.running(AGENT, rows), False)
pipeline = {AGENT: (1, "claude"), 300: (AGENT, "/bin/zsh -c journal todo all | grep x | awk y"), 301: (300, "journal todo all"), 302: (300, "grep x"), 303: (300, "awk y")}
check("in a pipeline the step is its first command, not the last filter", steps.running(AGENT, pipeline), "journal todo all")
pipeline.update({400: (AGENT, "/bin/zsh -c sleep 100"), 401: (400, "sleep 100")})
check("the newest command shell is the one the agent is waiting on", steps.running(AGENT, pipeline), "sleep 100")
check("nothing running: no step", steps.running(AGENT, {AGENT: (1, "claude")}), "")
check("the supervisor's session name carries the agent's pid both ways", pid_of(session_of("claude", 12837)), 12837)
check("a session name without a pid gives none", pid_of("9a08cbbb"), 0)
claude = PROVIDERS["claude"]()
check("a step's effect is worded like a command's", [claude.effect_of(c) for c in ("python3 tests/test_a.py", "cat notes.md", "rm -rf build", "node helper.js")], ["tests", "reads", "deletes", ""])

done()
