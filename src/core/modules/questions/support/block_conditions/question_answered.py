from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question


class QuestionAnswered(BlockCondition):
    """This question is answered or closed."""

    name = "question-answered"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Question).find(int(self.text)).state is not QuestionState.OPEN
