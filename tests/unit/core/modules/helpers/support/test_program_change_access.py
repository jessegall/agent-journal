from types import SimpleNamespace

import pytest

from core.modules.helpers.support.program_change_access import ProgramChangeAccess
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal

MAIN_AGENT = SimpleNamespace(id=1, role="main", is_main=True)
HELPER = SimpleNamespace(id=7, role="helper", is_main=False)
WORKER = SimpleNamespace(id=8, role="worker", is_main=False)
AGENTS = {agent.id: agent for agent in (MAIN_AGENT, HELPER, WORKER)}
ACCESS = ProgramChangeAccess(SimpleNamespace(required=lambda model, row_id: AGENTS[row_id]))


def agent_actor(agent: SimpleNamespace) -> Actor:
    return Actor(agent.id, ActorType.AGENT)


@pytest.mark.parametrize("agent", [HELPER, WORKER, MAIN_AGENT], ids=["a helper", "a worker", "the main agent"])
def test_a_person_changes_the_driver_of_any_agent(agent):
    ACCESS.check_driver_change(Actor(3, ActorType.USER), agent)


@pytest.mark.parametrize("agent", [HELPER, WORKER], ids=["its helper", "its worker"])
def test_the_main_agent_changes_the_driver_of_a_helper_and_of_a_worker(agent):
    ACCESS.check_driver_change(agent_actor(MAIN_AGENT), agent)


@pytest.mark.parametrize("caller, agent", [(HELPER, WORKER), (WORKER, HELPER), (HELPER, MAIN_AGENT)], ids=["a helper on a worker", "a worker on a helper", "a helper on the main agent"])
def test_a_helper_or_a_worker_changes_nobodys_driver(caller, agent):
    with pytest.raises(Refusal, match="only a person or the main agent changes a driver"):
        ACCESS.check_driver_change(agent_actor(caller), agent)


@pytest.mark.parametrize("agent", [MAIN_AGENT, HELPER, WORKER], ids=["the main agent", "a helper", "a worker"])
def test_no_agent_changes_its_own_driver(agent):
    with pytest.raises(Refusal, match="an agent does not change its own driver"):
        ACCESS.check_driver_change(agent_actor(agent), agent)
