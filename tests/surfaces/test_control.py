import json
import time
from unittest.mock import patch

import pytest

from commands.http import dispatch
from controllers.types import Agents, Notices, Notifications
from engine.drivers import Driver
from engine.engine import Engine
from engine.inputs import FORCE, queue, take
from engine.record import Record
from engine.sessions import Sessions
from surfaces.control import CARRY_ON, force, options, request
from providers.codex import Codex
from resources.base import SYSTEM
from resources.types import AgentRow
from tests.conftest import refused


class FakeCodex(Driver):
    name = "codex"

    def __init__(self, record):
        super().__init__(record, "codex-live", fd=1)
        self.sent = []

    def command(self, args):
        return ["true"]

    def send(self, text):
        self.sent.append(text)

    def last_report(self):
        return AgentRow(title=self.session, data={"status": "idle", "event": "Stop", "provider": "codex", "at": time.time()})

    def quiet_for(self):
        return 3.0


class Supervised(FakeCodex):
    def __init__(self, record):
        super().__init__(record)
        self.session = "codex-4242"

    def last_report(self):
        return AgentRow(title="codex-live", data={"status": "idle", "event": "Stop", "provider": "codex", "at": time.time()})


class Busy(FakeCodex):
    def __init__(self, record):
        super().__init__(record)
        self.status, self.stopped = "working", 0

    def stop_turn(self):
        self.stopped += 1
        self.status = "idle"

    def last_report(self):
        return AgentRow(title="codex-live", data={"status": self.status, "event": "PreToolUse" if self.status == "working" else "Stop", "provider": "codex", "at": time.time()})

    def quiet_for(self):
        return 0.0 if self.status == "working" else 30.0

    def at_prompt(self):
        return self.status == "idle"


MODELS = [
    {
        "slug": "gpt-5.6-sol",
        "display_name": "GPT-5.6-Sol",
        "default_reasoning_level": "medium",
        "supported_reasoning_levels": [{"effort": level} for level in ("low", "medium", "high", "xhigh", "max")],
    },
    {
        "slug": "gpt-5.6-luna",
        "display_name": "GPT-5.6-Luna",
        "default_reasoning_level": "medium",
        "supported_reasoning_levels": [{"effort": level} for level in ("low", "medium", "high", "xhigh")],
    },
]
CONFIGURATION = {"model": "gpt-5.6-sol", "effort": "xhigh"}


@pytest.fixture(scope="module")
def env(tmp_path_factory):
    root = tmp_path_factory.mktemp("control") / ".journal"
    record = Record(root, "main")
    Record(root, "other")
    Sessions(root).write("codex-live", environment="main", seen=time.time())
    seat = {"at": time.time(), "agent": "codex", "state": "idle", "env": "main", "report": {"title": "codex-live", "provider": "codex", "model": "gpt-5.6-sol"}}
    (root / "runtime" / "seat-codex-live.json").write_text(json.dumps(seat))
    return root, record


