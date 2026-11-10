from collections.abc import Sequence
from engine.enums.agent_role import AgentRole
from engine.database.statement import Statement
from engine.time.timestamp import Timestamp
from core.modules.tasks.models.support.views import closed_task_counts_select
from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.query import Query
from engine.query.condition import Condition
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.select import Select
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.conditions.task_tag_match import TaskTagMatch
from core.modules.tasks.conditions.takeable_tasks import TakeableTasks
from core.modules.agents.models.agent import MAIN_ROLE, Agent

FOLLOWED_PLAN_STATES = ("approved", "started")


class TaskQuery(Query[Task]):
    """Reads tasks with named filters, including tasks available to delegate under approved plans."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Task)
        self.kept = kept

    def started_tasks(self, agent_id: int) -> tuple[Task, ...]:
        return self.kept.read(self.table.name, lambda: tuple(self.holder(agent_id).started().descending("started_at").all_rows()),
                              "holder_id = ? AND state = ?", [agent_id, TaskState.STARTED], name="tasks.current_tasks")

    def queued_tasks(self, agent_id: int) -> tuple[Task, ...]:
        return self.kept.owner_read(self.table.name, lambda: tuple(self.filter(delegated_to=agent_id, state=TaskState.OPEN).oldest().all_rows()),
                              "delegated_to = ? AND state = ?", [agent_id, TaskState.OPEN], name="tasks.queued_tasks")

    def remember(self, task: Task) -> None:
        self.replace_cached(task, tuple([task]))

    def remove(self, task: Task) -> None:
        self.replace_cached(task, ())

    def replace_cached(self, task: Task, present: tuple[Task, ...]) -> None:
        started = [row for row in present if row.state is TaskState.STARTED]
        queued = [row for row in present if row.state is TaskState.OPEN]
        def with_started(tasks: tuple[Task, ...]) -> tuple[Task, ...]:
            return tuple(sorted([row for row in tasks if row.id != task.id] + started, key=lambda row: row.started_at or row.creation_timestamp(), reverse=True))

        def with_queued(tasks: tuple[Task, ...]) -> tuple[Task, ...]:
            return tuple(sorted([row for row in tasks if row.id != task.id] + queued, key=lambda row: row.id))

        if task.holder_id is not None:
            self.kept.update(self.table.name, with_started, "holder_id = ? AND state = ?", [task.holder_id, TaskState.STARTED], name="tasks.current_tasks")
        if task.delegated_to is not None:
            self.kept.update(self.table.name, with_queued, "delegated_to = ? AND state = ?", [task.delegated_to, TaskState.OPEN], name="tasks.queued_tasks")

    def unclosed(self) -> Self:
        return self.matching(IsNull("closed_at"))

    def holder(self, agent_id: int) -> Self:
        return self.filter(holder_id=agent_id)

    def started(self) -> Self:
        return self.filter(state=TaskState.STARTED)

    def unopenable_blocks(self) -> Self:
        return self.filter(state=TaskState.BLOCKED).matching(SubqueryMatch("id", Select("task_waits").matching(IsNull("ended_at")).column("task_id"), negated=True))

    def no_open_dependency(self) -> Condition:
        return SubqueryMatch("id", Select(OpenDependency.view).column("task_id"), negated=True)

    def ready_delegated(self, agent_id: int) -> tuple[Task, ...]:
        return self.kept.owner_read(self.table.name, lambda: tuple(self.filter(delegated_to=agent_id, state=TaskState.OPEN).matching(self.no_open_dependency()).all_rows()),
                              f"delegated_to = ? AND state = ? AND {self.no_open_dependency().statement().sql}",
                              [agent_id, TaskState.OPEN], name="tasks.next_delegated")

    def main_reserved(self, task_ids: Sequence[int]) -> Self:
        running_main_agents = Select("agents").matching(Among("role", [AgentRole.MAIN])).matching(IsNull("ended_at")).column("id")
        return self.matching(Among("id", task_ids)).matching(SubqueryMatch("delegated_to", running_main_agents)).matching(IsNull("holder_id")).matching(Among("state", [TaskState.OPEN, TaskState.BLOCKED]))

    def takeable(self, agent: Agent) -> Self:
        return self.matching(TakeableTasks(agent.id, agent.role == MAIN_ROLE))

    def open_tasks(self) -> Self:
        return self.filter(state=TaskState.OPEN)

    def tagged(self, word: str) -> Self:
        return self.matching(TaskTagMatch(word))

    def delegation_candidates(self, excluded_agent_ids: Sequence[int]) -> Self:
        active_delegates = SubqueryMatch("delegated_to", Select("agents").matching(IsNull("ended_at")).column("id"))
        active_task_ids = Select("tasks").matching(active_delegates).column("id")
        excluded_task_ids = Select("tasks").matching(Among("delegated_to", excluded_agent_ids)).column("id")
        return (self.open_tasks().matching(SubqueryMatch("id", active_task_ids, negated=True)).matching(SubqueryMatch("id", excluded_task_ids, negated=True))
                .matching(self.unapproved_plan_exclusion()))

    def unapproved_plan_exclusion(self) -> Condition:
        unapproved_plans = Select("plans").matching(Among("state", FOLLOWED_PLAN_STATES, negated=True)).column("id")
        unapproved_phases = Select("phases").matching(SubqueryMatch("plan_id", unapproved_plans)).column("id")
        return SubqueryMatch("id", Select("phase_tasks").matching(SubqueryMatch("phase_id", unapproved_phases)).column("task_id"), negated=True)

    def next_open(self, excluded_id: int | None, exclusion: Condition) -> Task | None:
        free_tasks = self.free_tasks(exclusion)
        return (free_tasks if excluded_id is None else free_tasks.matching(Among("id", [excluded_id], negated=True))).descending("priority").ordered("id").first()

    def next_simple(self, most_complexity: int, exclusion: Condition) -> Task | None:
        return self.free_tasks(exclusion).matching(Less("complexity", most_complexity + 1)).descending("priority").ordered("id").first()

    def free_tasks(self, exclusion: Condition) -> Self:
        return self.open_tasks().matching(IsNull("delegated_to")).matching(self.no_open_dependency()).matching(exclusion)

    def closed_counts(self, starts: Sequence[Timestamp]) -> list[int]:
        if not starts:
            return []
        parameters = (*(start.text for start in starts), self.database.scope_environment_id, min(start.text for start in starts))
        row = self.database.rows(Statement(closed_task_counts_select(len(starts)), parameters))[0]
        return [int(count) for count in row]
