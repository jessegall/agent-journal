from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.statement import Statement
from core.modules.agents.support.keep_plan import KeepPlan

AGENT_ROWS = Statement("SELECT id, role, ended_at FROM agents", scan_reason=SCHEMA_REASON)
TASK_HOLDERS = Statement("SELECT DISTINCT holder_id AS id FROM tasks WHERE holder_id IS NOT NULL AND state IN ('started', 'testing', 'blocked')", scan_reason=SCHEMA_REASON)
TASK_ASSIGNEES = Statement("SELECT DISTINCT assignments.actor_id AS id FROM assignments JOIN tasks ON tasks.id = assignments.subject_id"
                           " WHERE assignments.subject_model = 'task' AND tasks.state IN ('started', 'testing', 'blocked')", scan_reason=SCHEMA_REASON)
OPEN_WORKTREES = Statement("SELECT DISTINCT session_agent_id AS id FROM worker_worktrees WHERE state != 'removed' AND merged_at IS NULL", scan_reason=SCHEMA_REASON)


class AgentKeepRule:
    """Decides, from the database as it is and with no change, which agents the renumber keeps: every main
    agent, every agent whose program runs, and every agent holding unfinished work, a task it holds or was
    given in started, testing or blocked, or a worktree not merged or removed; every other agent goes, kept
    idle helpers among them."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def plan(self) -> KeepPlan:
        agents = self.database.rows(AGENT_ROWS)
        ids = {int(row["id"]) for row in agents}
        mains = {int(row["id"]) for row in agents if row["role"] == "main"}
        running = {int(row["id"]) for row in agents if row["ended_at"] is None}
        working = self.ids(TASK_HOLDERS) | self.ids(TASK_ASSIGNEES) | (self.ids(OPEN_WORKTREES) if ReferenceRewrite(self.database).has_table("worker_worktrees") else set())
        stays = mains | running | (working & ids)
        return KeepPlan(frozenset(mains), frozenset(stays), frozenset(ids - stays))

    def ids(self, statement: Statement) -> set[int]:
        return {int(row["id"]) for row in self.database.rows(statement)}
