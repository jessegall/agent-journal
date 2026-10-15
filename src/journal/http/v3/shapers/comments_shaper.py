from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, V3Row
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.message import Message
from journal.repositories.messages import Messages


class CommentsShaper(Shaper):
    """An agent's reply to a message was a comment on it in version 3, drawn under the message with the lines it answers quoted above its own words: the reply bar."""

    type = "comment"

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def rows(self, environment: Environment) -> list[V3Row]:
        rows = self.messages.in_(environment.id)
        by_id = {m.id: m for m in rows}
        return [V3Row.of("comment", m, title=m.text[:80], brief=self.quoted(by_id.get(m.reply_to), m.text), refs=[f"message:{m.reply_to}"], seen=[AGENT])
                for m in rows if m.reply_to and m.author == Author.AGENT]

    @staticmethod
    def quoted(answered: Message | None, text: str) -> str:
        if answered is None or text.startswith(">"):
            return text
        passage = "\n".join(f"> {line}" for line in answered.text.strip().splitlines())
        return f"{passage}\n\n{text}"
