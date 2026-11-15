from collections.abc import Sequence
from typing import ClassVar

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.driver.driver_rule import DriverRule
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_type import GrantType
from engine.rule_backed.rule_events import RuleEvents
from engine.rule_backed.rule_hooks import RuleHooks


class RulePolicy(Policy):
    """A policy of the new driver whose refusal is the one an old rule gives at its hook, with today's text and
    the rule's name as its key; a refusal skip passes it as it passes the rule. A module declares one subclass
    per rule with its rank key; the admission slice of phase 4 asks each policy at its command's entrance too
    and moves the body into it."""

    rule: ClassVar[type[DriverRule]]
    grant_types = [GrantType.REFUSAL_SKIP]

    def __init__(self, hooks: RuleHooks) -> None:
        self.hooks = hooks

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.agent_types = RuleEvents.agent_types(cls.rule)
        cls.role_group = cls.rule.role_group
        cls.replaced_rules = tuple([cls.rule.name])
        cls.key = cls.rule.name

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        if question.event is None or question.event.event not in RuleEvents.hook_events(self.rule):
            return []
        answer = self.hooks.answer(self.rule, question, view.agent.agent_id)
        if answer is None:
            return []
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, answer.refusal)] if answer.refusal else []
