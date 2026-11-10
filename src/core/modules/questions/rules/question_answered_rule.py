from core.modules.questions.support.question_nudges import QUESTION_ANSWERED
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
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
        return self.changes.answer(hook, self.name, QuestionState.ANSWERED, QUESTION_ANSWERED)
