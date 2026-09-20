import subprocess
import sys
import time
from pathlib import Path

import pytest

import features
from controllers.types import Agents, Nudges, Todos, Works
from engine.record import Record
from engine.sessions import Sessions
from features.auto.next import ready
from resources.base import AGENT, SYSTEM, USER
from tests.features.kit import report
from tests.conftest import refused

HERE = Path(__file__).resolve().parents[3]


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


@pytest.fixture(scope="module")
def env(tmp_path_factory):
    root = tmp_path_factory.mktemp("lent") / ".journal"
    record = Record(root, "main")
    sessions = Sessions(root)
    sessions.bind("claude-1", "main")
    return root, record, sessions


def cli(root, *argv, agent=""):
    p = subprocess.run(
        [sys.executable, str(HERE / "journal.py"), "--root", str(root), "--env", "main", "--session", "claude-1",
         *(("--agent", agent) if agent else ()), *argv],
        capture_output=True, text=True, timeout=30, cwd=root.parent)
    return p.returncode, (p.stdout + p.stderr).strip()


def test_a_subagent_writes_only_once_the_environment_is_lent_and_is_bound_by_the_same_law(env):
    root, record, sessions = env

    code, out = cli(root, "todo", "add", "a row from a subagent", agent="runner-1")
    assert (code, out) == (1, "! environment 'main' is not lent to this session's subagents: journal environment <n> grant first"), \
        "without a grant a subagent's write is refused, and told what the dispatcher must do"
    code, out = cli(root, "todo", "all", agent="runner-1")
    assert code == 0, "its reads are never refused"

    sessions.grant("claude-1", "main")
    code, out = cli(root, "todo", "add", "a row from a subagent", agent="runner-1")
    todos = Todos(record, actor=SYSTEM)
    assert (code, todos.load(1).data.get("agent")) == (0, "runner-1"), "with the grant the row is written, carrying the agent's mark"
    agents = Agents(record, actor=SYSTEM)
    runner = agents.by_session("runner-1")
    assert (runner.data.get("status"), runner.data.get("active", 0) > 0) == ("subagent", True), \
        "the agent row exists from the first write, stamped active, as a subagent"

    code, out = cli(root, "pin", "create", "a fact from a subagent", agent="runner-1")
    assert (code, out) == (1, "! a subagent never writes a pin: report it, and the main conversation files it"), \
        "a pin is not a subagent's to write"
    code, out = cli(root, "rule", "create", "a ruling from a subagent", agent="runner-1")
    assert code == 1, "nor a rule"

    Agents(record, actor=SYSTEM).by_session("claude-1")
    row = todos.create("a row for the runner")
    Todos(record, actor=AGENT).assign(row.n, to="runner-1")
    assert todos.load(row.n).data.get("assigned") == "runner-1", "assigned to one agent"
    assert refused(lambda: Works(record, actor=AGENT).create("taking it", todo=row.n)) == \
        f"todo {row.n} is assigned to runner-1; nobody else may take it", "another cannot start it"
    assert (row.n in [t.n for t in ready(record)]) is False, "auto mode skips an assigned row"
    code, out = cli(root, "work", "start", "the runner takes it", "--set", f"todo={row.n}", agent="runner-1")
    assert code == 0, "the agent it is assigned to may"

    code, out = cli(root, "todo", "report", str(row.n), "built and green", agent="runner-1")
    assert (code, todos.load(row.n).data.get("reported", {}).get("how")) == (0, "built and green"), \
        "report is the subagent's word"
    nudges = [n.title for n in Nudges(record).all()]
    assert (f"agent runner-1 reports todo {row.n} done" in nudges) is True, "the dispatcher is nudged with the report"
    assert todos.load(row.n).completed == 0.0, "the row is not closed by the report"
    assert refused(lambda: Todos(record, actor=AGENT).report(row.n, "x")) == \
        "report is a subagent's word — the dispatcher closes a row with done", "report without --agent is refused"

    record.set_setting("agents", {"lapse": 0})
    agents.update(agents.by_session("runner-1").n, active=time.time() - 120)
    report(record, "idle", "Stop")
    assert (todos.load(row.n).data.get("assigned"), todos.load(row.n).data.get("lapsed"),
            any("went silent" in t for t in [n.title for n in Nudges(record).all()])) == \
        ("", "runner-1", True), "a silent subagent's row is back on the list, and the dispatcher told which"
