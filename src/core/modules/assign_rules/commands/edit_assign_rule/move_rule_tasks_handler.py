from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from core.modules.assign_rules.commands.edit_assign_rule.move_rule_tasks import MoveRuleTasks
from core.modules.assign_rules.guards.assign_rule_person_guard import AssignRulePersonGuard
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList
from core.modules.assign_rules.support.rule_tasks.rule_tasks import RuleTasks
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.assign_rules.support.targets.rule_targets import RuleTargets


class MoveRuleTasksHandler(Handler[MoveRuleTasks, RuleTaskList]):
    """After a person changes a rule's target, the open tasks the rule gave that nobody started or holds are
    listed and, once confirmed, moved to the new target; a task given by hand never moves."""

    command = MoveRuleTasks

    def __init__(self, rows: EventRows, rule_tasks: RuleTasks, rules: AssignRules, targets: RuleTargets, revision: RuleRevision) -> None:
        self.rows, self.rule_tasks, self.rules, self.targets, self.revision = rows, rule_tasks, rules, targets, revision

    def handle(self, command: MoveRuleTasks, context: Context) -> RuleTaskList:
        AssignRulePersonGuard.require_person(context)
        self.revision.check(command.revision)
        rule = self.rows.required(AssignRule, command.rule_id)
        usable = self.targets.usable(rule, DecisionBatch())
        if usable.actor_id is None:
            raise Refusal(f"rule {rule.id} can give no task now: {usable.reason}", "edit the rule's target first")
        listed = self.rule_tasks.moved(rule, usable.actor_id)
        if command.is_confirmed:
            for rule_task in listed:
                self.rules.move(rule_task.task, rule, usable.actor_id, context)
        return RuleTaskList(rule.id, listed, command.is_confirmed)
