import json
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Environments  # noqa: E402
from engine.hooks import answer  # noqa: E402
from engine.record import Record  # noqa: E402
from engine.sessions import Sessions, agent_pid, live  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

claude = PROVIDERS["claude"]()


def start(root: Path, session: str, pid: int) -> str:
    answer(claude, root, {"hook_event_name": "SessionStart", "session_id": session}, pid)
    return Sessions(root).environment(session)


def gone() -> int:
    p = subprocess.Popen(["true"])
    p.wait()
    return p.pid


def envs(root: Path) -> list[str]:
    return [e.title for e in Environments(Record(root, "main"), actor=SYSTEM).all()]


# A FIRST START with no environment at all makes main and seats the agent on it
root = fresh("main").root
check("no environment yet", envs(root), [])
check("the first session is bound to main", start(root, "s-1", os.getpid()), "main")
check("main now exists as an environment, held by that session", (envs(root), Environments(Record(root, "main"), actor=SYSTEM).all()[0].data.get("holder")), (["main"], "s-1"))

# A RESTART: the old session's agent is gone, the new one returns to the environment it left
Environments(Record(root, "main"), actor=SYSTEM).create("feature-x")
Sessions(root).bind("s-2", "feature-x", pid=gone(), provider="claude")
check("the old session's process is gone, so it no longer holds its environment", Sessions(root).holder("feature-x"), "")
check("a restarted agent reclaims the environment it was on", start(root, "s-3", os.getpid()), "feature-x")

# AN OCCUPIED ENVIRONMENT is not taken: another live agent holds it
Sessions(root).bind("s-4", "feature-y", pid=gone(), provider="claude")
Sessions(root).bind("s-5", "feature-y", pid=os.getpid(), provider="claude")
Sessions(root).write("s-4", seen=time.time() + 100)
check("the newest ended session's environment is held by someone alive: fall back to the start environment", start(root, "s-6", os.getpid()), "main")

# A RESUMED SESSION keeps its own environment when it is free
Sessions(root).bind("s-7", "feature-z", pid=gone(), provider="claude")
check("resuming the same session: back on its own environment", start(root, "s-7", os.getpid()), "feature-z")

# ANOTHER PROVIDER'S ended session is not this agent's previous environment
Sessions(root).bind("codex-1", "codex-env", pid=gone(), provider="codex")
check("a Claude session never lands on a Codex session's environment", start(root, "s-8", os.getpid()) != "codex-env", True)

# AN EXPLICIT SWITCH stays where it was put
Sessions(root).bind("s-9", "main", pid=os.getpid(), provider="claude")
Sessions(root).bind("s-9", "feature-x", pid=os.getpid(), provider="claude")
check("after a switch the session reports on the environment it was switched to", start(root, "s-9", os.getpid()), "feature-x")

# LIVENESS follows the agent's own process, not a shell between it and the hook
shell = subprocess.Popen(["sh", "-c", "sleep 5; true"])
time.sleep(0.2)
check("a shell pid climbs to the process that started it", agent_pid(shell.pid), os.getpid())
shell.kill()
check("a session whose agent process is gone is not live, however recent", live({"pid": gone(), "seen": time.time()}), False)
check("with no pid, a recent report still counts", live({"seen": time.time()}), True)
Sessions(root).bind("s-10", "main", pid=4242, provider="claude")
Sessions(root).bind("s-10", "feature-x")
check("a switch without a pid keeps the agent's process on record", Sessions(root).read("s-10").get("pid"), 4242)

done()
