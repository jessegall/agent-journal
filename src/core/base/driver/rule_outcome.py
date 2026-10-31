from dataclasses import dataclass

from core.base.driver.rule_answer import RuleAnswer

RAISED = "raised"
SILENCED = "silenced"


@dataclass(frozen=True)
class RuleOutcome:
    """What asking one rule came to: its answer, or that it raised, with the line the agent reads about that."""

    outcome: str
    answer: RuleAnswer | None = None
    line: str = ""

    @classmethod
    def answered(cls, answer: RuleAnswer) -> "RuleOutcome":
        return cls(answer.outcome, answer)

    @classmethod
    def raised(cls, line: str) -> "RuleOutcome":
        return cls(RAISED, RuleAnswer.with_lines(line))
