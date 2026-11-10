from engine.actor.actor import Actor
from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports import WarnInstructionImports
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class BootInstructionImportsListener(CommitListener[JournalBooting]):
    """As the journal starts, checks the project's CLAUDE.md and AGENTS.md files, so a doubled import is offered for
    removal before the next agent program reads them."""

    name = "agents.boot-instruction-imports"

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        main = MainAgentFinder.newest(self.queries)
        if main is not None:
            self.bus.run(WarnInstructionImports(main.id), Actor.core(), cause_id=logged.id, environment_id=main.environment_id)
