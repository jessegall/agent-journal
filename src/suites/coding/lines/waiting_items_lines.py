from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.nudges.waiting_items_nudge import WaitingItemsNudge


class WaitingItemsLines(EventLineSource):
    """A main session's start names how many open tasks, unread messages and open questions wait for it."""

    key = "coding.waiting-items"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        counts = (("open tasks", self.queries.query(Task).filter(state=TaskState.OPEN).count()),
                  ("unread messages", self.queries.query(Message).matching(Among("type", PERSON_MESSAGE_TYPES)).matching(IsNull("read_at")).count()),
                  ("open questions", self.queries.query(Question).filter(state=QuestionState.OPEN).count()))
        items = ", ".join(f"{count} {name}" for name, count in counts if count)
        return [WaitingItemsNudge.declared().nudge(items=items)] if items else []
