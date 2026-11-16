from engine.actor.actor import CORE_ACTOR_ID
from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock

UNFINISHED = "('started', 'testing', 'blocked')"
TASK_MAIN_AGENT = "(SELECT agents.id FROM agents WHERE agents.role = 'main' AND agents.environment_id = tasks.environment_id)"
NORMAL_ENVIRONMENT = "tasks.environment_id IN (SELECT id FROM environments WHERE test = 0)"
GIVEN = Statement(f"UPDATE tasks SET holder_id = {TASK_MAIN_AGENT} WHERE holder_id = ? AND state IN {UNFINISHED} AND {NORMAL_ENVIRONMENT}"
                  f" AND {TASK_MAIN_AGENT} IS NOT NULL", [CORE_ACTOR_ID])
RELEASED = Statement(f"UPDATE tasks SET holder_id = NULL, state = CASE WHEN state = 'blocked' THEN 'blocked' ELSE 'open' END"
                     f" WHERE holder_id = ? AND state IN {UNFINISHED}", [CORE_ACTOR_ID])
AGENTS_TABLE = Statement("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'agents'")


class CoreHolderTasksMigration(Migration):
    """Gives every unfinished task the journal core held, because a timed step started it as the core, to the
    main agent of its environment; one in a test environment or an environment with no main agent is let go,
    as a release does. A database with no agents table yet changes nothing."""

    number = 28
    statements = ()

    def run(self, database: Database) -> None:
        if not database.rows(AGENTS_TABLE):
            return
        given = database.update(GIVEN)
        released = database.update(RELEASED)
        if given or released:
            SystemLogWriter(JournalHome(database.file().parent), Clock()).write(
                LogLevel.INFORMATION, f"Tasks the journal core held: {given} given to their environment's main agent, {released} let go")
