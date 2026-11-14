from server.execution.session_starters import SessionStarters
from pathlib import Path

from engine.journal.journal_home import JournalHome
from contextlib import nullcontext
from types import SimpleNamespace
from unittest.mock import ANY, Mock

import pytest

from engine.driver.errors.old_hook_runner_error import OldHookRunnerError
from engine.time.clock import Clock
from server.endpoints.hook_endpoint import HookEndpoint
from server.hook.hook_sender import AGENT_HOOK_PRIORITY, MAIN_AGENT_HOOK_PRIORITY


def journal_home(folder: Path) -> JournalHome:
    home = JournalHome(folder / ".journal")
    home.folder.mkdir()
    return home


@pytest.mark.parametrize("event,refused", [("stop", True), ("pre_tool_use", False)])
def test_an_old_hook_runner_gets_an_immediate_unchecked_answer(event, refused, tmp_path):
    context = SimpleNamespace(home=journal_home(tmp_path), hook_database=SimpleNamespace(used=lambda priority, limit, owner, request: nullcontext()), hook_limit_seconds=1, agent_hook_limit_seconds=1, stop_limit_seconds=1, clock=Clock(),
                              listener_wakes=SimpleNamespace(wake=Mock()))
    endpoint = HookEndpoint(Mock(), context)
    endpoint.routed_answer = Mock(side_effect=OldHookRunnerError.detected())
    reply = endpoint.answer({"event": event}, "claude", {})
    assert bool(reply.refusal) is refused
    assert reply.hook_call_id is None
    assert "update the hook runner" in (reply.refusal if refused else reply.lines[0])


@pytest.mark.parametrize("role,priority,limit", [("worker", AGENT_HOOK_PRIORITY, 45), ("helper", AGENT_HOOK_PRIORITY, 45), ("main", MAIN_AGENT_HOOK_PRIORITY, 1), (None, MAIN_AGENT_HOOK_PRIORITY, 1)])
def test_a_hook_takes_its_place_in_the_queue_by_its_role(role, priority, limit, tmp_path, monkeypatch):
    # the role comes from the server's record of the session; one it has no row for counts as main
    monkeypatch.setattr(SessionStarters, "shared", staticmethod(lambda home: SimpleNamespace(role=lambda session: role or "main")))
    used = Mock(return_value=nullcontext())
    context = SimpleNamespace(home=journal_home(tmp_path), hook_database=SimpleNamespace(used=used), hook_limit_seconds=1, agent_hook_limit_seconds=45, stop_limit_seconds=1, clock=Clock(),
                              listener_wakes=SimpleNamespace(wake=Mock()))
    endpoint = HookEndpoint(Mock(), context)
    endpoint.routed_answer = Mock(side_effect=OldHookRunnerError.detected())
    endpoint.answer({"event": "pre_tool_use", "session": "s-1"}, "claude", {})
    used.assert_called_once_with(priority, limit, "s-1", ANY)
