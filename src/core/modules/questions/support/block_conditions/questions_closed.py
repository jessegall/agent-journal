from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question


class QuestionsClosed(BlockCondition):
    """The environment has no open question."""

    name = "questions-settled"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(Queries).query(Question).filter(state=QuestionState.OPEN).exists()
