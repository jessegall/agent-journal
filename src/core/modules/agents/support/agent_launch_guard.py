from collections.abc import Generator
from contextlib import contextmanager

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_session_state import AgentSessionState


class AgentLaunchGuard:
    """Says whether an agent's session may start a process; a suite with resumed sessions binds a stricter one."""

    @contextmanager
    def lock(self, session: str) -> Generator[bool]:
        yield True

    def prepare(self, agent: Agent) -> AgentSessionState:
        return AgentSessionState.READY
