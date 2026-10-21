from datetime import datetime, timezone

from journal.support.caller import LOCAL_USER
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import TYPED, Message
from journal.repositories.messages import Messages
from journal.support.typed_lines import TypedLines


class RecordTypedPrompt(AgentListener[PromptSubmitted]):
    """What the user types in the agent's terminal reaches the chat as their message, already read by the agent it was typed to; the journal's own lines stay out."""

    def __init__(self, messages: Messages, lines: TypedLines) -> None:
        self.messages, self.lines = messages, lines

    def handle(self, event: PromptSubmitted) -> None:
        if not event.by_user or not event.prompt.strip() or self.lines.carries(event.environment_id, event.prompt):
            return
        self.messages.save(Message(author=Author.USER, text=event.prompt.strip(), read_at=datetime.now(timezone.utc), data={"kind": TYPED}), Actor.user(LOCAL_USER))
