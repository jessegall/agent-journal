from core.base.actor import CORE_ACTOR_ID
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "users"


class ActorsMove(VersionFourMove):
    """Carries each version 4 user as a user actor under the same name; the new actor's number is in the map, and the
    rows the user made name it. An agent's actor is made by the agents move."""

    name = "actors"
    reads = ["users"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, rows = MoveReport(), RowInsert(target)
        for row in source.rows(TABLE):
            report.count(TABLE, map.transfer(TABLE, row["id"], "actors", lambda: rows.insert("actors", {
                "creator_id": CORE_ACTOR_ID, "type": ActorType.USER.value, "name": row["name"], "created_at": row["created_at"] or context.timestamp,
                "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))
        return report
