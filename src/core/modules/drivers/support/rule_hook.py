from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question
from engine.driver.agent_hook import AgentHook
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.actor_loader import ActorLoader


class RuleHook:
    """The hook an old rule answers, built from a step's question and view, so a line or effect of the new driver that is
    backed by an old rule asks it exactly what the rule walk asks it; a step outside a hook has none."""

    def __init__(self, agents: AgentRows, loader: ActorLoader, clock: Clock) -> None:
        self.agents, self.loader, self.clock = agents, loader, clock

    def built(self, question: Question, view: AgentView) -> AgentHook | None:
        return self.of_agent(question, view.agent.agent_id)

    def of_agent(self, question: Question, agent_id: int) -> AgentHook | None:
        if question.event is None:
            return None
        return AgentHook.of_actor(question.event, self.loader.loaded(self.agents.find(agent_id)), self.clock.timestamp())
