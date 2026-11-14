from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assign_rules.commands.make_assign_rule.make_assign_rule import MakeAssignRule
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_limits import RuleLimits


class MakeAssignRuleHandler(Handler[MakeAssignRule, AssignRule]):
    """Adds a rule after the environment's last rule, within the limits of rules and conditions; the places of
    the rules have no gaps, so the new place follows the count."""

    command = MakeAssignRule

    def __init__(self, queries: Queries, repository: Repository, conditions: RuleConditions, revision: RuleRevision) -> None:
        self.queries, self.repository, self.conditions, self.revision = queries, repository, conditions, revision

    def handle(self, command: MakeAssignRule, context: Context) -> AssignRule:
        self.revision.check(command.revision)
        if context.environment_id is None:
            raise Refusal("a rule belongs to an environment", "add --environment <name>")
        RuleLimits.check_condition_count(len(command.conditions))
        rule_count = self.queries.query(AssignRule).count()
        RuleLimits.check_rule_count(rule_count)
        rule = self.repository.save(AssignRule(creator_id=context.actor.id, position=rule_count + 1,
                                               target=command.target, target_agent_id=command.target_agent_id, program=command.program, program_model=command.program_model, queue_limit=command.queue_limit), context)
        self.conditions.save(rule, command.conditions, context)
        return rule
