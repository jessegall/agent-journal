import json
import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

TABLE = "aliases"
READERS, PLUGINS = "readers", "plugins"


class AliasesMove(VersionFourMove):
    """Carries aliases with their numbers, lines, variables, background flags, readers and plugins; a reader that did
    not move leaves the alias with none and is told, and an alias of a plugin that did not move is skipped
    and told."""

    name = "aliases"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.processes", "journal.core.plugins"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            reader_id = rows.name_row_id(READERS, row["reader"]) if row["reader"] else None
            if row["reader"] and reader_id is None:
                report.note(f"alias {row['name']} named the reader {row['reader']}, which did not move: it moved with none")
            plugin_id = rows.name_row_id(PLUGINS, row["plugin"]) if row["plugin"] else None
            if row["plugin"] and plugin_id is None:
                report.skip(TABLE, row["id"], f"its plugin {row['plugin']} did not move")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, reader_id, plugin_id, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, reader_id: int | None, plugin_id: int | None, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        variables = [f"{name}={value}" for name, value in json.loads(row["variables"] or "{}").items()]
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "name": row["name"], "line": row["line"], "reader_id": reader_id,
                                   "description": row["description"] or "", "variables": json.dumps(variables), "background": int(bool(row["background"])),
                                   "plugin_id": plugin_id, "created_at": created,
                                   "updated_at": row["updated_at"] or created})
