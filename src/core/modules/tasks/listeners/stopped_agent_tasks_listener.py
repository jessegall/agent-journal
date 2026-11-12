from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from core.modules.agents.events.agent_stopped import AgentStopped
from core.modules.tasks.commands.unassign_agent_tasks.unassign_agent_tasks import UnassignAgentTasks


class StoppedAgentTasksListener(SaveListener[AgentStopped]):
    """Hands back the open and started tasks of an agent a person or an agent stopped, in the same change."""

    name = "tasks.stopped-agent-tasks"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: AgentStopped, context: Context) -> None:
        self.bus.dispatch(UnassignAgentTasks(event.row.session_agent_id), context)
