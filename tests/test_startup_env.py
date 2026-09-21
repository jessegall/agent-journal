import os
import subprocess
import time
from pathlib import Path

from controllers.types import Environments
from engine.hooks import answer
from engine.record import Record
from engine.sessions import Sessions, agent_pid, live
from providers import PROVIDERS
from resources.base import SYSTEM
from tests.conftest import fresh

CLAUDE = PROVIDERS["claude"]()


def start(root, session, pid):
    answer(CLAUDE, root, {"hook_event_name": "SessionStart", "session_id": session}, pid)
    return Sessions(root).environment(session)


def gone():
    p = subprocess.Popen(["true"])
    p.wait()
    return p.pid


def envs(root):
    return [e.title for e in Environments(Record(root, "main"), actor=SYSTEM).all()]


def test_a_first_start_with_no_environment_makes_main_and_seats_the_agent():
    root = fresh("main").root
    assert envs(root) == [], "no environment yet"
    assert start(root, "s-1", os.getpid()) == "main", "the first session is bound to main"
    assert (envs(root), Environments(Record(root, "main"), actor=SYSTEM).all()[0].data.get("holder")) == (["main"], "s-1"), \
        "main now exists as an environment, held by that session"

    Environments(Record(root, "main"), actor=SYSTEM).create("feature-x")
    Sessions(root).bind("s-2", "feature-x", pid=gone(), provider="claude")
    assert Sessions(root).holder("feature-x") == "", "the old session's process is gone, so it no longer holds its environment"
    assert start(root, "s-3", os.getpid()) == "feature-x", "a restarted agent reclaims the environment it was on"

    Sessions(root).bind("s-4", "feature-y", pid=gone(), provider="claude")
    Sessions(root).bind("s-5", "feature-y", pid=os.getpid(), provider="claude")
    Sessions(root).write("s-4", seen=time.time() + 100)
    assert start(root, "s-6", os.getpid()) == "main", \
        "the newest ended session's environment is held by someone alive: fall back to the start environment"

    Sessions(root).bind("s-7", "feature-z", pid=gone(), provider="claude")
    assert start(root, "s-7", os.getpid()) == "feature-z", "resuming the same session: back on its own environment"

    Sessions(root).bind("codex-1", "codex-env", pid=gone(), provider="codex")
    assert start(root, "s-8", os.getpid()) != "codex-env", "a Claude session never lands on a Codex session's environment"

    Sessions(root).bind("s-9", "main", pid=os.getpid(), provider="claude")
    Sessions(root).bind("s-9", "feature-x", pid=os.getpid(), provider="claude")
    assert start(root, "s-9", os.getpid()) == "feature-x", "after a switch the session reports on the environment it was switched to"

    shell = subprocess.Popen(["sh", "-c", "sleep 5; true"])
    time.sleep(0.2)
    assert agent_pid(shell.pid) == os.getpid(), "a shell pid climbs to the process that started it"
    shell.kill()
    assert live({"pid": gone(), "seen": time.time()}) is False, "a session whose agent process is gone is not live, however recent"
    assert live({"seen": time.time()}) is True, "with no pid, a recent report still counts"
    Sessions(root).bind("s-10", "main", pid=4242, provider="claude")
    Sessions(root).bind("s-10", "feature-x")
    assert Sessions(root).read("s-10").get("pid") == 4242, "a switch without a pid keeps the agent's process on record"
