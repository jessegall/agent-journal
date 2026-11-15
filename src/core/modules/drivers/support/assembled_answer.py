from dataclasses import dataclass

from engine.driver.rule_answers import RuleAnswers
from core.modules.drivers.support.assembled_step import AssembledStep


@dataclass(frozen=True)
class AssembledAnswer:
    """What one hook is answered with: the walk's answers with the new driver's decision among them, and the
    new driver's step to save when some of its slices answer the agent."""

    answers: RuleAnswers
    step: AssembledStep | None = None
