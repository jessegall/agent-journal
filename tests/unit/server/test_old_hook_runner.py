from contextlib import nullcontext
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

from core.base.driver.old_hook_runner_error import OldHookRunnerError
from server.endpoints.hook_endpoint import HookEndpoint


@pytest.mark.parametrize("event,refused", [("stop", True), ("pre_tool_use", False)])
def test_an_old_hook_runner_gets_an_immediate_unchecked_answer(event, refused):
    context = SimpleNamespace(hook_database=SimpleNamespace(used=lambda limit: nullcontext()), hook_limit_seconds=1,
                              listener_thread=SimpleNamespace(wake=Mock()))
    endpoint = HookEndpoint(Mock(), context)
    endpoint.routed_answer = Mock(side_effect=OldHookRunnerError.detected())
    reply = endpoint.answer({"event": event}, "claude", {})
    assert bool(reply.refusal) is refused
    assert reply.hook_call_id is None
    assert "update the hook runner" in (reply.refusal if refused else reply.lines[0])
