import sqlite3

from core.base.actor import CORE_ACTOR_ID
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import AGENT, CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource

TABLE = "agents"
ENDED = "ended"
SEPARATOR = ":"
HELPERS = "sent_agents"
FIRST_PROGRAM = "claude"


class AgentsMove(VersionFourMove):
    """Carries each version 4 agent with its session, program (version 4's provider), role and
    environment, as an agent whose number is its new actor's; a session that ended stays an ended
    agent so the rows it made keep their owner. An early session that has no role was a main session
    and moves as one. A session that made rows but has no agent row moves ended, as the helper version 4
    sent it as, or as a main session, since version 4 handed a main row on to the next session; its program
    is Claude Code, the one version 4 was built for. An agent with no session is dropped and counted, one
    with a role version 5 does not know is skipped and told."""

    name = "agents"
    reads = ["agents"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        roles = [role.value for role in AgentRole]
        for row in source.rows(TABLE):
            role = row["role"] or AgentRole.MAIN.value
            if not row["session"]:
                report.drop("agents without a session", 1)
            elif role not in roles:
                report.skip(TABLE, row["id"], f"role {row['role']} is none of {', '.join(roles)}")
            else:
                created = row["created_at"] or context.timestamp
                ended = (row["updated_at"] or created) if row["state"] == ENDED else None
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row["session"], row["environment_id"], row["provider"], role,
                                                                                         creators.actor_id(row["creator"]), created, row["updated_at"] or created, ended)))
        self.move_missing_sessions(source, rows, map, report)
        return report

    def move_missing_sessions(self, source: VersionFourSource, rows: RowInsert, map: MoveMap, report: MoveReport) -> None:
        sessions = {row["session"] for row in source.rows(TABLE)}
        helper_roles = {row["session"]: self.helper_role(row["helper_type"]) for row in source.rows(HELPERS) if row["session"]}
        missing_spans = [span for span in source.creator_spans(AGENT) if self.is_main_session(self.session(span)) and self.session(span) not in sessions
                   and map.new_id("environments", span["environment_id"]) is not None]
        for span in missing_spans:
            role = helper_roles.get(self.session(span), AgentRole.MAIN.value)
            self.insert(rows, self.session(span), span["environment_id"], FIRST_PROGRAM, role, CORE_ACTOR_ID, span["first_at"], span["last_at"], span["last_at"])
            report.count(TABLE, True)
        if missing_spans:
            report.note(f"{len(missing_spans)} sessions that made rows but had no version 4 agent row moved as ended agents")

    @staticmethod
    def helper_role(helper_type: str | None) -> str:
        return helper_type if helper_type in (AgentRole.WORKER.value, AgentRole.REVIEWER.value, AgentRole.VERIFIER.value) else AgentRole.WORKER.value

    @staticmethod
    def is_main_session(session: str) -> bool:
        return bool(session) and SEPARATOR not in session

    @staticmethod
    def session(span: sqlite3.Row) -> str:
        return str(span["creator"]).partition(SEPARATOR)[2]

    def insert(self, rows: RowInsert, session: str, environment_id: int, program: str, role: str, creator_id: int, created: str, updated: str, ended: str | None) -> int:
        actor_id = rows.insert("actors", {"creator_id": creator_id, "type": ActorType.AGENT.value, "name": session, "created_at": created, "updated_at": created})
        return rows.insert(TABLE, {"id": actor_id, "environment_id": environment_id, "creator_id": creator_id, "session": session, "program": program,
                                   "role": role, "ended_at": ended, "created_at": created, "updated_at": updated})
