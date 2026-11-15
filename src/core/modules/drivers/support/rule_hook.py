from engine.agent_machine.record.question import Question
from engine.container.container import Container
from engine.database.database import Database
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event import HookEvent
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
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
        return self.request_values.read(RuleHook.answer_key(rule.name, question, agent_id), self.database.change_mark, lambda: self.rule_answer(rule, event, agent_id))

    # the rule walk's own answers of this hook, so a contribution the rule backs asks no rule the walk asked
    def keep_walk_answers(self, answers: RuleAnswers, question: Question, agent_id: int) -> None:
        for record in answers.answered:
            self.request_values.keep(RuleHook.answer_key(record.name, question, agent_id), self.database.change_mark, record.answer)

    @staticmethod
    def answer_key(rule_name: str, question: Question, agent_id: int) -> str:
        firing = question.event.firing if question.event is not None else ""
        return f"rule_backed.{rule_name}.{agent_id}.{firing}.{question.fingerprint()}"

    def rule_answer(self, rule: type[DriverRule], event: HookEvent, agent_id: int) -> RuleAnswer:
        hook = AgentHook.of_actor(event, self.loader.loaded(self.agents.find(agent_id)), self.clock.timestamp())
        return self.container.get(rule).answer(hook)
