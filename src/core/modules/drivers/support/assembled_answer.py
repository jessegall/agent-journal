from dataclasses import dataclass

from engine.driver.rule_answers import RuleAnswers
from core.modules.drivers.support.assembled_step import AssembledStep


@dataclass(frozen=True)
class AssembledAnswer:
    """What one hook is answered with: the answer built from the agent machine's decision, and the step to save."""

    answers: RuleAnswers
    step: AssembledStep | None = None
