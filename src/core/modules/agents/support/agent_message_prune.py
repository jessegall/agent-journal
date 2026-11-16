from engine.database.database import Database
from engine.database.reference_rewrite import ReferenceRewrite
from engine.database.removal_counts import RemovalCounts
from engine.database.row_removal import RowRemoval
from engine.database.schema_columns import SchemaColumns
from core.modules.agents.support.column_rule import ColumnRule

MESSAGE_MODELS = ("message", "messages")
KEPT_TABLES = ("tasks", "documents", "doc_revisions", "reports", "plans", "phases", "rules", "approvals")
UNKEYED_MESSAGE_COLUMNS = (("helper_jobs", "source_message_id"), ("helper_jobs", "report_message_id"), ("worker_task_sources", "source_message_id"))


class AgentMessagePrune:
    """Deletes every message an agent other than the main agent sent, with what depends on it, keeping every
    message of a person, of the main agent, of the core and of modules (message 128810); a kept row that
    needs a deleted message is refused by name, and a reference to one with no key is set to NULL."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def removed(self, main_agent_id: int) -> RemovalCounts:
        rewrite = ReferenceRewrite(self.database)
        if not rewrite.has_table("messages"):
            return RemovalCounts()
        senders = [int(row["id"]) for row in rewrite.matching_rows("actors", "type", "agent") if int(row["id"]) != main_agent_id]
        ids = [int(row["id"]) for row in rewrite.rows("messages", "creator_id", senders)] if senders else []
        if not ids:
            return RemovalCounts()
        pairs = ColumnRule.sets(SchemaColumns(self.database).columns()).pairs
        counts = RowRemoval(self.database, KEPT_TABLES, pairs, {"messages": MESSAGE_MODELS}).removed("messages", ids)
        for table, column in UNKEYED_MESSAGE_COLUMNS:
            if rewrite.has_column(table, column):
                counts.add_nulled(table, rewrite.set_null(table, column, ids))
        return counts
