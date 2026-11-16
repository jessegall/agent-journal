from engine.actor.actor import CORE_ACTOR_ID
from collections.abc import Sequence
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.database.database import Database
from engine.container.round_state import RoundState
from engine.database.kept_rows import KeptRows
from engine.database.statement import Statement
from engine.row.row_owner import MAIN_AGENT, RowOwner

CORE_ACTOR = Statement("INSERT OR IGNORE INTO actors (id, type, name, created_at, updated_at) VALUES (?, ?, 'core', ?, ?)")
MODULE_ACTOR = Statement("INSERT OR IGNORE INTO actors (creator_id, type, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
MODULE_ACTOR_ID = Statement("SELECT id FROM actors WHERE type = ? AND name = ?")
SESSION_AGENT_ID = Statement("SELECT id FROM agents WHERE session = ? UNION ALL SELECT session_agent_id AS id FROM agent_sessions WHERE session = ?")
AGENT_ACTOR_ID = Statement("SELECT actor_id AS id FROM agents WHERE id = ?")
ACTOR_AGENT_ID = Statement("SELECT id FROM agents WHERE actor_id = ?")
MODULE_ACTOR_IDS = Statement("SELECT id, name FROM actors WHERE type = 'module'", full_table_reason="One row for each installed module, never for stored journal rows.")
ACTOR_ROW = Statement("SELECT 1 FROM actors WHERE id = ? AND type = ?")
AGENT_ROLE = Statement("SELECT role FROM agents WHERE id = ?")
ACTOR_AGENT_OWNER = Statement("SELECT id, role, environment_id FROM agents WHERE actor_id = ?")
TEST_ENVIRONMENT_GRANT = Statement("SELECT 1 FROM environments JOIN agents ON agents.id = environments.test_agent_id"
                                   " WHERE environments.id = ? AND environments.test = 1 AND agents.actor_id = ?")
MODULE_ACTORS_SIGNATURE = Statement("SELECT count(*), coalesce(sum(id), 0), coalesce(sum(version), 0), max(updated_at) FROM actors WHERE type = 'module'")
ENVIRONMENT_SIGNATURE = Statement("SELECT id, version, updated_at FROM environments WHERE id = ?")
NEWEST_MAIN_AGENT_ID = Statement("SELECT id FROM agents WHERE environment_id = ? AND role = 'main' ORDER BY id DESC LIMIT 1")


class ActorTable(RoundState):
    """The actors the core itself makes: its own, on the first sync, and one for each module."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.kept = KeptRows(database)
        self.agent_answers: dict[int, bool] = {}
        self.row_owners: dict[int, RowOwner | None] = {}
        self.agent_ids: dict[int, int | None] = {}

    def reset(self) -> None:
        self.agent_answers = {}
        self.row_owners = {}
        self.agent_ids = {}

    def core_actor(self, timestamp: str) -> None:
        self.database.update(Statement(CORE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.CORE.value, timestamp, timestamp)))

    def module_actor(self, module: str, timestamp: str) -> int:
        return self.module_actors((module,), timestamp)[module]

    def module_actors(self, modules: Sequence[str], timestamp: str) -> dict[str, int]:
        for module in modules:
            self.database.update(Statement(MODULE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.MODULE.value, module, timestamp, timestamp)))
        actors = self.kept.read_signed(MODULE_ACTORS_SIGNATURE, self.module_actor_ids, name="base.module_actors")
        return {module: actors[module] for module in modules}

    def module_actor_id(self, module: str) -> int:
        return self.kept.read_signed(MODULE_ACTORS_SIGNATURE, self.module_actor_ids, name="base.module_actors")[module]

    def module_actor_ids(self) -> dict[str, int]:
        return {row["name"]: row["id"] for row in self.database.rows(MODULE_ACTOR_IDS)}

    def session_agent_id(self, session: str) -> int | None:
        rows = self.database.rows(Statement(SESSION_AGENT_ID.sql, (session, session)))
        return int(rows[0]["id"]) if rows else None

    def session_actor_id(self, session: str) -> int | None:
        rows = self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.AGENT.value, session)))
        if rows:
            return int(rows[0]["id"])
        agent_id = self.session_agent_id(session)
        agent_rows = self.database.rows(Statement(AGENT_ACTOR_ID.sql, [agent_id])) if agent_id is not None else []
        return int(agent_rows[0]["id"]) if agent_rows else None

    # the role of the agent a session belongs to, none for a session no agent row has yet
    def session_role(self, session: str) -> str | None:
        agent_id = self.session_agent_id(session)
        rows = self.database.rows(Statement(AGENT_ROLE.sql, [agent_id])) if agent_id is not None else []
        return str(rows[0]["role"]) if rows else None

    def is_agent(self, actor_id: int) -> bool:
        if actor_id not in self.agent_answers:
            self.agent_answers[actor_id] = bool(self.database.rows(Statement(ACTOR_ROW.sql, (actor_id, ActorType.AGENT.value))))
        return self.agent_answers[actor_id]

    def actor_id(self, agent_id: int) -> int:
        return int(self.database.rows(Statement(AGENT_ACTOR_ID.sql, [agent_id]))[0]["id"])

    def agent_id(self, actor_id: int) -> int | None:
        if actor_id not in self.agent_ids:
            rows = self.database.rows(Statement(ACTOR_AGENT_ID.sql, [actor_id]))
            self.agent_ids[actor_id] = int(rows[0]["id"]) if rows else None
        return self.agent_ids[actor_id]

    def row_owner(self, actor_id: int | None) -> RowOwner | None:
        if actor_id is None:
            return None
        if actor_id not in self.row_owners:
            self.row_owners[actor_id] = self.stored_owner(actor_id)
        return self.row_owners[actor_id]

    def stored_owner(self, actor_id: int) -> RowOwner | None:
        rows = self.database.rows(Statement(ACTOR_AGENT_OWNER.sql, [actor_id]))
        if not rows:
            return None
        agent = MAIN_AGENT if rows[0]["role"] == AgentRole.MAIN else int(rows[0]["id"])
        return RowOwner(agent, rows[0]["environment_id"])

    def is_granted_test_environment(self, actor_id: int, environment_id: int) -> bool:
        return self.kept.read_signed(Statement(ENVIRONMENT_SIGNATURE.sql, [environment_id]), lambda: bool(self.database.rows(Statement(TEST_ENVIRONMENT_GRANT.sql, [environment_id, actor_id]))),
                                     name=f"actors.test_grant.{actor_id}")

    def newest_main_agent_id(self, environment_id: int) -> int | None:
        rows = self.database.rows(Statement(NEWEST_MAIN_AGENT_ID.sql, [environment_id]))
        return int(rows[0]["id"]) if rows else None
