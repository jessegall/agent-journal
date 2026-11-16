from engine.database.database import Database
from engine.database.rebuild_migration import RebuildMigration
from engine.database.statement import Statement

NUMBER_COLUMN = "number"


class AgentIdsOnlyMigration(RebuildMigration):
    """An agent is named by its id alone: the number column of agents and its index go, and so do the tables
    that recorded folds of main agents, which the renumber made the last of."""

    number = 32
    statements = (
        "DROP INDEX IF EXISTS agents_environment_number",
        "DROP TABLE IF EXISTS agent_fold_rows",
        "DROP TABLE IF EXISTS agent_folds",
    )

    def rebuild(self, database: Database) -> None:
        super().rebuild(database)
        if NUMBER_COLUMN in self.column_names(database, "agents"):
            database.update(Statement("ALTER TABLE agents DROP COLUMN number"))
