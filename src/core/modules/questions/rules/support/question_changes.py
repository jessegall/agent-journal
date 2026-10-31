from collections.abc import Callable

from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.waits.models.wait_target import WaitTarget


class QuestionChanges:
    """The questions an agent asked that reached a state since the rule last answered, with no open wait on them."""

    def __init__(self, questions: QuestionQuery, queries: Queries, history: HookHistory) -> None:
        self.questions, self.queries, self.history = questions, queries, history

    def answer(self, hook: AgentHook, rule: str, state: QuestionState, line: Callable[[Question], str]) -> RuleAnswer:
        last_answer_at = self.history.answer_time(RuleHistoryKey(hook.agent_id, rule, hook.layer_ref))
        lines = [line(question) for question in self.questions.agent(hook.agent_id).state(state).oldest().all_rows()
                 if (last_answer_at is None or question.updated_at is None or question.updated_at > last_answer_at) and not self.waiting(question.id)]
        return RuleAnswer.with_lines(*lines) if lines else RuleAnswer.allowed()

    def waiting(self, question_id: int) -> bool:
        return self.queries.query(WaitTarget).filter(row_table="questions", row_id=question_id).matching(IsNull("resolved_at")).exists()
