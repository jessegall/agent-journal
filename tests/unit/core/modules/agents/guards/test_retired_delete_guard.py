from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from core.modules.agents.guards.retired_delete_guard import RetiredDeleteGuard
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal

RETIRED_AT = datetime(2026, 11, 2, 9, 0, tzinfo=timezone.utc)
PERSON = Actor(3, ActorType.USER)
MAIN_AGENT = Actor(5, ActorType.AGENT)


def deleted(retired_at: datetime | None) -> SimpleNamespace:
    return SimpleNamespace(row=SimpleNamespace(role="helper", number=4, retired_at=retired_at))


@pytest.mark.parametrize("actor", [PERSON, MAIN_AGENT, Actor.core()], ids=["a person", "an agent", "the journal"])
def test_the_delete_of_a_retired_agent_is_refused_for_everyone(actor):
    with pytest.raises(Refusal, match="helper 4 is retired, and its record stays"):
        RetiredDeleteGuard().check(deleted(RETIRED_AT), SimpleNamespace(actor=actor))


@pytest.mark.parametrize("actor", [PERSON, MAIN_AGENT], ids=["a person", "an agent"])
def test_the_delete_of_an_agent_that_is_not_retired_is_refused_naming_the_retirement(actor):
    with pytest.raises(Refusal) as refused:
        RetiredDeleteGuard().check(deleted(None), SimpleNamespace(actor=actor))
    assert "helper 4 is not deleted: its record stays" in str(refused.value)
    assert "journal agent retire 4" in refused.value.suggestion


def test_the_journal_itself_removes_the_row_of_an_agent_that_is_not_retired():
    RetiredDeleteGuard().check(deleted(None), SimpleNamespace(actor=Actor.core()))
