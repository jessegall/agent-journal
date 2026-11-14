import pytest

from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from server.hook.hook_sender import HookSender
from server.hook.hook_sender import AGENT_HOOK_PRIORITY, MAIN_AGENT_HOOK_PRIORITY


# the server answers main for a session it has no agent row for, so its first hook passes
@pytest.mark.parametrize("role,priority,limit_seconds", [("main", MAIN_AGENT_HOOK_PRIORITY, 3.5), ("worker", AGENT_HOOK_PRIORITY, 45),
                                                          ("helper", AGENT_HOOK_PRIORITY, 45)])
def test_raw_and_prepared_hooks_have_the_same_queue_owner_and_requirements(role, priority, limit_seconds):
    prepared = HookSender.parsed({"session": "session-42", "event": "pre_tool_use"}, 3.5, 45, role_of=lambda session: role)
    raw = HookSender.parsed({"session_id": "session-42", "hook_event_name": "PreToolUse"}, 3.5, 45, role_of=lambda session: role)
    assert prepared.owner == raw.owner == "session-42"
    assert prepared.priority == raw.priority
    assert prepared.limit_seconds == raw.limit_seconds
    assert prepared.needs_check == raw.needs_check == HookEvent.is_checked_role(role)
    assert prepared.priority is priority
    assert prepared.limit_seconds == limit_seconds


@pytest.mark.parametrize("event,raw_name", [(HookEventName.STOP, "Stop"), (HookEventName.POST_TOOL_USE, "PostToolUse")])
def test_every_hook_of_a_worker_requires_a_check(event, raw_name):
    prepared = HookSender.parsed({"session": "s-1", "event": event}, role_of=lambda session: "worker")
    raw = HookSender.parsed({"session_id": "s-1", "hook_event_name": raw_name}, role_of=lambda session: "worker")
    assert prepared.needs_check
    assert raw.needs_check
    assert prepared.is_stop == raw.is_stop == (event is HookEventName.STOP)


def test_a_body_saying_main_does_not_make_a_worker_main():
    sender = HookSender.parsed({"role": "main", "session": "s-1", "event": "pre_tool_use"}, role_of=lambda session: "worker")
    assert sender.role == "worker"
