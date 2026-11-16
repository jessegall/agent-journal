from engine.command.bus import Bus
from engine.driver.wake_request import WakeRequest
from engine.driver.wake_route import WakeRoute
from engine.module.module_actors import ModuleActors
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.record_agent_agent_message.record_agent_message import RecordAgentMessage
from core.modules.drivers.agent_messages.project_hook_wake_message import ProjectHookWakeMessage
from core.modules.drivers.support.driver_settings import MODULE_KEY

PROJECT_HOOK_SOURCE = "drivers.project-hook"
PROJECT_HOOK_TEXT_CHARACTERS = 800


class AgentWakeRoute(WakeRoute):
    """Takes the text of a project hook that ran in the background and ended with exit code 2 as a line for the
    agent of the session that ran it, a main agent or a launched helper; the line is typed into the agent's
    terminal once it stops."""

    def __init__(self, agents: AgentRows, bus: Bus, actors: ModuleActors) -> None:
        self.agents, self.bus, self.actors = agents, bus, actors

    def line(self, wake_request: WakeRequest, hook: str, text: str) -> bool:
        agent = self.asking_agent(wake_request)
        if agent is None or not (agent.is_main or agent.is_launched_helper):
            return False
        agent_message = ProjectHookWakeMessage.declared().agent_message(hook=hook, text=text[:PROJECT_HOOK_TEXT_CHARACTERS])
        self.bus.run(RecordAgentMessage(agent.id, agent_message, PROJECT_HOOK_SOURCE), self.actors.actor(MODULE_KEY), environment_id=agent.environment_id)
        return True

    def asking_agent(self, wake_request: WakeRequest) -> Agent | None:
        return self.agents.open_session(wake_request.session) or (self.agents.open_launch(wake_request.launch) if wake_request.launch else None)
