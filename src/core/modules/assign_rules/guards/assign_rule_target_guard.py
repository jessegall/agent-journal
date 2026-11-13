from engine.command.context import Context
from engine.enums.helper_role import HelperRole
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.event.updated import Updated
from engine.guard.guard import Guard
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget


class AssignRuleTargetGuard(Guard[Created[AssignRule] | Updated[AssignRule]]):
    """Checks that a rule names what its target needs, one agent or the program and model of a kind of worker, and
    that the agent named works in the rule's environment and is no helper."""

    name = "assign-rules.target"
    is_safety = True

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Created[AssignRule] | Updated[AssignRule], context: Context) -> None:
        rule = event.row
        if rule.queue_limit < 0:
            raise Refusal(f"a queue limit counts open tasks, so it cannot be {rule.queue_limit}", "give 0 for no limit")
        if rule.target is RuleTarget.MODEL and not (rule.program and rule.program_model):
            raise Refusal("a rule for a kind of worker names its program and model", "add --program <program> --model <model>")
        if rule.target is not RuleTarget.AGENT:
            return
        if rule.agent_id is None:
            raise Refusal("a rule for one agent names the agent", "add --agent <number>")
        agent = self.rows.find(Agent, rule.agent_id)
        if agent is None or agent.environment_id != rule.environment_id:
            raise Refusal(f"agent {rule.agent_id} works in another environment", "give the rule to an agent of the rule's own environment")
        if agent.role in tuple(HelperRole):
            raise Refusal("helpers take no task", "give the rule to the main agent or a worker")
