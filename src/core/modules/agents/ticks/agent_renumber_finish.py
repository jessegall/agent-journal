from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.database.database import Database
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from core.modules.agents.commands.announce_agent_renumber.announce_agent_renumber import AnnounceAgentRenumber
from core.modules.agents.support.helper_folder_renames import HelperFolderRenames
from core.modules.agents.support.renumber_notices import RenumberNotices
from core.modules.agents.models.enums.agent_renumber_mark_type import AgentRenumberMarkType
from core.modules.agents.models.enums.agent_renumber_mark_variant import AgentRenumberMarkVariant
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.environments.models.environment import Environment
from engine.module.helper_type_check import AGENTS_MODULE
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries

RENUMBER_MARK_KEY = "agent-renumber"
ENVIRONMENTS_REASON = "the person of every environment is told of the renumber of agents"


class AgentRenumberFinish:
    """Finishes the renumber of agents in the running server, never inside the migration: renames the start
    folders of the renumbered helpers, logs the ones it could not find, shows the person one mark in each
    environment's chat of what changed, and has each agent told its new id, all once."""

    def __call__(self, container: Container) -> None:
        missing = HelperFolderRenames(container.get(Database), container.get(JournalHome)).renamed()
        if missing:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"The renumber found no start folder for agents {', '.join(map(str, missing))}")
        text = RenumberNotices(container.get(Database)).person_text()
        if text is not None:
            mark = ShowMark(AgentRenumberMarkType.RENUMBER, AgentRenumberMarkVariant.RENUMBERED, RENUMBER_MARK_KEY, text)
            for environment in container.get(Queries).query(Environment).every_row(ENVIRONMENTS_REASON):
                container.get(Bus).run(mark, container.get(ModuleActors).actor(AGENTS_MODULE), environment_id=environment.id)
        container.get(Bus).run(AnnounceAgentRenumber(), Actor.core())
