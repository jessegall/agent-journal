from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.environments.models.environment import Environment
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.agents.models.agent import Agent
from engine.query.queries import Queries

PERSONS = (ActorType.USER, ActorType.CORE)


class TestGrantGuard(Guard[Changed[Environment]]):
    """Only a person, in the viewer or at the terminal, marks an environment as a test one or grants an agent
    the right to work in it, and only a test environment takes a grant; an agent's change of either becomes
    a card for the person."""

    name = "environments.test-grant-by-person"
    is_safety = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[Environment], context: Context) -> None:
        environment, old = event.row, event.old_row
        if environment.test_agent_id is not None and not environment.test:
            raise Refusal(f"environment {environment.name} is not a test environment, so it takes no grant", "mark it as a test environment first")
        changed = old is None or (old.test, old.test_agent_id) != (environment.test, environment.test_agent_id)
        if not changed or (environment.test, environment.test_agent_id) == (False, None) or context.actor.type in PERSONS:
            return
        if environment.test_agent_id is None:
            raise UserApprovalRefusal(f"Mark {environment.name} as a test environment?")
        raise UserApprovalRefusal(f"Let {AgentLabel.from_agent(self.queries.query(Agent).find(environment.test_agent_id)).text} work in test environment {environment.name}?")
