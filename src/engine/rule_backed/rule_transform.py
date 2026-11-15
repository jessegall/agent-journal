from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.rewrite import Rewrite
from engine.driver.driver_rule import DriverRule
from engine.rule_backed.rule_events import RuleEvents
from engine.rule_backed.rule_hooks import RuleHooks


class RuleTransform(Transform):
    """A transform of the agent machine whose rewrite is the one an old rule gives at its hook, the same input
    in the same words. The rewritten action is judged as the action asked for, as today: a rewritten shell
    line's parts come from the hook client's parser, so judging the final line again waits for those parts."""

    rule: ClassVar[type[DriverRule]]

    def __init__(self, hooks: RuleHooks) -> None:
        self.hooks = hooks

    def applied(self, question: Question, view: AgentView) -> Rewrite:
        if question.event is None or question.event.event not in RuleEvents.hook_events(self.rule):
            return Rewrite.unchanged()
        answer = self.hooks.answer(self.rule, question, view.agent.agent_id)
        if answer is None or not answer.updated_input:
            return Rewrite.unchanged()
        return Rewrite.replaced(answer.updated_input, tuple([self.slot]), "", question)
