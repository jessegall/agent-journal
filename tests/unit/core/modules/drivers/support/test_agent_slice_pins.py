from types import SimpleNamespace

from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.agent_slices import AgentSlices

ACTIVE = frozenset({"safety", "lines"})


def pinned(pins: tuple[str, ...], event: HookEventName) -> frozenset[str]:
    return AgentSlices.pinned(SimpleNamespace(pinned_slices=pins), SimpleNamespace(event=event), ACTIVE)


def test_an_agent_pinned_to_none_takes_the_active_slices_at_its_next_hook_and_a_pinned_one_keeps_its_pins():
    assert pinned((), HookEventName.PRE_TOOL_USE) == ACTIVE
    assert pinned(("safety",), HookEventName.PRE_TOOL_USE) == frozenset({"safety"})
    assert pinned(("safety",), HookEventName.SESSION_START) == ACTIVE
