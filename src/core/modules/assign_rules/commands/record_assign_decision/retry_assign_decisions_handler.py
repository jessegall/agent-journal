from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.less import Less
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.assign_rules.commands.record_assign_decision.record_assign_decision import RecordAssignDecision
from core.modules.assign_rules.commands.record_assign_decision.retry_assign_decisions import RetryAssignDecisions
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.queries.assign_decision_query import AssignDecisionQuery
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

RULES_REASON = "the environments with a rule turned on are rule_reasons from their rules"
UNDECIDED_WAIT = timedelta(minutes=1)
MOST_RETRIED_TASKS = 100


class RetryAssignDecisionsHandler(Handler[RetryAssignDecisions, int]):
    """Finds the tasks to judge again, a bounded number, and judges each environment's tasks as one batch in
    that environment: a task a rule was skipped for, and a free task made after the environment's first rule
    that a stop left with no decision for a minute."""

    command = RetryAssignDecisions

    def __init__(self, queries: Queries, decisions: AssignDecisionQuery, tasks: TaskQuery, clock: Clock, bus: Bus) -> None:
        self.queries, self.decisions, self.tasks, self.clock, self.bus = queries, decisions, tasks, clock, bus

    def handle(self, command: RetryAssignDecisions, context: Context) -> int:
        first_rules = self.first_rule_times()
        if not first_rules:
            return 0
        retry_ids = self.decisions.retried_task_ids(MOST_RETRIED_TASKS)
        tasks = [*self.queries.query(Task).find_many(retry_ids), *self.undecided_tasks(min(first_rules.values()))]
        environment_tasks: dict[int, list[int]] = {}
        for task in tasks:
            if task.environment_id in first_rules and task.creation_timestamp().text >= first_rules[task.environment_id]:
                environment_tasks.setdefault(task.environment_id, []).append(task.id)
        for environment_id, task_ids in environment_tasks.items():
            self.bus.run(RecordAssignDecision(tuple(task_ids)), Actor.core(), environment_id=environment_id)
        return sum(len(task_ids) for task_ids in environment_tasks.values())

    def first_rule_times(self) -> dict[int, str]:
        first: dict[int, str] = {}
        for rule in self.queries.query(AssignRule).filter(enabled=True).every_row(RULES_REASON):
            created = rule.creation_timestamp().text
            first[rule.environment_id] = min(first.get(rule.environment_id, created), created)
        return first

    def undecided_tasks(self, earliest: str) -> list[Task]:
        cutoff = Timestamp(self.clock.timestamp().value - UNDECIDED_WAIT).text
        decided = self.queries.query(AssignDecision).select_columns("task_id")
        return self.tasks.free().where_not_in("id", decided).matching(Minimum("created_at", earliest)).matching(Less("created_at", cutoff)).oldest().take(MOST_RETRIED_TASKS)
