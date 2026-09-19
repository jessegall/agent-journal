import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Plugins  # noqa: E402
from engine.hooks import handle  # noqa: E402
from features.plugins.source import folder, home  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()
claude = PROVIDERS["claude"]()


def alone(env: str = "t"):
    record = fresh(env)
    record.set_setting("features", {"gate": False, "work": False})
    return record


def installed(record, name: str, guard: str, **manifest):
    where = folder(record.root, name)
    home(record.root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    (where / "guard.sh").write_text(guard)
    return Plugins(record, actor=SYSTEM).create(name, enabled=True, token="t0ken", settings={},
                                                manifest={"name": name, "refuse": "sh guard.sh", **manifest})


def writing(record, file: str = "a.py"):
    return handle(claude, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Edit",
                                                    "cwd": str(record.root.parent), "tool_input": {"file_path": str(record.root.parent / file)}})


def reading(record):
    return handle(claude, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Read",
                                                    "cwd": str(record.root.parent), "tool_input": {"file_path": str(record.root.parent / "a.py")}})


# A PLUGIN MAY REFUSE A WRITE, and its words reach the agent
record = alone()
installed(record, "guardian", "read x; echo '{\"refuse\": \"src/Generated is generated; edit the stub instead\"}'\n")
check("the plugin's reason is given to the agent, under its name", writing(record),
      {"decision": "block", "reason": "guardian: src/Generated is generated; edit the stub instead"})
check("a read is not asked about unless the plugin says it reads too", reading(record), {})

# WHAT IT DOES NOT REFUSE goes through
quiet = alone("quiet")
installed(quiet, "quiet", "read x; echo '{}'\n")
check("an empty answer lets the write through", writing(quiet), {})

# A GUARD THAT FAILS OR HANGS never stops the agent
broken = alone("broken")
installed(broken, "broken", "exit 9\n")
check("a guard that crashes lets the write through", writing(broken), {})
slow = alone("slow")
installed(slow, "slow", "sleep 30\n", refuse_seconds=0.4)
started = time.monotonic()
answered = writing(slow)
check("a guard that hangs is given up on, quickly, and the write goes through", (answered, time.monotonic() - started < 3), ({}, True))

# A PLUGIN THAT IS OFF, or removed, is not asked at all
off = alone("off")
row = installed(off, "off", "read x; echo '{\"refuse\": \"no\"}'\n")
Plugins(off, actor=SYSTEM).update(row.n, enabled=False)
check("a plugin switched off is not asked", writing(off), {})
Plugins(off, actor=SYSTEM).update(row.n, enabled=True)
Plugins(off, actor=SYSTEM).complete(row.n, "removed")
check("a removed plugin is not asked", writing(off), {})

# READS ARE ASKED ABOUT only when the plugin says so
readers = alone("readers")
installed(readers, "readers", "read x; echo '{\"refuse\": \"that file is secret\"}'\n", reads=True)
check("a plugin that asked for reads may refuse one", reading(readers), {"decision": "block", "reason": "readers: that file is secret"})

done()
