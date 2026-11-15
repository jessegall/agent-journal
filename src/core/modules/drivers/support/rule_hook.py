from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question
from engine.rule_backed.rule_hooks import RuleHooks
from engine.driver.agent_hook import AgentHook
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.actor_loader import ActorLoader


class RuleHook(RuleHooks):
    """Builds an old rule's hook from the agent's row, loaded as the rule walk loads its actor."""

    def __init__(self, agents: AgentRows, loader: ActorLoader, clock: Clock) -> None:
        self.agents, self.loader, self.clock = agents, loader, clock

    def built(self, question: Question, view: AgentView) -> AgentHook | None:
        return self.agent_hook(question, view.agent.agent_id)

    def agent_hook(self, question: Question, agent_id: int) -> AgentHook | None:
        if question.event is None:
            return None
        return AgentHook.of_actor(question.event, self.loader.loaded(self.agents.find(agent_id)), self.clock.timestamp())
