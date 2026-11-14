from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.assign_rules.commands.judge_task.judge_task import JudgeTask
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.targets.decision_batch import DecisionBatch
from core.modules.tasks.models.task import Task


class JudgeTaskHandler(Handler[JudgeTask, None]):
    """Records the rules' decision about a task of an environment with a rule turned on; an environment with none
    records nothing, so a task there carries no decision."""

    command = JudgeTask

    def __init__(self, queries: Queries, rules: AssignRules) -> None:
        self.queries, self.rules = queries, rules

    def handle(self, command: JudgeTask, context: Context) -> None:
        if self.rules.has_enabled_rules():
            self.rules.decide(self.queries.query(Task).find(command.task_id), DecisionBatch(), context)
