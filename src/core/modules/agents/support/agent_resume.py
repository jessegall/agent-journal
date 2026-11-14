from engine.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.support.agent_dispatcher import AgentDispatcher


class AgentResume:
    """The one path on which an agent that ended is started again, whatever sort of agent it is: a paused
    agent is not started, and every other start goes to the dispatcher. The module that owns the agent decides
    when it comes back and with which program line."""

    def __init__(self, dispatcher: AgentDispatcher) -> None:
        self.dispatcher = dispatcher

    def may_resume(self, agent: Agent) -> bool:
        return agent.paused_at is None

    def resume(self, agent: Agent, command: LaunchCommand) -> Dispatch:
        if not self.may_resume(agent):
            return Dispatch.REFUSED
        return self.dispatcher.start(agent, command)
