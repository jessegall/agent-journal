from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.journal.journal_home import JournalHome
from engine.listener.commit_listener import CommitListener
from engine.module.driver_entries import DRIVERS_MODULE
from engine.module.module_actors import ModuleActors
from core.modules.agents.commands.manage_program.manage_program import ManageProgram
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.events.session_started import SessionStarted


class ManageHooksListener(CommitListener[SessionStarted]):
    """Imports project hooks added since the program was launched, after the session start has answered, so git and
    file edits never run inside a hook."""

    name = "drivers.manage-hooks"

    def __init__(self, agents: AgentRows, bus: Bus, actors: ModuleActors, home: JournalHome) -> None:
        self.agents, self.bus, self.actors, self.home = agents, bus, actors, home

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        program = self.agents.find(call.session_agent_id).program
        self.bus.run(ManageProgram(program, call.folder or str(self.home.project_folder)), self.actors.actor(DRIVERS_MODULE), cause_id=logged.id)
