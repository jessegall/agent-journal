import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents  # noqa: E402
from engine import viewer  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

shown = []
up = {"url": "http://127.0.0.1:8422/"}
viewer.running = lambda root: up["url"]
viewer.show = lambda url: shown.append(url)

# BEFORE THE SESSION STARTS nothing opens: a startup or resume menu keeps the terminal
record = fresh()
Agents(record, actor=SYSTEM).create("claude-1")
report(record, "working", "UserPromptSubmit")
check("no session start yet: the tab is left alone", shown, [])

# THE SESSION STARTS: the viewer is shown once
report(record, "idle", "SessionStart")
check("the session started: its viewer is shown", shown, ["http://127.0.0.1:8422/"])
report(record, "idle", "SessionStart")
report(record, "working", "PreToolUse")
check("a second start of the same session, a compaction or a clear, shows nothing more", len(shown), 1)

# ANOTHER SESSION starts: it gets its own showing
report(record, "idle", "SessionStart", session="claude-2")
check("a new session shows the viewer again", len(shown), 2)

# NO VIEWER RUNNING: nothing to show, and the session may still be shown later
up["url"] = ""
report(record, "idle", "SessionStart", session="claude-3")
up["url"] = "http://127.0.0.1:8424/"
report(record, "idle", "SessionStart", session="claude-3")
check("no viewer: nothing; once one runs, the next start shows it", shown[2:], ["http://127.0.0.1:8424/"])

# A SUBAGENT'S SESSION is not the launch
Agents(record, actor=SYSTEM).create("child-1", parent="claude-1")
report(record, "idle", "SessionStart", session="child-1")
check("a subagent starting shows nothing", len(shown), 3)

done()
