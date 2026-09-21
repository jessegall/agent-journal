import pytest

import features
from commands.http import dispatch
from features.plans.controller import Plans  # noqa: E402
from controllers.types import Agents, Messages, Questions, Todos, Works
from surfaces.summary import environment, summarize
from resources.base import AGENT, SYSTEM, USER
from tests.features.kit import idle, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_summary_names_an_environments_agent_work_counts_and_plans():
    record = fresh("main")

    empty = environment(record)
    assert (empty["name"], empty["agent"], empty["work"], empty["last"], empty["plans"], empty["counts"]) == \
        ("main", None, None, None, [], {"messages": 0, "questions": 0, "todos": 0, "suggestions": 0}), \
        "an environment nobody has visited has no agent, no work and nothing counted"

    Agents(record, actor=AGENT).by_session("claude-1")
    idle(record, provider="claude", model="m", context=41.5)
    assert {k: environment(record)["agent"][k] for k in ("status", "provider", "model", "context")} == \
        {"status": "idle", "provider": "claude", "model": "m", "context": 41.5}, \
        "an idle agent is reported with its provider, model and context"

    Todos(record, actor=AGENT).create(title="a row", brief="why")
    Works(record, actor=AGENT).create(title="on the row", todo=1)
    report(record, "working", "PreToolUse")
    got = environment(record)
    assert (got["agent"]["status"], got["work"]) == ("working", {"n": 1, "title": "on the row", "todo": 1}), \
        "declared work is the current work, with its to-do"
    Works(record, actor=AGENT).complete(1, how="over")
    got = environment(record)
    assert (got["work"], got["last"]["n"]) == (None, 1), "ended work is only the last work"

    Messages(record, actor=AGENT).create(title="for you")
    Messages(record, actor=USER).create(title="for the agent")
    Questions(record, actor=AGENT).create(title="which?")
    assert environment(record)["counts"] == {"messages": 1, "questions": 1, "todos": 1, "suggestions": 0}, \
        "counts are what the user waits on: messages unread by them, open questions and to-dos"

    plans = Plans(record, actor=AGENT)
    plans.create(title="the plan", goal="all")
    plans.phase(1, "First")
    plans.phase(1, "Second", checkpoint=True)
    Todos(record, actor=AGENT).create(title="a second row", brief="why")
    plans.place(1, 1, [1])
    plans.place(1, 2, [2])
    plans.ready(1)
    Plans(record, actor=USER).activate(1)
    got = environment(record)["plans"]
    assert got == [{"n": 1, "title": "the plan", "status": "active", "current": 1, "phase": "First", "phases": 2, "rows": 2, "done": 0}], \
        "an active plan says its phase and how many of its rows are done"
    Todos(record, actor=AGENT).complete(1, how="shipped")
    assert environment(record)["plans"][0]["done"] == 1, "each row done counts towards the plan, whichever phase it sits in"
    made = plans.create(title="draft", goal="g")
    assert [(p["n"], p["status"]) for p in environment(record)["plans"]] == [(1, "active"), (made.n, "building")], \
        "a plan still being written is shown too, so the user can watch it take shape"

    whole = summarize(record.root)
    assert (whole["project"], whole["root"], bool(whole["version"]), whole["start"], [e["name"] for e in whole["environments"]]) == \
        (record.root.parent.name, str(record.root), True, "main", ["main"]), \
        "the summary names the project, its root, version, start environment and every environment"
    reply = dispatch("GET", "/api/summary", record.root, {}, {})
    assert (reply.code, reply.body["environments"][0]["counts"]["questions"]) == (200, 1), "every viewer answers /api/summary"
