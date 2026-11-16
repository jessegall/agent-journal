import json

from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.statement import Statement

UNANNOUNCED = Statement("SELECT agent_renumbers.old_id AS old_id, agent_renumbers.new_id AS new_id, agent_renumbers.role AS role"
                        " FROM agent_renumbers JOIN agents ON agents.id = agent_renumbers.new_id WHERE agent_renumbers.announced_at IS NULL"
                        " AND agents.ended_at IS NULL ORDER BY agent_renumbers.new_id", scan_reason=SCHEMA_REASON)
SUMMARY = Statement("SELECT copy, counts FROM agent_renumber_summary WHERE id = 1 AND announced_at IS NULL", scan_reason=SCHEMA_REASON)
TABLES_EXIST = Statement("SELECT count(*) AS n FROM sqlite_master WHERE type = 'table' AND name IN ('agent_renumbers', 'agent_renumber_summary')",
                         scan_reason=SCHEMA_REASON)
ANNOUNCED = "UPDATE agent_renumbers SET announced_at = ? WHERE old_id = ?"
SUMMARY_ANNOUNCED = "UPDATE agent_renumber_summary SET announced_at = ? WHERE id = 1"
MAIN_ROLE = "main"


class RenumberNotices:
    """The lines that tell each agent still running its new id after the renumber of agents, and the main
    agent what the renumber kept and removed, each said once and then marked as said, and the text that tells
    the person the same."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def agent_lines(self) -> list[tuple[int, dict[str, object]]]:
        if int(self.database.rows(TABLES_EXIST)[0]["n"]) < 2:
            return []
        return [(int(row["new_id"]), {"agent": self.label(str(row["role"]), int(row["new_id"])), "old_id": int(row["old_id"])})
                for row in self.database.rows(UNANNOUNCED)]

    def summary(self) -> dict[str, object] | None:
        if int(self.database.rows(TABLES_EXIST)[0]["n"]) < 2:
            return None
        for row in self.database.rows(SUMMARY):
            counts = json.loads(str(row["counts"]))
            return {"stayed": counts["stayed"], "removed": counts["removed"], "copy": str(row["copy"])}
        return None

    def person_text(self) -> str | None:
        summary = self.summary()
        if summary is None:
            return None
        return (f"Agents were renumbered: the main agent is 1 and the agents that stay follow from 2; {summary['removed']} agents were removed, "
                f"and the messages helpers and workers sent were deleted. Older texts still name the old numbers. "
                f"A copy of the journal from before is at {summary['copy']}.")

    @staticmethod
    def label(role: str, agent_id: int) -> str:
        return f"main agent {agent_id}" if role == MAIN_ROLE else f"{role} {agent_id}"

    def mark(self, announced_at: str) -> None:
        for row in self.database.rows(UNANNOUNCED):
            self.database.update(Statement(ANNOUNCED, [announced_at, int(row["old_id"])]))
        self.database.update(Statement(SUMMARY_ANNOUNCED, [announced_at]))
