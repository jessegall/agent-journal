from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.support.rejection import Rejection
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.rows import Rows

COMMENTED = ("tasks", "plans", "docs", "reports", "facts", "rules", "reminders", "questions")


class CommentController(Controller[Message]):
    """A comment written under a row in the viewer is a message of the user's linked to the row as comments_on, drawn under it; it reaches the agent as any message does."""

    is_timeline = True

    def __init__(self, messages: Messages, links: Links, rows: Rows) -> None:
        self.repository, self.links, self.references = messages, links, rows

    def rows(self) -> list[Message]:
        enabled = self.repository.linked(Messages.COMMENT_LINK)
        return [m for m in self.repository.numbered(tuple(enabled)) if m.author == Author.USER or m.reply_target] if enabled else []

    def shown_page(self, rows: list[Message]) -> list[dict]:
        enabled = self.repository.linked(Messages.COMMENT_LINK)
        return [{**ModelFields.build(m), "on": [str(ref) for ref in enabled.get(m.row_id, [])]} for m in rows]

    def store(self, request: Request) -> Response:
        target = self.row(str(request.body.get("on", "")))
        reply_ref = request.body.get("reply_target")
        message = self.repository.save(Message(author=Author.USER, text=request.body.get("text", ""), reply_target=int(reply_ref) if reply_ref else None).arrived(), request.actor)
        self.links.save(Link(source=Ref.build(message), target=target, kind=Messages.COMMENT_LINK), request.actor)
        return Response.json(self.shown(message), 201)

    def row(self, matched: str) -> Ref:
        kind, _, id = matched.partition(":")
        if kind not in COMMENTED or not id.isdigit() or not self.references.is_row(Ref(kind, int(id))):
            raise Rejection(f"a comment is written under a task, a plan, a document, a report, a fact, a rule, a reminder or a question that is there, named as tasks:12, not {matched!r}")
        return Ref(kind, int(id))
