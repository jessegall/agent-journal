from engine.agent_machine.record.question import Question
from engine.container.container import Container
from engine.database.database import Database
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event import HookEvent
from engine.driver.rule_answer import RuleAnswer
from engine.request.request_values import RequestValues
from engine.rule_backed.rule_hooks import RuleHooks
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.actor_loader import ActorLoader


class RuleHook(RuleHooks):
    """Asks an old rule at the hook built from the agent's row, loaded as the rule walk loads its actor, once for a
    hook and the action asked until a row changes; a transform's later slot asks with the action the earlier
    slot left, so the slots chain."""

    def __init__(self, agents: AgentRows, loader: ActorLoader, clock: Clock, container: Container, request_values: RequestValues, database: Database) -> None:
        self.agents, self.loader, self.clock, self.container, self.request_values, self.database = agents, loader, clock, container, request_values, database

    def answer(self, rule: type[DriverRule], question: Question, agent_id: int) -> RuleAnswer | None:
        event = question.event
        if event is None:
            return None
        return self.request_values.read(f"rule_backed.{rule.name}.{agent_id}.{event.firing}.{question.fingerprint()}", self.database.change_mark, lambda: self.rule_answer(rule, event, agent_id))

    def rule_answer(self, rule: type[DriverRule], event: HookEvent, agent_id: int) -> RuleAnswer:
        hook = AgentHook.of_actor(event, self.loader.loaded(self.agents.find(agent_id)), self.clock.timestamp())
        return self.container.get(rule).answer(hook)
