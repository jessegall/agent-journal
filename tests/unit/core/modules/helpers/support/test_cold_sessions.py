from types import SimpleNamespace

import pytest

from engine.enums.occupant import Occupant
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT, COLD_SESSION_MINUTES, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS

AGENT = SimpleNamespace(id=7, program="claude", session="s-1", environment_id=1, role="worker", profile="journal-worker")
LIMIT_TOKENS = 400000


class RecordingBus:
    def __init__(self) -> None:
        self.reasons: list[EndReason] = []

    def run(self, command, actor, environment_id):
        self.reasons.append(command.reason)
        return SimpleNamespace(id=command.row_id, session="s-2")


def cold_sessions(silent: bool, percent: int, tokens: int = 0, minutes: int = 55) -> tuple[ColdSessions, RecordingBus]:
    numbers = {COLD_SESSION_MINUTES: minutes, COLD_SESSION_CONTEXT_PERCENT: 20, CONTEXT_LIMIT_TOKENS: LIMIT_TOKENS}
    settings = SimpleNamespace(number=lambda name: numbers[name], flag=lambda name: name == CONTEXT_LIMIT_ENABLED)
    activity = SimpleNamespace(is_inactive=lambda timestamp, seconds: silent)
    bus = RecordingBus()
    sessions = ColdSessions(None, SimpleNamespace(timestamp=lambda: None), SimpleNamespace(context_tokens=lambda program, home, session: tokens), None, settings, bus,
                            SimpleNamespace(percent_of=lambda agent: percent, cap=lambda role, profile: LIMIT_TOKENS), SimpleNamespace(required=lambda model, row_id: activity),
                            SimpleNamespace(unstarted=lambda agent: False), SimpleNamespace(exists=lambda agent: True))
    return sessions, bus


def test_a_cold_session_with_a_large_context_is_replaced_because_its_cache_passed():
    sessions, bus = cold_sessions(silent=True, percent=20)
    assert sessions.replaced(AGENT, Occupant.COLD_ROTATION).session == "s-2" and bus.reasons == [EndReason.CACHE_PASSED]


def test_a_cold_session_with_a_small_context_is_kept():
    sessions, bus = cold_sessions(silent=True, percent=19)
    assert sessions.replaced(AGENT, Occupant.COLD_ROTATION) is AGENT and bus.reasons == []


def test_an_occupant_that_continues_keeps_a_cold_session_with_a_large_context():
    sessions, bus = cold_sessions(silent=True, percent=100)
    assert sessions.replaced(AGENT, Occupant.CONTINUE) is AGENT and bus.reasons == []


@pytest.mark.parametrize("occupant", list(Occupant))
def test_a_session_past_the_context_limit_is_replaced_for_every_occupant(occupant):
    sessions, bus = cold_sessions(silent=False, percent=10, tokens=LIMIT_TOKENS)
    assert sessions.replaced(AGENT, occupant.continuation).session == "s-2" and bus.reasons == [EndReason.CONTEXT_LIMIT]


def test_cold_minutes_at_zero_never_make_a_session_cold():
    sessions, bus = cold_sessions(silent=True, percent=100, minutes=0)
    assert not sessions.is_cold(AGENT) and sessions.replaced(AGENT, Occupant.COLD_ROTATION) is AGENT
