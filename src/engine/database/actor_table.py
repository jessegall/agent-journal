from engine.actor.actor import CORE_ACTOR_ID
from collections.abc import Sequence
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.database.statement import Statement
from engine.row.row_owner import MAIN_AGENT, RowOwner

CORE_ACTOR = Statement("INSERT OR IGNORE INTO actors (id, type, name, created_at, updated_at) VALUES (?, ?, 'core', ?, ?)")
MODULE_ACTOR = Statement("INSERT OR IGNORE INTO actors (creator_id, type, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
MODULE_ACTOR_ID = Statement("SELECT id FROM actors WHERE type = ? AND name = ?")
SESSION_HOLDER_ID = Statement("SELECT session_agent_id AS id FROM agent_sessions WHERE session = ?")
MODULE_ACTOR_IDS = Statement("SELECT id, name FROM actors WHERE type = 'module'", full_table_reason="One row for each installed module, never for stored journal rows.")
ACTOR_ROW = Statement("SELECT 1 FROM actors WHERE id = ? AND type = ?")
AGENT_OWNER = Statement("SELECT role, environment_id FROM agents WHERE id = ?")
TEST_ENVIRONMENT_GRANT = Statement("SELECT 1 FROM environments WHERE id = ? AND test = 1 AND test_agent_id = ?")
NEWEST_MAIN_AGENT_ID = Statement("SELECT id FROM agents WHERE environment_id = ? AND role = 'main' ORDER BY id DESC LIMIT 1")


class ActorTable:
    """The actors the core itself makes: its own, on the first sync, and one for each module."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.kept = KeptRows(database)
        self.agent_answers: dict[int, bool] = {}
        self.row_owners: dict[int, RowOwner | None] = {}

    def core_actor(self, timestamp: str) -> None:
        self.database.update(Statement(CORE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.CORE.value, timestamp, timestamp)))

    def module_actor(self, module: str, timestamp: str) -> int:
        return self.module_actors(tuple([module]), timestamp)[module]

    def module_actors(self, modules: Sequence[str], timestamp: str) -> dict[str, int]:
        for module in modules:
            self.database.update(Statement(MODULE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.MODULE.value, module, timestamp, timestamp)))
        actors = self.kept.read("actors", self.module_actor_ids, "type = ?", [ActorType.MODULE.value], name="base.module_actors")
        return {module: actors[module] for module in modules}

    def module_actor_id(self, module: str) -> int:
        return self.kept.read("actors", self.module_actor_ids, "type = ?", [ActorType.MODULE.value],
                                            name="base.module_actors")[module]

    def module_actor_ids(self) -> dict[str, int]:
        return {row["name"]: row["id"] for row in self.database.rows(MODULE_ACTOR_IDS)}

    def agent_actor_id(self, session: str) -> int | None:
        rows = self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.AGENT.value, session))) or self.database.rows(Statement(SESSION_HOLDER_ID.sql, (session,)))
        return int(rows[0]["id"]) if rows else None

    def is_agent(self, actor_id: int) -> bool:
        if actor_id not in self.agent_answers:
            self.agent_answers[actor_id] = bool(self.database.rows(Statement(ACTOR_ROW.sql, (actor_id, ActorType.AGENT.value))))
        return self.agent_answers[actor_id]

    def row_owner(self, actor_id: int | None) -> RowOwner | None:
        if actor_id is None:
            return None
        if actor_id not in self.row_owners:
            self.row_owners[actor_id] = self.stored_owner(actor_id)
        return self.row_owners[actor_id]

    def stored_owner(self, actor_id: int) -> RowOwner | None:
        rows = self.database.rows(Statement(AGENT_OWNER.sql, [actor_id]))
        if not rows:
            return None
        agent = MAIN_AGENT if rows[0]["role"] == AgentRole.MAIN else actor_id
        return RowOwner(agent, rows[0]["environment_id"])

    def is_granted_test_environment(self, actor_id: int, environment_id: int) -> bool:
        return self.kept.read("environments", lambda: bool(self.database.rows(Statement(TEST_ENVIRONMENT_GRANT.sql, [environment_id, actor_id]))),
                              "id = ?", [environment_id], name=f"actors.test_grant.{actor_id}")

    def newest_main_agent_id(self, environment_id: int) -> int | None:
        rows = self.database.rows(Statement(NEWEST_MAIN_AGENT_ID.sql, [environment_id]))
        return int(rows[0]["id"]) if rows else None
