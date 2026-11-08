from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.support.coding_nudges import WAITING_ITEMS


class WaitingItemsRule(DriverRule):
    """A main session's start names how many open tasks, unread messages and open questions wait for it."""

    name = "coding.waiting-items"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["coding.*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        environment_id = hook.environment_id
        counts = (("open tasks", self.queries.query(Task).filter(state=TaskState.OPEN).count()),
                  ("unread messages", self.queries.query(Message).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).count()),
                  ("open questions", self.queries.query(Question).filter(state=QuestionState.OPEN).count()))
        items = ", ".join(f"{count} {name}" for name, count in counts if count)
        return RuleAnswer.with_nudges(WAITING_ITEMS.nudge(items=items)) if items else RuleAnswer.allowed()
