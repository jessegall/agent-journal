from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision import RecordAssignDecision
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.tasks.models.task import Task


class RecordAssignDecisionHandler(Handler[RecordAssignDecision, AssignDecision]):
    """Records the assign rules' decision about one task."""

    command = RecordAssignDecision

    def __init__(self, queries: Queries, rules: AssignRules) -> None:
        self.queries, self.rules = queries, rules

    def handle(self, command: RecordAssignDecision, context: Context) -> AssignDecision:
        return self.rules.decide(self.queries.query(Task).find(command.task_id), context)
