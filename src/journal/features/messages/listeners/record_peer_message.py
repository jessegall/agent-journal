import re
from datetime import datetime, timezone

from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages

CROSS_SESSION = re.compile(r"^<cross-session-message\s+([^>]*)>(.*?)</cross-session-message>$", re.S)
FROM_NAME, FROM_ADDRESS = re.compile(r'\bfrom-name="([^"]*)"'), re.compile(r'\bfrom="([^"]*)"')
PEER = "peer"


class RecordPeerMessage(AgentListener[PromptSubmitted]):
    """A message another agent's session sent this one reaches the chat as that session's, named, never as the user's words."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def handle(self, event: PromptSubmitted) -> None:
        sent = CROSS_SESSION.match(event.prompt.strip())
        if not sent:
            return
        self.messages.save(Message(author=Author.SYSTEM, text=sent[2].strip(), read_at=datetime.now(timezone.utc), data={"kind": PEER, "session": event.session, "peer": self.sender(sent[1])}), Actor.system())

    @staticmethod
    def sender(attributes: str) -> str:
        named, address = FROM_NAME.search(attributes), FROM_ADDRESS.search(attributes)
        if named:
            return named[1]
        return address[1] if address else "another session"
