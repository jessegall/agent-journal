from core.base.file_access import FileAccess
import json
import sqlite3
from pathlib import Path

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.journal.journal_home import JournalHome
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.mcp.models.enums.server_auth import ServerAuth
from core.base.private.private_folder import PrivateFolder
from core.base.private.server_keys import ServerKeys

TABLE = "mcp_servers"


class McpServersMove(VersionFourMove):
    """Carries version 4's MCP servers with their numbers, names and how each is started or reached, and moves
    the keys of the servers that moved from version 4's keys file under ~/.journal/keys into the keys file
    beside the secret values; version 4's last check of a server is not kept, since the check is read anew."""

    name = "mcp_servers"
    reads = [TABLE]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            if row["auth"] not in tuple(ServerAuth):
                report.skip(TABLE, row["id"], f"it is let in by {row['auth']}")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), context)))
        variables = {row["key_var"] for row in source.rows(TABLE) if row["key_var"]}
        moved = {variable: key for variable, key in self.version_four_keys(context).items() if variable in variables}
        if moved:
            keys = ServerKeys(PrivateFolder(JournalHome(Path(context.journal_folder))))
            keys.write({**keys.all(), **moved})
            report.note(f"moved {len(moved)} server keys into the keys file beside the secret values")
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert(TABLE, {"id": row["id"], "creator_id": creator_id, "name": row["name"], "title": row["title"] or row["name"],
                                   "transport": row["transport"] or "stdio", "command": row["command"] or "", "args": row["args"] or "[]", "url": row["url"] or "",
                                   "key_variable": row["key_var"] or "", "auth": row["auth"], "created_at": created, "updated_at": row["updated_at"] or created})

    @staticmethod
    def version_four_keys(context: MoveContext) -> dict[str, str]:
        path = Path.home() / ".journal" / "keys" / f"{str(Path(context.project_folder).resolve()).strip('/').replace('/', '-')}.json"
        return {str(name): str(value) for name, value in json.loads(FileAccess.shared().read(path)).items()} if path.is_file() else {}
