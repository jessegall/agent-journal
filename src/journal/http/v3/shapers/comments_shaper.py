from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, V3Row
from journal.models.author import Author
from journal.models.environment import Environment
from journal.repositories.messages import Messages


class CommentsShaper(Shaper):
    """An agent's reply to a message was a comment on it in version 3, so the chat shows it under the message it answers."""

    type = "comment"

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of("comment", m, title=m.text[:80], brief=m.text, refs=[f"message:{m.reply_to}"], seen=[AGENT])
                for m in self.messages.in_(environment.id) if m.reply_to and m.author == Author.AGENT]
