from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.rules.support.question_changes import QuestionChanges


class QuestionAnsweredRule(DriverRule):
    """An agent is told once that a question it asked is answered, when no wait on that question is open any
    more."""

    name = "questions.answered"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    history = True

    def __init__(self, changes: QuestionChanges) -> None:
        self.changes = changes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return self.changes.answer(hook, self.name, QuestionState.ANSWERED,
                                lambda question: f"question {question.id} is answered: read it with journal question show {question.id} and act on it")
