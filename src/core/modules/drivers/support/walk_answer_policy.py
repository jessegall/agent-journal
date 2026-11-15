from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.agent_stack.reason import Reason
from engine.driver.rule_answers import RuleAnswers
from engine.enums.decision_class import DecisionClass

WALK_RANK = "drivers.walk"


class WalkAnswerPolicy(Policy):
    """The old walk's refusal as a reason of the one record while some of its slices still answer (doc 1310
    section 13.2, item 3): a hold at a stop and a refusal elsewhere, ranked after the new reasons of its
    class, so any refusal refuses and the refusal counts count it. It is built for one hook, never listed by
    a module."""

    key = WALK_RANK
    rank = WALK_RANK

    def __init__(self, answers: RuleAnswers) -> None:
        self.answers = answers

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        refusal = self.answers.refusal
        if not refusal:
            return []
        deciding = next((rule.name for rule in self.answers.answered if rule.answer is not None and rule.answer.refusal == refusal), WALK_RANK)
        return [Reason(deciding, DecisionClass.HOLD if question.is_stop() else DecisionClass.REFUSE, self.rank, refusal)]
