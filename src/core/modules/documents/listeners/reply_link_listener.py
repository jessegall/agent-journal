import re

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from core.modules.documents.listeners.text_mention_listener import MODULE_NAME
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task

LINKED_MODELS = ("task", "plan", "doc", "report")
TEXT_FIELDS = ("title", "brief", "body", "abstract")
CREATION = "create"
REPLY_WINDOW_SECONDS = 120
TASK_NUMBER = re.compile(r"\btask (\d+)\b", re.IGNORECASE)


class ReplyLinkListener(CommitListener):
    """Links to a person's message the tasks, plans, documents and reports an agent writes within two minutes of
    answering it, and the tasks its answer names, so the chat shows them under that message."""

    name = "documents.reply-links"
    event = "*.*"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        model, action = event.event.rsplit(".", 1)
        if model == Message.model_name and action == CREATION:
            self.link_tasks(event)
        has_text_change = action == CREATION or any(field in event.data for field in TEXT_FIELDS)
        if model in LINKED_MODELS and has_text_change:
            self.link_row(event, model)

    def link_row(self, event: LoggedEvent, model: str) -> None:
        replies = self.queries.query(Message).filter(creator_id=event.actor_id, type=MessageType.AGENT).newest().page(1, 1).rows
        if not replies or replies[0].creation_timestamp().elapsed_seconds(event.timestamp) > REPLY_WINDOW_SECONDS:
            return
        self.link(replies[0], model, event.row_id)

    def link_tasks(self, event: LoggedEvent) -> None:
        reply = self.queries.query(Message).find(event.row_id)
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
