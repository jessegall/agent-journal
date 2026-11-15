from abc import ABC, abstractmethod

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question
from engine.driver.agent_hook import AgentHook


class RuleHooks(ABC):
    """Builds the hook an old rule answers from a step's question, so a contribution of the new driver that is
    backed by an old rule asks it exactly what the rule walk asks it; a step outside a hook has none. The
    drivers module binds it."""

    @abstractmethod
    def built(self, question: Question, view: AgentView) -> AgentHook | None: ...

    @abstractmethod
    def agent_hook(self, question: Question, agent_id: int) -> AgentHook | None: ...
