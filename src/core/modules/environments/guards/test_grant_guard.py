from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.environments.models.environment import Environment

PERSONS = (ActorType.USER, ActorType.CORE)


class TestGrantGuard(Guard[Changed[Environment]]):
    """Only a person, in the viewer or at the terminal, marks an environment as a test one or grants an agent
    the right to work in it, and only a test environment takes a grant; an agent's change of either becomes
    a card for the person."""

    name = "environments.test-grant-by-person"
    is_safety = True

    def check(self, event: Changed[Environment], context: Context) -> None:
        environment, old = event.row, event.old_row
        if environment.test_agent_id is not None and not environment.test:
            raise Refusal(f"environment {environment.name} is not a test environment, so it takes no grant", "mark it as a test environment first")
        changed = old is None or (old.test, old.test_agent_id) != (environment.test, environment.test_agent_id)
        if not changed or (environment.test, environment.test_agent_id) == (False, None) or context.actor.type in PERSONS:
            return
        raise UserApprovalRefusal(f"Let agent {environment.test_agent_id} work in test environment {environment.name}?" if environment.test_agent_id else f"Mark {environment.name} as a test environment?")
