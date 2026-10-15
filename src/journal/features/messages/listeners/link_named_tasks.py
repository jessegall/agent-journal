import re
from datetime import datetime, timedelta, timezone

from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.ref import Ref
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.repositories.tasks import Tasks

NAMED = re.compile(r"\btask (\d+)\b", re.IGNORECASE)
FRESH = timedelta(minutes=5)
ABOUT = "about"


class LinkNamedTasks(Listener[Created]):
    """A task filed in the last five minutes that the agent's reply names is linked to the message it answers, so the chat shows it above the message."""

    def __init__(self, messages: Messages, tasks: Tasks, links: Links) -> None:
        self.messages, self.tasks, self.links = messages, tasks, links

    def handle(self, event: Created) -> None:
        reply = event.model
        if not isinstance(reply, Message) or reply.author != Author.AGENT or not reply.reply_to:
            return
        since = datetime.now(timezone.utc) - FRESH
        try:
            asked = self.messages.find(reply.reply_to)
        except NotFound:
            return
        for n in {int(n) for n in NAMED.findall(reply.text)}:
            try:
                task = self.tasks.find(n)
            except NotFound:
                continue
            if task.created_at >= since and Ref.to(task) not in self.links.targets(asked, ABOUT):
                self.links.save(Link(source=Ref.to(asked), target=Ref.to(task), kind=ABOUT), event.by)
