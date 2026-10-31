import sqlite3

from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "agents"
ENDED = "ended"


class AgentsMove(VersionFourMove):
    """Carries each version 4 agent with its session, program (version 4's provider), role and
    environment, as an agent whose number is its new actor's; a session that ended stays an ended agent so
    the rows it made keep their owner. An agent with no session is dropped and counted, one with a role
    version 5 does not know is skipped and told."""

    name = "agents"
    reads = ["agents"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(source, map), RowInsert(target)
        roles = [role.value for role in AgentRole]
        for row in source.rows(TABLE):
            if not row["session"]:
                report.drop("agents without a session", 1)
            elif row["role"] not in roles:
                report.skip(TABLE, row["id"], f"role {row['role']} is none of {', '.join(roles)}")
            else:
                created = row["created_at"] or context.timestamp
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row, creators.actor_id(row["creator"]), created)))
        return report

    def insert(self, rows: RowInsert, values: sqlite3.Row, creator_id: int, created: str) -> int:
        actor_id = rows.insert("actors", {"creator_id": creator_id, "type": ActorType.AGENT.value, "name": values["session"], "created_at": created, "updated_at": created})
        ended = (values["updated_at"] or created) if values["state"] == ENDED else None
        return rows.insert(TABLE, {"id": actor_id, "environment_id": values["environment_id"], "creator_id": creator_id, "session": values["session"],
                                   "program": values["provider"] or "", "role": values["role"], "ended_at": ended, "created_at": created,
                                   "updated_at": values["updated_at"] or created})
