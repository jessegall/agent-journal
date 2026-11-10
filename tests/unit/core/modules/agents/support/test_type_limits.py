from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.agents.support.type_limits import TypeLimits

ENDED_AT = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)


def kept_agent(number: int, role: str, ended_at: datetime | None) -> SimpleNamespace:
    return SimpleNamespace(number=number, role=role, ended_at=ended_at)


def test_at_the_kept_limit_the_idle_agent_with_the_lowest_number_is_named_and_the_person_retires():
    agents = [kept_agent(7, "worker", ENDED_AT), kept_agent(3, "worker", None), kept_agent(4, "worker", ENDED_AT)]
    assert TypeLimits.kept_limit_suggestion(agents) == "send the job to idle worker 4, or ask the person to retire one"


def test_a_helper_is_named_as_a_helper():
    assert TypeLimits.kept_limit_suggestion([kept_agent(5, "helper", ENDED_AT)]) == "send the job to idle helper 5, or ask the person to retire one"


def test_at_the_kept_limit_with_every_agent_running_only_the_person_is_named():
    assert TypeLimits.kept_limit_suggestion([kept_agent(3, "worker", None), kept_agent(4, "worker", None)]) == "ask the person to retire one"
