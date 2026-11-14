from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement

CLOSED_NOW = "strftime('%Y-%m-%dT%H:%M:%S.000000+00:00', 'now')"
TITLE_COMMAND = "journal output title %"
READ_COMMAND = "journal output read %"


class StaleOutputBlocksMigration(Migration):
    """Closes the open blocks that wait for a title or a read of an output whose run ended, is gone or was read since:
    from now a block of that kind closes itself. A database whose blocks table is not made yet has none."""

    number = 83
    statements = [
        f"UPDATE agent_blocks SET closed_at = {CLOSED_NOW} WHERE closed_at IS NULL AND condition_name = 'ran-command' AND condition_text LIKE '{TITLE_COMMAND}' "
        "AND NOT EXISTS (SELECT 1 FROM processes WHERE processes.id = CAST(substr(agent_blocks.condition_text, 21) AS INTEGER) AND processes.state IN ('running', 'background'))",
        f"UPDATE agent_blocks SET closed_at = {CLOSED_NOW} WHERE closed_at IS NULL AND condition_name = 'ran-command' AND condition_text LIKE '{READ_COMMAND}' "
        "AND NOT EXISTS (SELECT 1 FROM outputs WHERE outputs.process_id = CAST(substr(agent_blocks.condition_text, 20) AS INTEGER) AND outputs.read_at IS NULL)",
    ]

    def run(self, database: Database) -> None:
        if "closed_at" in self.column_names(database, "agent_blocks"):
            for sql in self.statements:
                database.update(Statement(sql))
