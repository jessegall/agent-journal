from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.agents.commands.retire_agent.retire_agent_handler import RetireAgentHandler
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.command.errors.user_approval_refusal import UserApprovalRefusal

ENDED_AT = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)
RETIRED_AT = datetime(2026, 11, 2, 9, 0, tzinfo=timezone.utc)
MAIN_AGENT_ID, HELPER_ID, PERSON_ID = 1, 7, 3
REASON = "Its reading is done"


class StoredAgent(SimpleNamespace):
    """An agent row as the handler reads it, which answers a retirement with a changed copy of itself."""

    @property
    def is_main(self) -> bool:
        return self.role == "main"

    def retired(self, timestamp, reason, actor_id) -> "StoredAgent":
        return StoredAgent(**{**vars(self), "retired_at": timestamp, "retirement_reason": reason, "retiring_actor_id": actor_id})


class StoredAgents:
    def __init__(self, *agents: StoredAgent) -> None:
        self.agents = {agent.id: agent for agent in agents}
        self.saved: list[StoredAgent] = []

    def query(self, model) -> "StoredAgents":
        return self

    def find(self, row_id: int) -> StoredAgent:
        return self.agents[row_id]

    def save(self, agent: StoredAgent, context) -> StoredAgent:
        self.saved.append(agent)
        self.agents[agent.id] = agent
        return agent


def stored_agent(**changes) -> StoredAgent:
    fields = {"id": HELPER_ID, "number": 4, "role": "helper", "parent_id": MAIN_AGENT_ID, "environment_id": 1, "ended_at": ENDED_AT, "retired_at": None, "given_name": "", "profile": "journal-researcher"}
    return StoredAgent(**{**fields, **changes})


def handler(*agents: StoredAgent) -> tuple[RetireAgentHandler, StoredAgents]:
    main_agent = stored_agent(id=MAIN_AGENT_ID, number=1, role="main", parent_id=None, ended_at=None)
    stored = StoredAgents(main_agent, *agents)
    return RetireAgentHandler(stored, stored, SimpleNamespace(helper_types=()), SimpleNamespace()), stored


def test_the_main_agent_retires_an_ended_agent_at_once_without_asking_a_person():
    retiring, stored = handler(stored_agent())
    command = RetireAgent(HELPER_ID, REASON)
    retiring.prepare(command, Actor(MAIN_AGENT_ID, ActorType.AGENT))
    retired = retiring.handle(command, SimpleNamespace(timestamp=RETIRED_AT, actor=Actor(MAIN_AGENT_ID, ActorType.AGENT)))
    assert (retired.retired_at, retired.retiring_actor_id) == (RETIRED_AT, MAIN_AGENT_ID)


def test_an_agent_that_is_not_the_main_agent_is_refused_a_retirement():
    retiring, stored = handler(stored_agent(), stored_agent(id=9, number=5))
    with pytest.raises(Refusal, match="only a user or the main agent retires helper 4"):
        retiring.prepare(RetireAgent(HELPER_ID, REASON), Actor(9, ActorType.AGENT))
    assert stored.saved == []


def test_a_person_retires_an_ended_agent_directly_and_its_record_stays():
    retiring, stored = handler(stored_agent())
    command = RetireAgent(HELPER_ID, REASON)
    person = Actor(PERSON_ID, ActorType.USER)
    retiring.prepare(command, person)
    retired = retiring.handle(command, SimpleNamespace(timestamp=RETIRED_AT, actor=person))
    assert (retired.retired_at, retired.retirement_reason, retired.retiring_actor_id) == (RETIRED_AT, REASON, PERSON_ID)
    assert (stored.find(HELPER_ID).id, stored.find(HELPER_ID).number) == (HELPER_ID, 4)


@pytest.mark.parametrize("changes, refusal_text", [({"ended_at": None}, "is still running"), ({"role": "main"}, "a main agent is not retired"), ({"retired_at": RETIRED_AT}, "is retired already")],
                         ids=["running", "a main agent", "retired"])
@pytest.mark.parametrize("actor_type", [ActorType.USER, ActorType.AGENT])
def test_an_agent_that_cannot_be_retired_is_refused_and_no_person_is_asked(changes, refusal_text, actor_type):
    retiring, stored = handler(stored_agent(**changes))
    with pytest.raises(Refusal) as refused:
        retiring.prepare(RetireAgent(HELPER_ID, REASON), Actor(MAIN_AGENT_ID if actor_type is ActorType.AGENT else PERSON_ID, actor_type))
    assert not isinstance(refused.value, UserApprovalRefusal)
    assert refusal_text in str(refused.value)
    assert stored.saved == []
