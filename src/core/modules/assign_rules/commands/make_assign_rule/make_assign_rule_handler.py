from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assign_rules.commands.make_assign_rule.make_assign_rule import MakeAssignRule
from core.modules.assign_rules.models.assign_rule import ENVIRONMENT_COLUMN, AssignRule
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_limits import RuleLimits
from core.modules.plans.support.positions import Positions


class MakeAssignRuleHandler(Handler[MakeAssignRule, AssignRule]):
    """Adds a rule after the environment's last rule, within the limits of rules and conditions."""

    command = MakeAssignRule

    def __init__(self, queries: Queries, repository: Repository, positions: Positions, conditions: RuleConditions) -> None:
        self.queries, self.repository, self.positions, self.conditions = queries, repository, positions, conditions

    def handle(self, command: MakeAssignRule, context: Context) -> AssignRule:
        if context.environment_id is None:
            raise Refusal("a rule belongs to an environment", "add --environment <name>")
        RuleLimits.check_condition_count(len(command.conditions))
        RuleLimits.check_rule_count(self.queries.query(AssignRule).filter(environment_id=context.environment_id).count())
        rule = self.repository.save(AssignRule(creator_id=context.actor.id, position=self.positions.next_position(AssignRule, ENVIRONMENT_COLUMN, context.environment_id),
                                               target=command.target, agent_id=command.agent_id, program=command.program, program_model=command.program_model), context)
        self.conditions.save(rule, command.conditions, context)
        return rule