def test_a_live_agent_is_controlled_by_model_and_effort_choices_queued_and_typed_by_the_engine(env):
    root, record = env
    with patch.object(Codex, "catalog", classmethod(lambda cls, path=None: MODELS)), \
            patch.object(Codex, "configuration", classmethod(lambda cls, path=None: CONFIGURATION)):
        claude = options("claude")
        codex = options("codex", CONFIGURATION["model"])
        assert ([group["key"] for group in claude["groups"]], [group["key"] for group in codex["groups"]]) == \
            (["model", "effort"], ["model", "effort"]), "Claude and Codex expose model and effort choices"
        assert codex["groups"][0]["choices"] == [{"value": "gpt-5.6-sol", "label": "GPT-5.6-Sol"}, {"value": "gpt-5.6-luna", "label": "GPT-5.6-Luna"}], \
            "Codex exposes the catalog model labels"
        assert [choice["value"] for choice in codex["groups"][1]["choices"]] == ["low", "medium", "high", "xhigh", "max"], \
            "Codex exposes the selected model's efforts"
        assert ("command" in claude["groups"][0]["choices"][0]) is False, "commands stay server-side"
        assert [choice["value"] for choice in claude["groups"][0]["choices"]] == ["opus", "sonnet", "haiku", "claude-fable-5-1"], \
            "Claude exposes Fable in its cloud model picker"
        assert refused(lambda: request(root, "main", "codex-live", "model", "gpt-5")) == "codex does not support model 'gpt-5'", \
            "an unknown control is refused"
        assert refused(lambda: request(root, "other", "codex-live", "model", "gpt-5.6-sol")) == "session 'codex-live' belongs to environment 'main'", \
            "another environment cannot control the session"
        assert refused(lambda: request(root, "main", "gone", "picker", "open")) == "session 'gone' is not online", \
            "an offline session cannot be controlled"

        listed = dispatch("GET", "/api/agent-controls/codex", root, {"model": CONFIGURATION["model"]}, {})
        posted = dispatch("POST", "/api/main/agent/codex-live/control", root, {}, {"action": "model", "value": "gpt-5.6-luna"})
        assert (listed.code, listed.body["provider"], posted.code, take(root, {"codex-live"})["line"]) == (200, "codex", 200, "/model"), \
            "the viewer API lists and queues controls"
        while take(root, {"codex-live"}):
            pass

        queued = request(root, "main", "codex-live", "effort", "high")
        assert Agents(record, actor=SYSTEM).by_session("codex-live").pending.get("effort", {}).get("value") == "high", \
            "a queued choice shows as pending on the agent's row"
        assert (queued["provider"], "line" in queued, queued["queued"]) == ("codex", False, True), \
            "a supported choice queues a control without exposing its CLI command"
        driver = FakeCodex(record)
        engine = Engine(record, driver)
        assert (engine.control(), driver.sent) == ("controlled: High", ["/model"]), \
            "the live engine starts the native picker for a choice"
        assert ("effort" in Agents(record, actor=SYSTEM).by_session("codex-live").pending) is False, \
            "once typed, the choice is no longer pending"
        announced = [n for n in Notices(record).all() if n.data.get("action") == "effort"]
        assert (len(announced), all(n.completed for n in announced), announced[0].title) == (1, True, "Setting effort to high — waiting for the agent"), \
            "the queued change was announced over the chat, and the announcement closed once typed"
        assert [n.title for n in Notifications(record).all()][-1] == "Effort set to high", "its delivery is told to the user"
        assert (engine.control(), take(root, {"codex-live"})["line"]) == ("", ""), "a control is consumed once per engine tick"
        while take(root, {"codex-live"}):
            pass

        request(root, "main", "codex-live", "effort", "high")
        supervised = Supervised(record)
        assert (Engine(record, supervised).control(), supervised.sent) == ("controlled: High", ["/model"]), \
            "a control queued under the agent's own session reaches the engine that runs it under its terminal name"
        queue(root, "codex-live", "/model", "Old", provider="codex")
        for path in (root / "runtime" / "inputs").glob("*.json"):
            path.write_text(json.dumps({**json.loads(path.read_text()), "at": time.time() - 3600}))
        assert (take(root, {"codex-live"}), list((root / "runtime" / "inputs").glob("*.json"))) == ({}, []), \
            "a control left waiting for an hour is dropped, not typed late"

        busy = Busy(record)
        forcing = Engine(record, busy)
        request(root, "main", "codex-live", "effort", "high")
        assert (forcing.control(), busy.sent) == ("", []), "while the agent works, a queued change waits"
        assert (Engine(record, Supervised(record)).forced(), busy.stopped) == ("", 0), "an agent that is not busy is never forced"
        force(root, "main", "codex-live")
        assert (forcing.forced(), busy.stopped, busy.sent) == ("controlled: High", 1, ["/model", CARRY_ON]), \
            "force stops the turn, and once the prompt is back types the change and tells the agent to carry on, without waiting for an idle report"
        assert refused(lambda: force(root, "main", "gone")) == "session 'gone' is not online", "force takes the offline check like any control"
        while take(root, {"codex-live"}) or take(root, {"codex-live"}, FORCE):
            pass


def test_an_active_model_missing_from_the_catalog_still_gets_its_effort_choices_and_a_choice_still_reaches_the_picker():
    with patch.object(Codex, "configuration", classmethod(lambda cls, path=None: {"model": "gpt-5.6-luna", "effort": "medium"})):
        dated = Codex.controls_for(MODELS, "gpt-5.6-sol-2026-09-01")
        assert ([g["key"] for g in dated["groups"]], [c["value"] for c in dated["groups"][1]["choices"]]) == \
            (["model", "effort"], ["low", "medium", "high", "xhigh", "max"]), \
            "a dated id finds its catalog model, and the effort group stays"
        unknown = Codex.controls_for(MODELS, "something-else")
        assert [g["key"] for g in unknown["groups"]] == ["model", "effort"], \
            "an unknown id falls back to the configured model's efforts"
        assert Codex.commands(MODELS, "effort", "high", "something-else", "medium")[0] == "/model", \
            "an effort choice for an unmatched model still builds the picker's keys"


def test_a_control_the_cli_applies_at_once_never_shows_as_waiting(env):
    root, record = env
    Sessions(root).write("claude-live", environment="main", seen=time.time())
    (root / "runtime" / "seat-claude-live.json").write_text(json.dumps(
        {"at": time.time(), "agent": "claude", "state": "idle", "env": "main",
         "report": {"title": "claude-live", "provider": "claude", "model": "opus"}}))
    claude_live = "claude-live"
    at_once = request(root, "main", claude_live, "effort", "high")
    assert (at_once["queued"], "effort" in Agents(record, actor=SYSTEM).by_session(claude_live).pending,
            [n for n in Notices(record).all() if n.data.get("action") == "effort" and not n.completed]) == \
        (False, False, []), "an effort change on Claude is not queued and never shows as waiting"
