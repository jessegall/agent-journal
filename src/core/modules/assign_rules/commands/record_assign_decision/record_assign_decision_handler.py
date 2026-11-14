from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision import RecordAssignDecision
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.tasks.models.task import Task


class RecordAssignDecisionHandler(Handler[RecordAssignDecision, tuple[AssignDecision, ...]]):
    """Records the assign rules' decision about each task, in the order given, as one batch: a task given to
    an agent counts for the tasks after it."""

    command = RecordAssignDecision

    def __init__(self, queries: Queries, rules: AssignRules) -> None:
        self.queries, self.rules = queries, rules

    def handle(self, command: RecordAssignDecision, context: Context) -> tuple[AssignDecision, ...]:
        tasks = {task.id: task for task in self.queries.query(Task).find_many(command.task_ids)}
        return tuple(self.rules.decide_many([tasks[task_id] for task_id in command.task_ids], DecisionBatch(), context))
