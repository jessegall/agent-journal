from engine.agent.agent_role_reader import AgentRoleReader
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent


class AgentRoleRows(AgentRoleReader):
    """Reads agent roles from agent rows."""

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def role(self, agent_id: int) -> str:
        return self.rows.required(Agent, agent_id).role
