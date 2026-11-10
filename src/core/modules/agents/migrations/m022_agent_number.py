from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement

NUMBER_COLUMN = "number"


class AgentNumberMigration(Migration):
    """Gives every agent a number inside its environment: the newest main agent of an environment is 1 and every
    other agent 2, 3 and up in the order it was made. An environment without a main agent starts at 2. Run again
    it numbers only the agents that have no number."""

    number = 22
    statements = [
        "UPDATE agents SET number = 1 WHERE number IS NULL AND id IN ("
        "SELECT MAX(mains.id) FROM agents AS mains WHERE mains.role = 'main' AND mains.number IS NULL"
        " AND NOT EXISTS (SELECT 1 FROM agents AS first WHERE first.environment_id = mains.environment_id AND first.number = 1)"
        " GROUP BY mains.environment_id)",
        "UPDATE agents SET number = numbered.number FROM ("
        "SELECT unnumbered.id, COALESCE((SELECT MAX(taken.number) FROM agents AS taken WHERE taken.environment_id = unnumbered.environment_id), 1)"
        " + ROW_NUMBER() OVER (PARTITION BY unnumbered.environment_id ORDER BY unnumbered.id) AS number"
        " FROM agents AS unnumbered WHERE unnumbered.number IS NULL) AS numbered WHERE agents.id = numbered.id",
        "CREATE UNIQUE INDEX IF NOT EXISTS agents_environment_number ON agents (environment_id, number)",
    ]

    def run(self, database: Database) -> None:
        columns = [row["name"] for row in database.rows(Statement("PRAGMA table_info(agents)"))]
        if NUMBER_COLUMN not in columns:
            database.update(Statement("ALTER TABLE agents ADD COLUMN number INTEGER"))
        super().run(database)
