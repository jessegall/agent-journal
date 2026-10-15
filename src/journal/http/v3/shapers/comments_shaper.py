from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row
from journal.models.author import Author
from journal.models.environment import Environment
from journal.models.message import Message
from journal.models.ref import Ref
from journal.repositories.links import Links
from journal.repositories.messages import Messages


TYPES = {"tasks": "todo", "docs": "doc", "plans": "plan", "reports": "report", "questions": "question", "facts": "fact", "rules": "rule", "reminders": "reminder", "messages": "message"}


class CommentsShaper(Shaper):
    """An agent's reply to a message was a comment on it in version 3, drawn under the message with the lines it answers quoted above its own words: the reply bar. A comment the user writes under a row is a message linked to that row, drawn under it."""

    type = "comment"

    def __init__(self, messages: Messages, links: Links) -> None:
        self.messages, self.links = messages, links

    def rows(self, environment: Environment) -> list[V3Row]:
        rows = self.messages.in_(environment.id)
        by_id = {m.id: m for m in rows}
        replies = [V3Row.of("comment", m, title=m.text[:80], brief=self.quoted(by_id.get(m.reply_to), m.text), refs=[f"message:{m.reply_to}"], seen=[AGENT])
                   for m in rows if m.reply_to and m.author == Author.AGENT]
        comments = [V3Row.of("comment", m, title=m.text[:80], brief=m.text, refs=[self.ref_of(target) for target in targets], seen=[USER])
                    for m in rows if m.author == Author.USER and (targets := self.links.targets(m, Messages.COMMENTS_ON))]
        return sorted(replies + comments, key=lambda row: row.n)

    @staticmethod
    def ref_of(target: Ref) -> str:
        """A link's target as the viewer names rows: tasks:12 is todo:12."""
        table, n = str(target).split(":")
        return f"{TYPES.get(table, table.rstrip('s'))}:{n}"

    @staticmethod
    def quoted(answered: Message | None, text: str) -> str:
        if answered is None or text.startswith(">"):
            return text
        passage = "\n".join(f"> {line}" for line in answered.text.strip().splitlines())
        return f"{passage}\n\n{text}"
