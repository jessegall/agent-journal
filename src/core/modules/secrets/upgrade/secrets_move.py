import sqlite3

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.time.timestamp import Timestamp
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.secrets.models.enums.secret_type import SecretType

TABLE = "secrets"
BROWSER_LOGIN = "browser login"


class SecretsMove(VersionFourMove):
    """Carries version 4's secrets with their numbers, fields, filled fields, programs and deletion; a
    browser login waits for after the switch and is skipped. The values file stays where version 4 wrote it,
    named by the same project id, and is read as it is."""

    name = "secrets"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if row["secret_type"] not in tuple(SecretType):
                report.skip(TABLE, row["id"], "a browser login moves after the switch" if row["secret_type"] == BROWSER_LOGIN else f"type {row['secret_type']}")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        deleted = Timestamp.parsed(row["deleted_at"]).text if row["deleted_at"] else None
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "title": row["title"], "brief": row["brief"] or "", "secret_type": row["secret_type"],
                                   "fields": row["fields"] or "[]", "filled": row["filled"] or "[]", "programs": row["programs"] or "[]",
                                   "proposed": row["proposed"] or "[]", "helpers": int(bool(row["helpers"])), "deleted_at": deleted, "created_at": created,
                                   "updated_at": row["updated_at"] or created})
