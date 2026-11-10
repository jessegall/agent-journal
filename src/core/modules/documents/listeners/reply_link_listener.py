from core.base.actor import Actor
from engine.enums.actor_type import ActorType

from core.base.change.logged_event import LoggedEvent
from core.base.change.created import Created
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task
from core.modules.documents.support.mention_refs import MentionRefs
from core.modules.documents.support.row_refs import RowRefs


class ReplyLinkListener(CommitListener[Created[Message]]):
    """Links the existing tasks an agent reply names to the person request it answers."""

    name = "documents.reply-links"

    def __init__(self, bus: Bus, queries: Queries, row_refs: RowRefs) -> None:
        self.bus, self.queries, self.row_refs = bus, queries, row_refs

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        reply = event.row
        if reply.type is not MessageType.AGENT or reply.parent_id is None:
            return
        answered = self.queries.query(Message).filter(id=reply.parent_id).first()
        if answered is None or answered.type not in PERSON_MESSAGE_TYPES:
            return
        references = tuple(ref for ref in MentionRefs.found(reply.text, [Task.cli_name]) if ref[0] == Task.cli_name)
        for target in self.row_refs.existing_many(references):
            self.bus.run(RecordSubjectLink(answered.id, target.model, target.row_id), Actor(logged.actor_id, ActorType.AGENT),
                         environment_id=reply.environment_id, cause_id=logged.id)
