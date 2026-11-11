from contextlib import AbstractContextManager, nullcontext

from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_session_state import AgentSessionState


class DispatchPolicy:
    """What a suite decides about its agents and the dispatcher acts on: the lock a start of a session takes,
    whether the session's last program has ended so a new one may start, whether an agent should run now,
    whether an agent that ended is gone for good, and whether it still takes messages. A suite binds its own
    and never starts or ends a program. The default lets every session start, wants no agent started, and
    calls an ended agent gone for good; a kept helper whose program ended still takes its own messages,
    because a message starts its program again."""

    def lock(self, session: str) -> AbstractContextManager[bool]:
        return nullcontext(True)

    def prepare(self, agent: Agent) -> AgentSessionState:
        return AgentSessionState.READY

    def is_wanted(self, agent: Agent) -> bool:
        return False

    def is_final(self, agent: Agent) -> bool:
        return agent.ended_at is not None

    def takes_messages(self, agent: Agent) -> bool:
        return agent.ended_at is None or agent.is_kept_helper
