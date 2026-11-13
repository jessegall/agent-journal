from engine.agent.program_sessions import ProgramSessions
from engine.time.timestamp import Timestamp
from core.modules.agents.queries.agent_query import AgentQuery


class AgentProgramSessions(ProgramSessions):
    """Answers from the agent rows whether a session of a program that started before a given time still runs."""

    def __init__(self, agents: AgentQuery) -> None:
        self.agents = agents

    def has_session_started_before(self, program: str, cutoff: Timestamp) -> bool:
        return self.agents.running().created_earlier(cutoff).filter(program=program).exists()
