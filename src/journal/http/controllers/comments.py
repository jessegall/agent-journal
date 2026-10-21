from journal.http.controllers.controller import Controller
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.author import Author
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.support.refused import Refused
from journal.repositories.links import Links
from journal.repositories.messages import Messages

COMMENTED = ("tasks", "plans", "docs", "reports", "facts", "rules", "reminders", "questions")


class CommentController(Controller[Message]):
    """A comment written under a row in the viewer is a message of the user's linked to the row as comments_on, drawn under it; it reaches the agent as any message does."""

    timeline = True

    def __init__(self, messages: Messages, links: Links) -> None:
        self.repository, self.links = messages, links

    def rows(self) -> list[Message]:
        on = self.repository.linked(Messages.COMMENT_LINK)
        return [m for m in self.repository.numbered(tuple(on)) if m.author == Author.USER or m.reply_to] if on else []

    def shown_page(self, rows: list[Message]) -> list[dict]:
        on = self.repository.linked(Messages.COMMENT_LINK)
        return [{**ModelFields.of(m), "on": [str(ref) for ref in on.get(m.id, [])]} for m in rows]

    def store(self, request: Request) -> Response:
        target = self.row(str(request.body.get("on", "")))
        reply_to = request.body.get("reply_to")
        message = self.repository.save(Message(author=Author.USER, text=request.body.get("text", ""), reply_to=int(reply_to) if reply_to else None).arrived(), request.actor)
        self.links.save(Link(source=Ref.to(message), target=target, kind=Messages.COMMENT_LINK), request.actor)
        return Response.json(self.shown(message), 201)

    def row(self, named: str) -> Ref:
        kind, _, id = named.partition(":")
        if kind not in COMMENTED or not id.isdigit() or not self.links.is_row(Ref(kind, int(id))):
            raise Refused(f"a comment is written under a task, a plan, a document, a report, a fact, a rule, a reminder or a question that is there, named as tasks:12, not {named!r}")
        return Ref(kind, int(id))
