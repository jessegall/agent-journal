from pathlib import Path

from engine.journal.journal_home import JournalHome
from contextlib import nullcontext
from types import SimpleNamespace
from unittest.mock import ANY, Mock

import pytest

from engine.driver.errors.old_hook_runner_error import OldHookRunnerError
from server.endpoints.hook_endpoint import HookEndpoint
from server.enums.queue_priority import QueuePriority


@pytest.mark.parametrize("event,refused", [("stop", True), ("pre_tool_use", False)])
def test_an_old_hook_runner_gets_an_immediate_unchecked_answer(event, refused):
    context = SimpleNamespace(home=JournalHome(Path('/nonexistent-journal-home') / '.journal'), hook_database=SimpleNamespace(used=lambda priority, limit, owner, request: nullcontext()), hook_limit_seconds=1, agent_hook_limit_seconds=1,
                              listener_thread=SimpleNamespace(wake=Mock()))
    endpoint = HookEndpoint(Mock(), context)
    endpoint.routed_answer = Mock(side_effect=OldHookRunnerError.detected())
    reply = endpoint.answer({"event": event}, "claude", {})
    assert bool(reply.refusal) is refused
    assert reply.hook_call_id is None
    assert "update the hook runner" in (reply.refusal if refused else reply.lines[0])


@pytest.mark.parametrize("role,priority,limit", [("worker", QueuePriority.AGENT_HOOK, 45), ("helper", QueuePriority.AGENT_HOOK, 45), ("main", QueuePriority.MAIN_AGENT_HOOK, 1), (None, QueuePriority.MAIN_AGENT_HOOK, 1)])
def test_a_hook_takes_its_place_in_the_queue_by_its_role(role, priority, limit):
    used = Mock(return_value=nullcontext())
    context = SimpleNamespace(home=JournalHome(Path('/nonexistent-journal-home') / '.journal'), hook_database=SimpleNamespace(used=used), hook_limit_seconds=1, agent_hook_limit_seconds=45,
                              listener_thread=SimpleNamespace(wake=Mock()))
    endpoint = HookEndpoint(Mock(), context)
    endpoint.routed_answer = Mock(side_effect=OldHookRunnerError.detected())
    endpoint.answer({"event": "pre_tool_use", "role": role, "session": "s-1"}, "claude", {})
    used.assert_called_once_with(priority, limit, "s-1", ANY)
