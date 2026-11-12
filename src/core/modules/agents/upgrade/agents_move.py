import sqlite3
from collections import Counter

from engine.actor.actor import CORE_ACTOR_ID
from engine.enums.actor_type import ActorType
from engine.enums.access import Access
from engine.enums.agent_role import AgentRole
from engine.enums.helper_role import HelperRole
from engine.database.database import Database
from engine.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import AGENT, CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource
from core.modules.agents.models.enums.end_reason import EndReason

TABLE = "agents"
ENDED = "ended"
SEPARATOR = ":"
HELPERS = "sent_agents"
SESSIONS_TABLE = "agent_sessions"

VERSION_FOUR_CHILD_ROLE = "subagent"


class AgentsMove(VersionFourMove):
    """Carries each version 4 agent with its session, program (version 4's provider), role and environment;
    each environment's most recently active main agent stays open, so Continue resumes it, and its older main
    sessions join that one agent as its past sessions; a session that ended stays an ended agent so the rows
    it made keep their owner. An early session that has no role was a main session and moves as one. A
    session that made rows but has no agent row moves ended, as the helper version 4 sent it as with
    that helper's program, or as a main session, since version 4 handed a main row on to the next
    session, with its subagents' program or the one most version 4 agents ran. An agent with no session
    is dropped and counted, one with a role version 5 does not know is skipped and told."""

    name = "agents"
    reads = ["agents"]
    id_modules = ["journal.core.actors", "journal.core.environments"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        roles = list(context.role_names)
        source_rows = list(source.rows(TABLE))
        latest_ids = self.newest_main_ids(source_rows)
        main_rows: dict[int, int] = {}
        for row in sorted(source_rows, key=lambda row: row["id"] not in latest_ids):
            role = self.moved_role(row["role"] or AgentRole.MAIN.value)
            if not row["session"]:
                report.drop("agents without a session", 1)
            elif role not in roles:
                report.skip(TABLE, row["id"], f"role {row['role']} is none of {', '.join(roles)}")
            elif role == AgentRole.MAIN.value and row["environment_id"] in main_rows:
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, lambda: self.session_of(rows, main_rows[row["environment_id"]], row, context)))
            else:
                created = row["created_at"] or context.timestamp
                ended = self.end_timestamp(row, role, created, latest_ids)
                moved_id = map.transfer(TABLE, row["id"], TABLE, lambda: self.insert(rows, row["session"], row["environment_id"], row["provider"], role,
                                                                                     creators.actor_id(row["creator"]), created, row["updated_at"] or created, ended))
                report.count(TABLE, moved_id)
                if role == AgentRole.MAIN.value and moved_id:
                    main_rows[row["environment_id"]] = map.new_id(TABLE, row["id"])
        self.move_missing_sessions(source, rows, map, report, roles)
        return report

    def move_missing_sessions(self, source: VersionFourSource, rows: RowInsert, map: MoveMap, report: MoveReport, roles: list[str]) -> None:
        agent_rows = source.rows(TABLE)
        sessions = {row["session"] for row in agent_rows}
        helpers = {row["session"]: row for row in source.rows(HELPERS) if row["session"]}
        subagent_programs = {row["session"].partition(SEPARATOR)[0]: row["provider"] for row in agent_rows if row["session"] and self.is_subagent_session(row["session"])}
        common_programs = Counter(row["provider"] for row in agent_rows).most_common(1)
        common_program = common_programs[0][0] if common_programs else None
        moved = 0
        for span in source.creator_spans(AGENT):
            session = self.session(span)
            if not session or self.is_subagent_session(session) or session in sessions or map.new_id("environments", span["environment_id"]) is None:
                continue
            helper = helpers.get(session)
            role = self.moved_role(helper["helper_type"]) if helper else AgentRole.MAIN.value
            program = helper["provider"] if helper else subagent_programs.get(session, common_program)
            if role not in roles or not program:
                report.note(f"session {session} made rows but had no agent row, no known role and program: its rows name the core")
                continue
            self.insert(rows, session, span["environment_id"], program, role, CORE_ACTOR_ID, span["first_at"], span["last_at"], span["last_at"])
            report.count(TABLE, True)
            moved += 1
        if moved:
            report.note(f"{moved} sessions that made rows but had no version 4 agent row moved as ended agents")

    @staticmethod
    def end_timestamp(row: sqlite3.Row, role: str, created_at: str, latest_ids: set[int]) -> str | None:
        if row["id"] in latest_ids:
            return None
        if role == AgentRole.MAIN.value or row["state"] == ENDED or role == HelperRole.HELPER:
            return row["updated_at"] or created_at
        return None

    @classmethod
    def newest_main_ids(cls, rows: list[sqlite3.Row]) -> set[int]:
        newest: dict[int, sqlite3.Row] = {}
        for row in rows:
            if not row["session"] or cls.moved_role(row["role"] or AgentRole.MAIN.value) != AgentRole.MAIN.value:
                continue
            current = newest.get(row["environment_id"])
            if current is None or (row["updated_at"] or "") > (current["updated_at"] or ""):
                newest[row["environment_id"]] = row
        return {row["id"] for row in newest.values()}

    @staticmethod
    def moved_role(role: str) -> str:
        return HelperRole.HELPER.value if role == VERSION_FOUR_CHILD_ROLE else role

    @staticmethod
    def is_subagent_session(session: str) -> bool:
        return SEPARATOR in session

    @staticmethod
    def session(span: sqlite3.Row) -> str:
        return str(span["creator"]).partition(SEPARATOR)[2]

    @staticmethod
    def session_of(rows: RowInsert, main_id: int, row: sqlite3.Row, context: MoveContext) -> int:
        started = row["created_at"] or context.timestamp
        rows.insert(SESSIONS_TABLE, {"environment_id": row["environment_id"], "session_agent_id": main_id, "session": row["session"], "program": row["provider"],
                                     "started_at": started, "ended_at": row["updated_at"] or started, "end_reason": EndReason.PERSON_REPLACEMENT.value,
                                     "created_at": started, "updated_at": row["updated_at"] or started})
        return main_id

    def insert(self, rows: RowInsert, session: str, environment_id: int, program: str, role: str, creator_id: int, created: str, updated: str, ended: str | None) -> int:
        actor_id = rows.insert("actors", {"creator_id": creator_id, "type": ActorType.AGENT.value, "name": session, "created_at": created, "updated_at": created})
        return rows.insert(TABLE, {"id": actor_id, "environment_id": environment_id, "creator_id": creator_id, "session": session, "program": program,
                                   "role": role, "access": Access.READ.value if role == HelperRole.HELPER else Access.WRITING.value, "ended_at": ended, "created_at": created, "updated_at": updated})
