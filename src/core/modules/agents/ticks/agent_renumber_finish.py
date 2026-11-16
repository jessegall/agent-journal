from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.database.database import Database
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from core.modules.agents.commands.announce_agent_renumber.announce_agent_renumber import AnnounceAgentRenumber
from core.modules.agents.support.helper_folder_renames import HelperFolderRenames


class AgentRenumberFinish:
    """Finishes the renumber of agents in the running server, never inside the migration: renames the start
    folders of the renumbered helpers, logs the ones it could not find, and has each agent told its new id."""

    def __call__(self, container: Container) -> None:
        missing = HelperFolderRenames(container.get(Database), container.get(JournalHome)).renamed()
        if missing:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"The renumber found no start folder for agents {', '.join(map(str, missing))}")
        container.get(Bus).run(AnnounceAgentRenumber(), Actor.core())
