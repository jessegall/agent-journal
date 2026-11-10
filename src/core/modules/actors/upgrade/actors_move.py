import getpass

from engine.actor.actor import CORE_ACTOR_ID
from engine.enums.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource

TABLE = "users"
FIRST_USER_ID = 1
SIGNED_TABLE = "messages"


class ActorsMove(VersionFourMove):
    """Carries each version 4 user as a user actor under the same name; the new actor's number is in the map,
    and the rows the user made name it. A version 4 journal with no user row has one person all the same, its
    rows signed user:1, so that person is made under the login name, or the viewer would open for nobody. An
    agent's actor is made by the agents move."""

    name = "actors"
    reads = ["users"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, rows = MoveReport(), RowInsert(target)
        users = list(source.rows(TABLE))
        for row in users:
            report.count(TABLE, map.transfer(TABLE, row["id"], "actors", lambda: rows.insert("actors", {
                "creator_id": CORE_ACTOR_ID, "type": ActorType.USER.value, "name": row["name"], "created_at": row["created_at"] or context.timestamp,
                "updated_at": row["updated_at"] or row["created_at"] or context.timestamp})))
        if not users and source.count(SIGNED_TABLE):
            report.count(TABLE, map.transfer(TABLE, FIRST_USER_ID, "actors", lambda: rows.insert("actors", {
                "creator_id": CORE_ACTOR_ID, "type": ActorType.USER.value, "name": getpass.getuser(), "created_at": context.timestamp, "updated_at": context.timestamp})))
        return report
