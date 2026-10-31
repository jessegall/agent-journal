import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.state_walk import StateWalk
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_ref import VersionFourRef
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.tasks.models.enums.task_priority import TaskPriority
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import TITLE_LIMIT_CHARACTERS

TABLE = "tasks"
FORMER_NAMES = {"parked": TaskState.BLOCKED, "paused": TaskState.BLOCKED, "done": TaskState.COMPLETED, "delegated": TaskState.STARTED}
STATES = {member.value: member for member in TaskState}
CLOSED = (TaskState.COMPLETED, TaskState.CANCELLED)
HIGH_PRIORITY, LOW_PRIORITY = 3, 1


class TasksMove(VersionFourMove):
    """Carries version 4's tasks with their numbers: the state by its name or its former name (paused and
    parked are blocked), the priority number as low, normal or high, a title cut to 80 characters with the
    whole of it put first in the brief, the pause or block reason as the reason, and the agent that held it.
    Their log lines go to task_logs and the links of type depends to task_dependencies, a link that would
    close a loop dropped and counted. A task in a state version 5 does not know is skipped and told."""

    name = "tasks"
    reads = ["tasks", "task_logs", "links"]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        holders = self.holders(source, map)
        for row in source.rows(TABLE):
            state = self.state(row["state"])
            if state is None:
                report.skip(TABLE, row["id"], f"state {row['state']} is none of {', '.join(member.value for member in TaskState)}")
            else:
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, state, creators.actor_id(row["creator"]), holders.get(row["id"]), context)))
        self.logs(source, rows, creators, map, report, context)
        self.dependencies(source, rows, creators, map, report, context)
        return report

    def state(self, name: str | None) -> TaskState | None:
        if name is None:
            return None
        return FORMER_NAMES.get(name) or STATES.get(name)

    def priority(self, number: int | None) -> str:
        if number is not None and number >= HIGH_PRIORITY:
            return TaskPriority.HIGH.value
        return TaskPriority.LOW.value if number is not None and number <= LOW_PRIORITY else TaskPriority.NORMAL.value

    def holders(self, source: VersionFourSource, map: MoveMap) -> dict[int, int]:
        holders: dict[int, int] = {}
        for link in [row for row in source.rows("links") if row["link_type"] == "holds"]:
            agent, task = VersionFourRef.parsed(link["source"]), VersionFourRef.parsed(link["target"])
            new_agent = map.new_id("agents", agent.number) if agent.table == "agents" and agent.number is not None else None
            if new_agent is not None and task.table == TABLE and task.number is not None:
                holders[task.number] = new_agent
        return holders

    def insert(self, rows: RowInsert, row: sqlite3.Row, state: TaskState, creator_id: int, holder_id: int | None, context: MoveContext) -> int:
        title, brief = row["title"] or "", row["brief"] or ""
        if len(title) > TITLE_LIMIT_CHARACTERS:
            title, brief = title[:TITLE_LIMIT_CHARACTERS], f"{row['title']}\n\n{brief}".strip()
        created = row["created_at"] or context.timestamp
        closed = (row["completed_at"] or row["updated_at"] or created) if state in CLOSED else None
        task_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "holder_id": holder_id if state is TaskState.STARTED else None,
                                      "creator_id": creator_id, "title": title, "brief": brief, "priority": self.priority(row["priority"]),
                                      "reason": row["block_reason"] or row["pause_reason"] or "", "outcome": row["outcome"] or "", "closed_at": closed,
                                      "created_at": created, "updated_at": row["updated_at"] or created})
        for step in StateWalk(TaskLifecycle).path(state) or []:
            rows.set_state(TABLE, task_id, step.value)
        return task_id

    def logs(self, source: VersionFourSource, rows: RowInsert, creators: CreatorResolver, map: MoveMap, report: MoveReport, context: MoveContext) -> None:
        for row in source.rows("task_logs"):
            task_id = map.new_id(TABLE, row["task_id"]) if row["task_id"] is not None else None
            if task_id is None or not row["line"]:
                report.skip("task_logs", row["id"], "its task did not move or it has no line")
                continue
            report.count("task_logs", map.transfer("task_logs", row["id"], "task_logs", lambda: rows.insert("task_logs", {
                "task_id": task_id, "creator_id": creators.actor_id(row["creator"]), "line": row["line"], "created_at": row["created_at"] or context.timestamp,
                "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))

    def dependencies(self, source: VersionFourSource, rows: RowInsert, creators: CreatorResolver, map: MoveMap, report: MoveReport, context: MoveContext) -> None:
        edges: dict[int, set[int]] = {}
        for link in [row for row in source.rows("links") if row["link_type"] == "depends"]:
            task_id, dependency_id = self.task_id(link["source"], map), self.task_id(link["target"], map)
            if task_id is None or dependency_id is None or task_id == dependency_id:
                report.skip("links", link["id"], "a task of the link did not move or it depends on itself")
            elif self.reaches(edges, dependency_id, task_id):
                report.drop("dependency loops", 1)
            else:
                edges.setdefault(task_id, set()).add(dependency_id)
                report.count("links", map.transfer("links", link["id"], "task_dependencies", partial(self.depend, rows, creators, link, task_id, dependency_id, context)))

    def reaches(self, edges: dict[int, set[int]], start: int, goal: int) -> bool:
        pending, visited = [start], set[int]()
        while pending:
            current = pending.pop()
            if current == goal:
                return True
            visited.add(current)
            pending.extend(edges.get(current, set()) - visited)
        return False

    def task_id(self, text: str | None, map: MoveMap) -> int | None:
        ref = VersionFourRef.parsed(text)
        return map.new_id(TABLE, ref.number) if ref.table == TABLE and ref.number is not None else None

    def depend(self, rows: RowInsert, creators: CreatorResolver, link: sqlite3.Row, task_id: int, dependency_id: int, context: MoveContext) -> int:
        return rows.insert("task_dependencies", {"task_id": task_id, "dependency_id": dependency_id, "creator_id": creators.actor_id(link["creator"]),
                                                 "created_at": link["created_at"] or context.timestamp, "updated_at": link["updated_at"] or link["created_at"] or context.timestamp})
