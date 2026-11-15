from types import SimpleNamespace

from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.listeners.wake_acknowledgement_listener import WakeAcknowledgementListener


def test_a_tick_the_server_records_acknowledges_no_wake():
    asked: list[object] = []
    queries = SimpleNamespace(query=lambda model: asked.append(model))
    listener = WakeAcknowledgementListener(queries, SimpleNamespace())
    listener.handle(SimpleNamespace(row=SimpleNamespace(hook=HookEventName.TICK, session_agent_id=4), old_row=None), SimpleNamespace())
    assert asked == []
