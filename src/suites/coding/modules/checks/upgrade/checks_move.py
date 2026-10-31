import sqlite3
from datetime import datetime, timezone
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from suites.coding.modules.checks.models.check import TITLE_LIMIT_CHARACTERS

TABLE = "checks"


class ChecksMove(VersionFourMove):
    """Carries version 4's checks with their numbers: title, brief, command, interval in minutes, the last
    verdict with its output and time, when the agent was told it fails, and a retired check as removed.
    The wish that a passing check resolves a wait is not carried and is counted. A check with no title
    or command, or a title too long, is skipped and told."""

    name = "checks"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if not row["command"] or not row["command"].strip() or not row["title"] or len(row["title"]) > TITLE_LIMIT_CHARACTERS:
                report.skip(TABLE, row["id"], "it has no command, or its title is empty or over 200 characters")
                continue
            if row["wait_target"]:
                report.drop("check wait targets", 1)
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        updated = row["updated_at"] or created
        reported = datetime.fromtimestamp(row["failure_reported_at"], timezone.utc).isoformat() if row["failure_reported_at"] else None
        passed = None if row["last_passed"] is None else int(bool(row["last_passed"]))
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "command": row["command"], "brief": row["brief"] or "",
                                   "interval_minutes": int(row["interval"]) if row["interval"] else 0, "last_passed": passed, "last_output": row["last_output"] or "",
                                   "last_run_at": row["last_run_at"], "reported_at": reported, "stopped": 0, "removed_at": updated if row["is_retired"] else None,
                                   "created_at": created, "updated_at": updated})
