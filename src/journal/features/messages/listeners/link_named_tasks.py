import re
from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.not_found import NotFound
from journal.repositories.tasks import Tasks

TASK_PATTERN = re.compile(r"\btask (\d+)\b", re.IGNORECASE)


class LinkNamedTasks(Listener[Created]):
    """A task the agent's reply names is linked to the message it answers, so the chat shows it above that message."""

    def __init__(self, messages: Messages, tasks: Tasks, links: Links) -> None:
        self.messages, self.tasks, self.links = messages, tasks, links

    def handle(self, event: Created) -> None:
        reply = event.model
        if not isinstance(reply, Message) or reply.author != Author.AGENT or not reply.reply_to:
            return
        try:
            asked = self.messages.find(reply.reply_to)
        except NotFound:
            return
        for n in {int(n) for n in TASK_PATTERN.findall(reply.text)}:
            try:
                task = self.tasks.find(n)
            except NotFound:
                continue
            if Ref.to(task) not in self.links.targets(asked, Messages.SUBJECT_LINK):
                self.links.save(Link(source=Ref.to(asked), target=Ref.to(task), kind=Messages.SUBJECT_LINK), event.actor)
