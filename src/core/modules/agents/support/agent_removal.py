from collections.abc import Collection

from engine.database.database import Database
from engine.database.reference_rewrite import ReferenceRewrite
from engine.database.removal_counts import RemovalCounts
from engine.database.row_removal import RowRemoval
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from core.modules.agents.support.column_rule import ColumnRule

KEPT_TABLES = ("tasks", "documents", "doc_revisions", "reports", "plans", "phases", "rules", "task_logs", "comments")


class AgentRemoval:
    """Removes the agents that go with what is only theirs, through the agent columns: a row an agent column
    requires goes, a nullable agent column is set to NULL, a pair whose model is an agent goes; the actor
    columns, which say who wrote a row, are never touched, so an agent's actor row and what it wrote stay. A
    kept table a removal would reach is refused by name."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def removed(self, agent_ids: Collection[int]) -> RemovalCounts:
        if not agent_ids:
            return RemovalCounts()
        schema = SchemaColumns(self.database).columns()
        sets = ColumnRule.sets(schema)
        pairs = tuple((table, model, row_id, "agents") for table, model, row_id in sets.pairs)
        counts = RowRemoval(self.database, KEPT_TABLES, pairs).removed("agents", agent_ids)
        keyed = {(column.table, column.column) for column in schema if column.target is not None}
        ids = sorted(agent_ids)
        for table, column in sets.agent:
            if (table, column) in keyed or table == "agents":
                continue
            counts.add_nulled(table, self.database.update(Statement(
                f'UPDATE "{table}" SET "{column}" = NULL WHERE "{column}" IN ({ReferenceRewrite.marks(ids)})', ids)))
        return counts
