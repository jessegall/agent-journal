import re

from core.base.change.logged_event import LoggedEvent
from core.base.change.created import Created
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from core.modules.documents.listeners.text_mention_listener import MODULE_NAME
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task
from core.modules.plans.models.plan import Plan
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.base.change.touched import Touched

LINKED_MODELS = ("task", "plan", "doc", "report")
TEXT_FIELDS = ("title", "brief", "body", "abstract")
CREATION = "create"
REPLY_WINDOW_SECONDS = 120
TASK_NUMBER = re.compile(r"\btask (\d+)\b", re.IGNORECASE)


class ReplyLinkListener(CommitListener[Created[Message] | Touched[Task] | Touched[Plan] | Touched[Doc] | Touched[Report]]):
    """Links to a person's message the tasks, plans, documents and reports an agent writes within two minutes
    of answering it, and the tasks its answer names, so the chat shows them under that message."""

    name = "documents.reply-links"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Created[Message] | Touched[Task] | Touched[Plan] | Touched[Doc] | Touched[Report], logged: LoggedEvent) -> None:
        model, action = logged.event.rsplit(".", 1)
        if isinstance(event, Created):
            self.link_tasks(event.row, logged)
        has_text_change = action == CREATION or any(field in logged.data for field in TEXT_FIELDS)
        if model in LINKED_MODELS and has_text_change:
            self.link_row(logged, model)

    def link_row(self, logged: LoggedEvent, model: str) -> None:
        replies = self.queries.query(Message).filter(creator_id=logged.actor_id, type=MessageType.AGENT).newest().page(1, 1).rows
        if not replies or replies[0].creation_timestamp().elapsed_seconds(logged.timestamp) > REPLY_WINDOW_SECONDS:
            return
        self.link(replies[0], model, logged.row_id)

    def link_tasks(self, reply: Message, logged: LoggedEvent) -> None:
        if reply.type is not MessageType.AGENT:
            return
        for number in {int(number) for number in TASK_NUMBER.findall(reply.text)}:
            if self.queries.query(Task).filter(id=number).count():
                self.link(reply, Task.model_name, number)

    def link(self, reply: Message, model: str, row_id: int) -> None:
        if reply.parent_id is None:
            return
        answered = self.queries.query(Message).find(reply.parent_id)
        if answered.type in PERSON_MESSAGE_TYPES:
            self.bus.run(RecordSubjectLink(answered.id, model, row_id), self.actors.actor(MODULE_NAME), environment_id=answered.environment_id)
