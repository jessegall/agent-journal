import features
from controllers.types import Agents, Works
from features.helpers.controller import Helpers
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh
from tests.kit import nudges, report, tick


def test_a_wait_on_a_run_and_a_helper_stands_until_both_are_back_and_then_hands_back_their_results(monkeypatch):
    features.load()
    monkeypatch.setattr("agents.terminal.detached", lambda *given: 1)
    monkeypatch.setattr("providers.codex.Codex.models", lambda self: ("gpt-5.5",))
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    run = {"id": "toolu_1", "task_id": "b2gb9ud45", "command": "pytest -q", "task": "the suite", "running": True, "ended": 0.0, "status": ""}
    report(record, "idle", "Stop", shell_rows=[run])
    Helpers(record, actor=AGENT).dispatch("Rhea", "profile the hooks", provider="codex", model="gpt-5.5")
    works = Works(record, actor=AGENT)
    work = works.create("ship the helpers")
    works.action("await")("the suite and Rhea", on="b2gb9ud45, helper:1")
    works.update(work.n, awaiting_since=works.load(work.n).awaiting_since - 900)
    tick(record)
    report(record, "working", "PostToolUse", tool="Bash", wrote=True, commands=[{"command": "ls", "tool": "Bash", "at": 9e9}])
    assert works.load(work.n).awaiting == "the suite and Rhea", "working on meanwhile leaves a named wait standing"
    assert not [n for n in nudges(record) if "check the suite" in n], "a named wait is never asked about"
    report(record, "idle", "Stop", shell_rows=[{**run, "running": False, "ended": 5.0, "status": "completed"}])
    tick(record)
    assert works.load(work.n).awaiting_on == "b2gb9ud45,helper:1", "one back is not all back"
    Helpers(record, actor=AGENT).update(1, report="hooks spend 40ms in imports")
    tick(record)
    done = works.load(work.n)
    assert (done.awaiting, done.awaiting_on) == ("", ""), "the wait ends once every one is back"
    assert "the suite completed" in done.sections[-1]["body"] and "Rhea: hooks spend 40ms in imports" in done.sections[-1]["body"], "their results go into the work's log"
    assert [n for n in nudges(record) if n.startswith("the suite and Rhea came back")], "the agent is told once to carry on"
    from features.boards.controller import Boards
    from resources.base import Refused
    Boards(record, actor=AGENT).orchestrate("on")
    try:
        works.action("await")("Rhea", on="helper:1")
    except Refused as refusal:
        assert "does not wait on a helper" in str(refusal), "an orchestrating agent is refused a wait that names a helper"
    else:
        raise AssertionError("an orchestrating agent is refused a wait that names a helper")


def test_a_wait_on_a_run_that_finished_without_an_end_time_still_ends():
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    report(record, "idle", "Stop", shell_rows=[{"id": "toolu_2", "task_id": "bq9", "command": "pytest -q", "task": "the suite", "running": False, "ended": 0.0, "status": ""}])
    works = Works(record, actor=AGENT)
    work = works.create("ship it")
    works.action("await")("the suite", on="bq9")
    tick(record)
    assert works.load(work.n).awaiting == "", "a run that is no longer running ends the wait, whether or not it recorded when it ended"
