from engine.actor.actor import Actor
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.instruction.instruction_imports import InstructionImports
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports import WarnInstructionImports
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class BootInstructionImportsListener(CommitListener[JournalBooting]):
    """As the journal starts, checks the project's CLAUDE.md and AGENTS.md files, so a doubled import is offered for
    removal before the next agent program reads them."""

    name = "agents.boot-instruction-imports"

    def __init__(self, queries: Queries, bus: Bus, home: JournalHome) -> None:
        self.queries, self.bus, self.imports = queries, bus, InstructionImports(home.project_folder)

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        main = MainAgentFinder.newest(self.queries)
        if main is not None:
            self.bus.run(WarnInstructionImports(main.id, tuple(self.imports.faults())), Actor.core(), cause_id=logged.id, environment_id=main.environment_id)
