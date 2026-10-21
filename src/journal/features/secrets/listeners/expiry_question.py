from datetime import datetime, timezone

from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.repositories.secrets import Secrets


class ExpiryQuestion(AgentListener[Ticked]):
    """A saved browser login that ran out asks the user to log in again, once for each time it runs out."""

    def __init__(self, secrets: Secrets, messages: Messages) -> None:
        self.secrets, self.messages = secrets, messages

    def handle(self, event: Ticked) -> None:
        time = datetime.now(timezone.utc)
        for secret in [s for s in self.secrets.active() if s.is_login_expired(time)]:
            self.messages.save(Message(author=Author.AGENT, text=f"Your login to {secret.title} has run out: log in again with the Log in button on the Secrets page.\n\nsecret {secret.id}"), Actor.system())
            self.secrets.save(secret.with_(questioned_at=time), Actor.system())
