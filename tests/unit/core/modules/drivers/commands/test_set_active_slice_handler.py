from types import SimpleNamespace

import pytest

from engine.errors.refusal import Refusal
from core.modules.drivers.commands.set_active_slice.set_active_slice import SetActiveSlice
from core.modules.drivers.commands.set_active_slice.set_active_slice_handler import SetActiveSliceHandler


def switched(is_main: bool) -> tuple[str, ...]:
    written: list[object] = []
    settings = SimpleNamespace(texts=lambda key: [])
    store = SimpleNamespace(write=lambda key, value, environment_id, context: written.append(value))
    agents = SimpleNamespace(find=lambda agent_id: SimpleNamespace(is_main=is_main))
    context = SimpleNamespace(actor=SimpleNamespace(id=4, is_agent=lambda: True), environment_id=1)
    return SetActiveSliceHandler(settings, store, agents).handle(SetActiveSlice("safety", True), context)


def test_the_main_agent_switches_a_ready_part_and_a_helper_is_refused():
    assert switched(True) == ("safety",)
    with pytest.raises(Refusal, match="only a person or the main agent"):
        switched(False)
