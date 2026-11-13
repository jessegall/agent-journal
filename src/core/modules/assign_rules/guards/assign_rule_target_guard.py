from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.event.updated import Updated
from engine.guard.guard import Guard
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget


class AssignRuleTargetGuard(Guard[Created[AssignRule] | Updated[AssignRule]]):
    """Checks that a rule names what its target needs: one agent, or the program and model of a kind of worker."""

    name = "assign-rules.target"
    is_safety = True

    def check(self, event: Created[AssignRule] | Updated[AssignRule], context: Context) -> None:
        rule = event.row
        if rule.target is RuleTarget.AGENT and rule.agent_id is None:
            raise Refusal("a rule for one agent names the agent", "add --agent <number>")
        if rule.target is RuleTarget.MODEL and not (rule.program and rule.program_model):
            raise Refusal("a rule for a kind of worker names its program and model", "add --program <program> --model <model>")
