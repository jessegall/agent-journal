from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.row_removal import RowRemoval
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from core.modules.agents.support.column_rule import ColumnRule

KEPT_TABLES = ("tasks", "documents", "doc_revisions", "reports", "plans", "phases", "rules", "approvals")
UNKEYED_MESSAGE_COLUMNS = (("helper_jobs", "source_message_id"), ("helper_jobs", "report_message_id"), ("worker_task_sources", "source_message_id"))
OTHER_AGENT_MESSAGES = ("SELECT messages.id AS id FROM messages JOIN actors ON actors.id = messages.creator_id"
                        " WHERE actors.type = 'agent' AND messages.creator_id != ?")
MESSAGES_TABLE = Statement("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'messages'", scan_reason=SCHEMA_REASON)
TABLE_COLUMN = "SELECT 1 FROM pragma_table_info(?) WHERE name = ?"


class AgentMessagePrune:
    """Deletes every message an agent other than the main agent sent, with what depends on it, keeping every
    message of a person, of the main agent, of the core and of modules (message 128810); a kept row that
    needs a deleted message is refused by name, and a reference to one with no key is set to NULL."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def removed(self, main_agent_id: int) -> dict[str, int]:
        if not self.database.rows(MESSAGES_TABLE):
            return {}
        ids = [int(row["id"]) for row in self.database.rows(Statement(OTHER_AGENT_MESSAGES, [main_agent_id], scan_reason=SCHEMA_REASON))]
        if not ids:
            return {}
        pairs = tuple((table, model, row_id, "messages") for table, model, row_id in ColumnRule.sets(SchemaColumns(self.database).columns()).pairs)
        counts = RowRemoval(self.database, KEPT_TABLES, pairs).removed("messages", ids)
        for table, column in UNKEYED_MESSAGE_COLUMNS:
            if self.database.rows(Statement(TABLE_COLUMN, [table, column], scan_reason=SCHEMA_REASON)):
                counts[table] = counts.get(table, 0) + self.database.update(Statement(
                    f'UPDATE "{table}" SET "{column}" = NULL WHERE "{column}" IN ({ReferenceRewrite.marks(ids)})', ids))
        return {table: count for table, count in counts.items() if count}
