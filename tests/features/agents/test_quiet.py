import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
sessions = features.FEATURES["agents"]
agents = Agents(record, actor=SYSTEM)

report(record, "working", "PreToolUse", session="claude-1")
report(record, "working", "PreToolUse", session="claude-2")
check("a session that just wrote is left alone", [r.n for r in sessions.quieted(record)], [])

quiet = agents.by_session("claude-2")
agents.stamp(quiet.n, at=time.time() - 2 * 60 * 60)
check("one silent past the hour is marked stopped", ([r.title for r in sessions.quieted(record)], agents.by_session("claude-2").status), (["claude-2"], "stopped"))
check("the one still writing keeps its status", agents.by_session("claude-1").status, "working")
check("and it is not marked twice", [r.title for r in sessions.quieted(record)], [])

record.set_setting("agents", {"quiet": 1})
agents.stamp(agents.by_session("claude-1").n, at=time.time() - 5 * 60)
check("the setting says how long the silence may be", [r.title for r in sessions.quieted(record)], ["claude-1"])

done()
