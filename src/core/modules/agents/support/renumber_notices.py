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
MAIN_AGENT_ID = 1
MAIN_ROLE = "main"


class RenumberNotices:
    """The lines that tell each agent still running its new id after the renumber of agents, and the main
    agent what the renumber kept and removed, each said once and then marked as said, and the text that tells
    the person the same."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def lines(self) -> list[tuple[int, str]]:
        if int(self.database.rows(TABLES_EXIST)[0]["n"]) < 2:
            return []
        lines = [(int(row["new_id"]), f"You are now {self.label(str(row['role']), int(row['new_id']))} (was agent {row['old_id']}).")
                 for row in self.database.rows(UNANNOUNCED)]
        for row in self.database.rows(SUMMARY):
            counts = json.loads(str(row["counts"]))
            lines.append((MAIN_AGENT_ID, f"Agents renumbered: {counts['stayed']} stay (main agent 1, the others from 2 in the order of their old ids), "
                                         f"{counts['removed']} removed; copy at {row['copy']}."))
        return lines

    def person_text(self) -> str | None:
        if int(self.database.rows(TABLES_EXIST)[0]["n"]) < 2:
            return None
        for row in self.database.rows(SUMMARY):
            counts = json.loads(str(row["counts"]))
            return (f"Agents were renumbered: the main agent is 1 and the agents that stay follow from 2; {counts['removed']} agents were removed, "
                    f"and the messages helpers and workers sent were deleted. Older texts still name the old numbers. "
                    f"A copy of the journal from before is at {row['copy']}.")
        return None

    @staticmethod
    def label(role: str, agent_id: int) -> str:
        return f"main agent {agent_id}" if role == MAIN_ROLE else f"{role} {agent_id}"

    def mark(self, announced_at: str) -> None:
        for row in self.database.rows(UNANNOUNCED):
            self.database.update(Statement(ANNOUNCED, [announced_at, int(row["old_id"])]))
        self.database.update(Statement(SUMMARY_ANNOUNCED, [announced_at]))
