from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.database.statement import Statement
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource
from datetime import datetime, timezone
from functools import partial
from suites.coding.modules.checks.models.check import CHECK_TITLE_LIMIT_CHARACTERS
from suites.coding.modules.checks.upgrade.check_task import CheckTask
import re
import sqlite3

TABLE = "checks"
WAITING_TITLE = re.compile(r"task (\d+) waits until this passes", re.IGNORECASE)
BLOCKED_STATE = "blocked"


class ChecksMove(VersionFourMove):
    """Carries version 4's checks with their numbers: title, brief, command, interval in minutes, the last
    verdict with its output and time, when the agent was told it fails, and a retired check as removed.
    The wish that a passing check resolves a wait is not carried and is counted. A check that blocks a task
    moves as that task's wait, so a pass opens it; one whose task is no longer blocked moves as removed. A
    check
    with no title or command, or a title too long, is skipped and told."""

    name = "checks"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.tasks"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if not row["command"] or not row["command"].strip() or not row["title"] or len(row["title"]) > CHECK_TITLE_LIMIT_CHARACTERS:
                report.skip(TABLE, row["id"], "it has no command, or its title is empty or over 200 characters")
                continue
            if row["wait_target"]:
                report.drop("check wait targets", 1)
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, creators.actor_id(row["creator"]), context, self.waiting_task(row, target, map))))
        return report

    @staticmethod
    def waiting_task(row: sqlite3.Row, target: Database, map: MoveMap) -> CheckTask:
        title = WAITING_TITLE.fullmatch(row["title"])
        if title is None:
            return CheckTask(None, False)
        task_id = map.new_id("tasks", int(title[1]))
        states = target.rows(Statement.row_state("tasks", task_id)) if task_id is not None else []
        return CheckTask(task_id, bool(states) and states[0]["state"] == BLOCKED_STATE, True)

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext, waiting: CheckTask) -> int:
        created = row["created_at"] or context.timestamp
        updated = row["updated_at"] or created
        reported = datetime.fromtimestamp(row["failure_reported_at"], timezone.utc).isoformat() if row["failure_reported_at"] else None
        passed = None if row["last_passed"] is None else int(bool(row["last_passed"]))
        interval = int(row["interval"]) if row["interval"] else 0
        wait_id = rows.insert("task_waits", {"task_id": waiting.task_id, "creator_id": creator_id, "command": row["command"], "interval_minutes": interval, "created_at": created, "updated_at": updated}) if waiting.is_blocked and not row["is_retired"] else None
        removed_at = updated if row["is_retired"] or (waiting.is_titled and not waiting.is_blocked) else None
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "command": row["command"], "brief": row["brief"] or "",
                                   "interval_minutes": interval, "last_passed": passed, "last_output": row["last_output"] or "",
                                   "last_run_at": row["last_run_at"], "reported_at": reported, "stopped": 0, "removed_at": removed_at, "task_wait_id": wait_id,
                                   "created_at": created, "updated_at": updated})
