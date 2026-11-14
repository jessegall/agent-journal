from engine.enums.hook_answer import HookAnswer
from engine.enums.hook_event_name import HookEventName
from engine.module.driver_entries import DRIVERS_MODULE
from engine.row.metadata import Metadata
from core.modules.drivers.models.hook_call import HookCall


def stop_call(**drivers_part) -> HookCall:
    return HookCall(session_agent_id=1, environment_id=1, creator_id=1, hook=HookEventName.STOP, firing="f", answer=HookAnswer.ALLOWED,
                    metadata=Metadata({DRIVERS_MODULE: drivers_part}))


def test_a_stop_recorded_as_a_continuation_reads_as_one():
    assert stop_call(stop_continuation=True).is_stop_continuation


def test_a_stop_recorded_before_the_flag_or_without_it_is_no_continuation():
    assert not stop_call().is_stop_continuation
    assert not stop_call(stop_continuation=False).is_stop_continuation
