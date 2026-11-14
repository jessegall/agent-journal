from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.assign_rules.commands.delete_assign_rule.return_rule_tasks import ReturnRuleTasks
from core.modules.assign_rules.guards.assign_rule_person_guard import AssignRulePersonGuard
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList
from core.modules.assign_rules.support.rule_tasks.rule_tasks import RuleTasks
from core.modules.assignments.support.assignments import Assignments


class ReturnRuleTasksHandler(Handler[ReturnRuleTasks, RuleTaskList]):
    """Gives back the tasks a rule gave that nobody started or holds, each unassigned on its own, so they are free
    again; the rule may be deleted already. A rule gives a task once, so it does not take them again."""

    command = ReturnRuleTasks

    def __init__(self, rule_tasks: RuleTasks, assignments: Assignments, revision: RuleRevision) -> None:
        self.rule_tasks, self.assignments, self.revision = rule_tasks, assignments, revision

    def handle(self, command: ReturnRuleTasks, context: Context) -> RuleTaskList:
        AssignRulePersonGuard.require_person(context)
        self.revision.check(command.revision)
        listed = self.rule_tasks.returned(command.rule_id)
        if command.is_confirmed:
            for rule_task in listed:
                self.assignments.unassign(rule_task.task, context)
        return RuleTaskList(command.rule_id, listed, command.is_confirmed)
