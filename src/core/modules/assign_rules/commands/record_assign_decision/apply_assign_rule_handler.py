from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from core.modules.assign_rules.commands.record_assign_decision.apply_assign_rule import ApplyAssignRule
from core.modules.assign_rules.guards.assign_rule_person_guard import AssignRulePersonGuard
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList
from core.modules.assign_rules.support.rule_tasks.rule_tasks import RuleTasks
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch


class ApplyAssignRuleHandler(Handler[ApplyAssignRule, RuleTaskList]):
    """A person applies a rule to the tasks already waiting: the free tasks it would give are listed, and once
    confirmed each is judged the way a new task is, so the rules before it still come first."""

    command = ApplyAssignRule

    def __init__(self, rows: EventRows, rule_tasks: RuleTasks, rules: AssignRules, revision: RuleRevision) -> None:
        self.rows, self.rule_tasks, self.rules, self.revision = rows, rule_tasks, rules, revision

    def handle(self, command: ApplyAssignRule, context: Context) -> RuleTaskList:
        AssignRulePersonGuard.require_person(context)
        self.revision.check(command.revision)
        listed = self.rule_tasks.applied(self.rows.required(AssignRule, command.rule_id))
        if command.is_confirmed:
            batch = DecisionBatch()
            for rule_task in listed:
                self.rules.decide(rule_task.task, batch, context)
        return RuleTaskList(command.rule_id, listed, command.is_confirmed)
