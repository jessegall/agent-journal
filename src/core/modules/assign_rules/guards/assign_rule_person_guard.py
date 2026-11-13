from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.event.changed import Changed
from engine.guard.guard import Guard
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition

PERSON_WRITES_RULES = "only a person writes rules"


class AssignRulePersonGuard(Guard[Changed[AssignRule] | Changed[AssignRuleCondition]]):
    """Only a person writes assign rules and their conditions: a rule decides who does what work, so an agent that
    wrote one could take work or push it away. Agents may read and try rules."""

    name = "assign-rules.person-writes"
    is_safety = True

    def check(self, event: Changed[AssignRule] | Changed[AssignRuleCondition], context: Context) -> None:
        if context.actor.type is not ActorType.USER:
            raise Refusal(PERSON_WRITES_RULES, "a person changes rules in the agent settings")
