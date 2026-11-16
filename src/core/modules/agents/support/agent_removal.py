from collections.abc import Collection

from engine.database.database import Database
from engine.database.reference_rewrite import ReferenceRewrite
from engine.database.removal_counts import RemovalCounts
from engine.database.row_removal import RowRemoval
from engine.database.schema_columns import SchemaColumns
from core.modules.agents.support.column_rule import ColumnRule

AGENT_MODELS = ("agent", "agents")
KEPT_TABLES = ("tasks", "documents", "doc_revisions", "reports", "plans", "phases", "rules", "task_logs", "comments")


class AgentRemoval:
    """Removes the agents that go with what is only theirs, through the agent columns: a row an agent column
    requires goes, a nullable agent column is set to NULL, a required one with no key to agents takes its row, a pair whose model is an agent goes; the actor
    columns, which say who wrote a row, are never touched, so an agent's actor row and what it wrote stay. A
    kept table a removal would reach is refused by name."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def removed(self, agent_ids: Collection[int]) -> RemovalCounts:
        if not agent_ids:
            return RemovalCounts()
        schema = SchemaColumns(self.database).columns()
        sets = ColumnRule.sets(schema)
        removal = RowRemoval(self.database, KEPT_TABLES, sets.pairs, {"agents": AGENT_MODELS})
        counts = removal.removed("agents", agent_ids)
        keyed = {(column.table, column.column) for column in schema if column.target == "agents"}
        ids = sorted(agent_ids)
        rewrite = ReferenceRewrite(self.database)
        for table, column in sets.agent:
            if (table, column) in keyed:
                continue
            if not rewrite.is_required(table, column):
                counts.add_nulled(table, rewrite.set_null(table, column, ids))
                continue
            rows = rewrite.rows(table, column, ids)
            if rows:
                removal.refuse_kept(table, column, rows[0])
                counts.add(removal.removed(table, [int(row["id"]) for row in rows]))
        return counts
