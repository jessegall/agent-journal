import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.agent_sessions import AgentSessions
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "edits"
TARGET = "file_edits"


class FileEditsMove(VersionFourMove):
    """Carries version 4's edits as file edits under their numbers: the path and the lines added and removed,
    of the agent whose session made them. An edit made by no agent has no row in version 5 and is dropped and
    counted; an edit of an agent that did not move is skipped and told."""

    name = "file-edits"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        sessions = AgentSessions(source, map)
        for row in source.rows(TABLE):
            if not row["session"]:
                report.drop("edits made by no agent", 1)
                continue
            agent_id = sessions.agent_id(row["session"])
            if agent_id is None:
                report.skip(TABLE, row["id"], "the agent that made it did not move")
                continue
            report.count(TARGET, map.transfer(TABLE, row["id"], TARGET, partial(self.insert, rows, row, agent_id, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, agent_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TARGET, {"id": row["id"], "environment_id": row["environment_id"], "agent_id": agent_id, "creator_id": creator_id, "path": row["path"] or "",
                                    "added": row["added"] or 0, "removed": row["removed"] or 0, "created_at": created, "updated_at": row["updated_at"] or created})
