from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.commands.manage_program.manage_program import ManageProgram
from core.modules.agents.models.agent import Agent
from core.modules.drivers.events.session_started import SessionStarted


class ManageHooksListener(CommitListener[SessionStarted]):
    """Imports project hooks added since the program was launched, after the session start has answered, so git and
    file edits never run inside a hook."""

    name = "drivers.manage-hooks"

    def __init__(self, queries: Queries, bus: Bus, actors: ModuleActors, home: JournalHome) -> None:
        self.queries, self.bus, self.actors, self.home = queries, bus, actors, home

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        program = self.queries.query(Agent).find(call.agent_id).program
        self.bus.run(ManageProgram(program, call.folder or str(self.home.project_folder)), self.actors.actor(DRIVERS_MODULE), cause_id=logged.id)
