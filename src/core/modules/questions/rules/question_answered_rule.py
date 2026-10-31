from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_history import HookHistory
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.waits.models.wait_target import WaitTarget


class QuestionAnsweredRule(DriverRule):
    """An agent is told once that a question it asked is answered, when no wait on that question is open any
    more."""

    name = "questions.answered"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    history = True

    def __init__(self, questions: QuestionQuery, queries: Queries, history: HookHistory) -> None:
        self.questions, self.queries, self.hook_history = questions, queries, history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        told_at = self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref))
        lines = [f"question {question.id} is answered: read it with journal question show {question.id} and act on it"
                 for question in self.questions.asked_by(hook.agent_id).answered_ones().oldest().all_rows()
                 if (told_at is None or question.updated_at is None or question.updated_at > told_at) and not self.waiting(question.id)]
        return RuleAnswer.with_lines(*lines) if lines else RuleAnswer.allowed()

    def waiting(self, question_id: int) -> bool:
        return self.queries.query(WaitTarget).filter(row_table="questions", row_id=question_id).matching(IsNull("resolved_at")).exists()
