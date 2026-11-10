from core.base.driver.hook_event_name import HookEventName
from core.base.driver.lockdown import Lockdown
from core.base.driver.program_lockdown import ProgramLockdown
from engine.time.timestamp import Timestamp

ACTIVE = Lockdown(Timestamp.parsed("2026-11-10T14:00:00+00:00"), "[journal] stopped", "Claude is at your usage limit until 14:00", "wait until it ends")


def test_a_start_refusal_names_the_agent_type_the_reason_and_the_suggestion():
    refusal = ACTIVE.start_refusal("worker")
    assert refusal.reason == "no program can take this worker: Claude is at your usage limit until 14:00"
    assert refusal.suggestion == "wait until it ends"


def test_an_active_lockdown_stops_every_hook_but_the_session_end_and_the_default_port_never_locks():
    assert ACTIVE.stops(HookEventName.PRE_TOOL_USE) and not ACTIVE.stops(HookEventName.SESSION_END)
    assert not ProgramLockdown().lockdown("claude").is_active
