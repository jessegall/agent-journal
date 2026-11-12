from engine.driver.agent_hook import AgentHook
from engine.driver.hook_history import HookHistory
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.greater import Greater
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.waits.models.wait_target import WaitTarget
from engine.driver.nudge import Nudge
from core.modules.questions.support.question_nudges import QUESTION_ANSWER_SOURCE

CHANGED_QUESTIONS_REASON = "every question of the agent that changed since the last answer is told, with what waits on it"


class QuestionChanges:
    """The questions an agent asked that reached a state since the rule last answered, with no open wait on
    them."""

    def __init__(self, questions: QuestionQuery, queries: Queries, history: HookHistory) -> None:
        self.questions, self.queries, self.history = questions, queries, history

    def answer(self, hook: AgentHook, rule: str, state: QuestionState, line: NudgeDeclaration) -> RuleAnswer:
        last_answer_at = self.history.last_answer(rule, hook)
        questions = self.questions.agent(hook.agent_id).state(state)
        if last_answer_at is not None:
            questions = questions.matching(Greater("updated_at", last_answer_at.text))
        rows = tuple(questions.every_row(CHANGED_QUESTIONS_REASON))
        waiting_ids = self.waiting_ids([question.id for question in rows])
        lines: list[Nudge] = []
        for question in rows:
            if question.id in waiting_ids:
                continue
            lines.append(line.nudge(question=question.id))
            if state is QuestionState.ANSWERED and question.message_id is not None:
                lines.append(QUESTION_ANSWER_SOURCE.nudge(question=question.id, message=question.message_id,
                             reference=f"question:{question.id} message:{question.message_id}"))
        return RuleAnswer.with_nudges(*lines)

    def waiting_ids(self, question_ids: list[int]) -> set[int]:
        if not question_ids:
            return set()
        return {target.row_id for target in self.queries.query(WaitTarget).filter(row_table="questions")
                .matching(Among("row_id", question_ids)).matching(IsNull("resolved_at")).every_row(CHANGED_QUESTIONS_REASON)}
