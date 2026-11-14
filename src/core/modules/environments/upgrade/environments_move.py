from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

TABLE = "environments"


class EnvironmentsMove(VersionFourMove):
    """Carries version 4's environments with their numbers, names and branches; the project is every one's
    folder and version 4's key is not carried."""

    name = "environments"
    reads = ["environments"]
    id_modules = ["journal.core.actors"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: rows.insert(TABLE, {
                "id": row["id"], "creator_id": creators.actor_id(row["creator"]), "name": row["name"], "folder": context.project_folder, "branch": row["branch"] or "",
                "created_at": row["created_at"] or context.timestamp, "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))
        return report
