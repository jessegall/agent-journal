from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.event.created import Created
from engine.event.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule


class RuleApprovalGuard(Guard[Changed[ProjectRule]]):
    """An agent can propose a rule but cannot decide its approval or change an active rule."""

    name = "project-rules.approval"
    is_safety = True

    def check(self, event: Changed[ProjectRule], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT or isinstance(event, Created):
            return
        previous = event.row if event.old_row is None else event.old_row
        if isinstance(event, Moved) and previous.state is RuleState.PROPOSED:
            raise Refusal("a person was asked to decide this rule in the dock")
        if event.row.state is RuleState.ACTIVE or previous.state is RuleState.ACTIVE:
            raise UserApprovalRefusal(f"Change this project rule?\n{event.row.text}", command=context.command)
