import re

from journal.events.agent.turn_written import TurnWritten
from journal.features.agent_listener import AgentListener
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound

REPLY_TAG = re.compile(r"\[!reply:(\d+)\]")


class RecordTurn(AgentListener[TurnWritten]):
    """Every turn the agent writes for the user becomes a message in the chat, gathered from the deltas it streams in; a [!reply:N] tag makes it the answer to message N and marks N read."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages
        self._gathering: dict[str, str] = {}

    def handle(self, event: TurnWritten) -> None:
        key = event.turn_id or event.session
        whole = self._gathering.get(key, "") + event.text
        if not event.final:
            self._gathering[key] = whole
            return
        self._gathering.pop(key, None)
        if not whole.strip():
            return
        by = Actor.agent(event.session)
        tag = REPLY_TAG.search(whole)
        reply_to = int(tag.group(1)) if tag else None
        text = REPLY_TAG.sub("", whole).strip()
        self.messages.save(Message(environment_id=event.environment_id, author=Author.AGENT, text=text, reply_to=reply_to), by)
        if reply_to is not None:
            try:
                self.messages.mark_read(self.messages.find(reply_to), by)
            except NotFound:
                return
