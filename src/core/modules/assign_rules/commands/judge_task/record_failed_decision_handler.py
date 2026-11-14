from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.assign_rules.commands.judge_task.record_failed_decision import RecordFailedDecision
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.tasks.models.task import Task


class RecordFailedDecisionHandler(Handler[RecordFailedDecision, None]):
    """Records a FAILED decision about a task whose judging failed; the task itself is left as it is."""

    command = RecordFailedDecision

    def __init__(self, queries: Queries, rules: AssignRules) -> None:
        self.queries, self.rules = queries, rules

    def handle(self, command: RecordFailedDecision, context: Context) -> None:
        self.rules.record_failure(self.queries.query(Task).find(command.task_id), command.reason, context)
