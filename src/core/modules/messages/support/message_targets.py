from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.models.message import Message


class MessageTargets:
    """Finds the agent a message addresses, with the main agent as the legacy default."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def selected(self, agent_id: int | None) -> Agent | None:
        if agent_id is None:
            return self.agents.main_agent()
        agent = self.agents.find(agent_id)
        if agent.ended_at is not None:
            raise Refusal("a message target must be running", "select a running agent")
        return agent

    def stored_id(self, selected: Agent | None, given_id: int | None) -> int | None:
        if given_id is not None:
            return given_id
        if selected is None:
            return given_id
        return None if selected.role == AgentRole.MAIN else selected.id

    def recipient(self, message: Message) -> Agent | None:
        if message.target_agent_id is None:
            return self.agents.main_agent()
        agent = self.agents.find(message.target_agent_id)
        return agent if agent.ended_at is None else None
