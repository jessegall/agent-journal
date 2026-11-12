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
from core.modules.assignments.queries.conditions.assignee_among import AssigneeAmong
from core.modules.assignments.queries.conditions.assignee_match import AssigneeMatch
from core.modules.assignments.queries.conditions.unassigned import Unassigned

FOLLOWED_PLAN_STATES = ("approved", "started")

TASK_PAGE_ROWS = 50

class TaskQuery(Query[Task]):
    """Reads tasks with named filters. The open tasks assigned to an actor are that actor's work, and the open
    tasks assigned to nobody are free; both are read from the assignments table."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, Task)
        self.kept = kept

    def started_tasks(self, agent_id: int) -> tuple[Task, ...]:
        return self.kept.read(self.table.name, lambda: self.newest_current(self.holder(agent_id).started().oldest().all_rows(TASK_PAGE_ROWS)),
                              "holder_id = ? AND state = ?", [agent_id, TaskState.STARTED], name="tasks.current_tasks")

    @staticmethod
    def assignee(actor_id: int) -> AssigneeAmong:
        return AssigneeAmong(Task, tuple([actor_id]))

    def assignee_tasks(self, actor_id: int) -> Self:
        return self.matching(self.assignee(actor_id))

    def assigned(self, actor_id: int) -> tuple[Task, ...]:
        assignee = self.assignee(actor_id).statement()
        return self.kept.owner_read(self.table.name, lambda: tuple(self.open_tasks().matching(self.assignee(actor_id)).oldest().all_rows(TASK_PAGE_ROWS)),
                              f"state = ? AND {assignee.sql}", [TaskState.OPEN, *assignee.parameters], name="tasks.queued_tasks")

    def unfinished_assigned(self, actor_id: int) -> tuple[Task, ...]:
        assignee = self.assignee(actor_id).statement()
        states = [TaskState.OPEN, TaskState.STARTED]
        return self.kept.owner_read(self.table.name, lambda: tuple(self.assignee_tasks(actor_id).matching(Among("state", states)).oldest().all_rows(TASK_PAGE_ROWS)),
                                    f"state IN (?, ?) AND {assignee.sql}", [*states, *assignee.parameters], name="tasks.unfinished_assigned")

    def assigned_ready(self, actor_id: int) -> tuple[Task, ...]:
        assignee, dependency_free = self.assignee(actor_id).statement(), self.no_open_dependency().statement()
        return self.kept.owner_read(self.table.name, lambda: tuple(self.open_tasks().matching(self.assignee(actor_id)).matching(self.no_open_dependency()).oldest().all_rows(TASK_PAGE_ROWS)),
                              f"state = ? AND {assignee.sql} AND {dependency_free.sql}", [TaskState.OPEN, *assignee.parameters, *dependency_free.parameters], name="tasks.next_delegated")

    def free(self) -> Self:
        return self.open_tasks().matching(Unassigned(Task))

    def remember(self, task: Task) -> None:
        self.replace_cached(task, tuple([task]))

    def remove(self, task: Task) -> None:
        self.replace_cached(task, ())

    def replace_cached(self, task: Task, present: tuple[Task, ...]) -> None:
        started = [row for row in present if row.state is TaskState.STARTED]
        def with_started(tasks: tuple[Task, ...]) -> tuple[Task, ...]:
            return self.newest_current([row for row in tasks if row.id != task.id] + started)

        if task.holder_id is not None:
            self.kept.update(self.table.name, with_started, "holder_id = ? AND state = ?", [task.holder_id, TaskState.STARTED], name="tasks.current_tasks")

    @staticmethod
    def newest_current(tasks: Sequence[Task]) -> tuple[Task, ...]:
        return tuple(sorted(tasks, key=Task.current_at, reverse=True))

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

    def main_reserved(self, task_ids: Sequence[int]) -> Self:
        running_main_agents = Select("agents").matching(Among("role", [AgentRole.MAIN])).matching(IsNull("ended_at")).column("id")
        return self.matching(Among("id", task_ids)).matching(AssigneeMatch(Task, running_main_agents)).matching(IsNull("holder_id")).matching(Among("state", [TaskState.OPEN, TaskState.BLOCKED]))

    def takeable(self, agent: Agent) -> Self:
        return self.matching(self.takeable_condition(agent))

    @staticmethod
    def takeable_condition(agent: Agent) -> Condition:
        return TakeableTasks(agent.id, agent.role == MAIN_ROLE)

    def open_tasks(self) -> Self:
        return self.filter(state=TaskState.OPEN)

    def tagged(self, word: str) -> Self:
        return self.matching(TaskTagMatch(word))

    def delegation_candidates(self) -> Self:
        return self.free().matching(self.unapproved_plan_exclusion())

    def has_assigned_work(self, actor_id: int) -> bool:
        return self.assignee_tasks(actor_id).matching(Among("state", [TaskState.OPEN, TaskState.STARTED])).exists()

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
        return self.free().matching(self.no_open_dependency()).matching(exclusion)

    def closed_counts(self, starts: Sequence[Timestamp]) -> list[int]:
        if not starts:
            return []
        parameters = (*(start.text for start in starts), self.database.scope_environment_id, min(start.text for start in starts))
        row = self.database.rows(Statement(closed_task_counts_select(len(starts)), parameters))[0]
        return [int(count) for count in row]
