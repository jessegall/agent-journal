from datetime import datetime, timezone

from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event import HookEvent
from core.base.driver.open_row import OpenRow
from core.base.timestamp import Timestamp

TIMESTAMP = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
EVENT = HookEvent(1, "claude", "stop", "s1", "f1", 1, "agent", "main", "", None, None, {})


def test_a_hook_names_its_event_and_the_layer_it_is_asked_for():
    hook = AgentHook(EVENT, 3, 1, "main", "coding.builder", TIMESTAMP, OpenRow("wait", 7, TIMESTAMP))
    assert (hook.hook_name, hook.layer_ref) == ("stop", "wait:7")


def test_a_hook_asked_for_the_driver_has_no_layer():
    assert AgentHook(EVENT, 3, 1, "main", "coding.builder", TIMESTAMP).layer_ref == ""
