import pytest

from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from server.hook.hook_sender import HookSender
from server.enums.queue_priority import QueuePriority


@pytest.mark.parametrize("role", ["main", "worker", "helper", ""])
def test_raw_and_prepared_hooks_have_the_same_queue_owner_and_requirements(role):
    prepared = HookSender.parsed({"role": role, "session": "session-42", "event": "pre_tool_use"}, 3.5, 45)
    raw = HookSender.parsed({"role": role, "session_id": "session-42", "hook_event_name": "PreToolUse"}, 3.5, 45)
    assert prepared.owner == raw.owner == "session-42"
    assert prepared.priority == raw.priority
    assert prepared.limit_seconds == raw.limit_seconds
    assert prepared.needs_check == raw.needs_check == HookEvent.requires_check(role)
    assert prepared.priority is (QueuePriority.AGENT_HOOK if role in ("worker", "helper") else QueuePriority.MAIN_AGENT_HOOK)
    assert prepared.limit_seconds == (45 if role in ("worker", "helper") else 3.5)


@pytest.mark.parametrize("event,raw_name", [(HookEventName.STOP, "Stop"), (HookEventName.POST_TOOL_USE, "PostToolUse")])
def test_every_hook_of_a_worker_requires_a_check(event, raw_name):
    prepared = HookSender.parsed({"role": "worker", "session": "s-1", "event": event})
    raw = HookSender.parsed({"role": "worker", "session_id": "s-1", "hook_event_name": raw_name})
    assert prepared.needs_check
    assert raw.needs_check
    assert prepared.is_stop == raw.is_stop == (event is HookEventName.STOP)
