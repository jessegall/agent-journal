from engine.database.database import Database
from engine.database.migration import Migration
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from core.modules.agents.support.agent_renumber import AgentRenumber


class AgentRenumbersMigration(Migration):
    """Renumbers the agents: the main agent becomes 1, every agent that stays follows from 2, the others go
    with the messages they sent, and the map and one summary row are kept for the folder renames and notices
    the server does next. A renumber that does not add up rolls back and stops the start, naming the copy."""

    number = 31
    statements = (
        "CREATE TABLE IF NOT EXISTS agent_renumbers (old_id INTEGER PRIMARY KEY, new_id INTEGER NOT NULL UNIQUE, role TEXT NOT NULL, announced_at TEXT) STRICT",
        "CREATE TABLE IF NOT EXISTS agent_renumber_summary (id INTEGER PRIMARY KEY CHECK (id = 1), copy TEXT NOT NULL, counts TEXT NOT NULL CHECK (json_valid(counts)),"
        " folders_done INTEGER NOT NULL DEFAULT 0, renumbered_at TEXT NOT NULL, announced_at TEXT) STRICT",
    )

    def run(self, database: Database) -> None:
        super().run(database)
        clock = Clock()
        home = JournalHome(database.file().parent)
        renumber = AgentRenumber(database, home)
        if not renumber.is_needed():
            return
        summary = renumber.run(clock.timestamp())
        SystemLogWriter(home, clock).write(LogLevel.INFORMATION, f"Renumbered the agents: {summary}")
