from engine.enums.agent_role import AgentRole
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.send_readers_notice.send_readers_notice import SendReadersNotice
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME
from core.modules.drivers.events.session_started import SessionStarted


class StartReadersListener(CommitListener[SessionStarted]):
    """After a main agent's session start has answered, checks the readers, so the hook stays cheap however many
    readers and samples the project holds."""

    name = "processes.start-readers"

    def __init__(self, agents: AgentRows, bus: Bus, actors: ModuleActors) -> None:
        self.agents, self.bus, self.actors = agents, bus, actors

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if self.agents.find(call.session_agent_id).role == AgentRole.MAIN:
            self.bus.run(SendReadersNotice(), self.actors.actor(MODULE_NAME), cause_id=logged.id)
