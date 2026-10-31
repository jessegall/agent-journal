from dataclasses import dataclass

from core.base.driver.rule_answer import RuleAnswer

ANSWERED_OUTCOMES = ("through", "told", "refused")
RAISED = "raised"
SILENCED = "passed_over"


@dataclass(frozen=True)
class RuleOutcome:
    """What asking one rule came to: its answer, or that it raised, with the line the agent reads about that."""

    outcome: str
    answer: RuleAnswer | None = None
    line: str = ""

    @classmethod
    def answered(cls, answer: RuleAnswer) -> "RuleOutcome":
        return cls(answer.said, answer)

    @classmethod
    def raised(cls, line: str) -> "RuleOutcome":
        return cls(RAISED, RuleAnswer.told(line))
