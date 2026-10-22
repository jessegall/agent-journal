from datetime import datetime, timezone

from journal.db.query import Query
from journal.features.messages.support.mentions import Mentions
from journal.http.attachments.attachments import Attachments
from journal.http.controllers.controller import Controller
from journal.http.counts import Counts
from journal.http.row_list import RowList
from journal.http.listing import Listing
from journal.http.support.model_fields import ModelFields
from journal.http.support.request import Request
from journal.support.response import Response
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.repositories.reactions import Reactions
from journal.chat.docking import Docking

class MessageController(Controller[Message]):
    """The chat: the user's, the agent's and the journal's messages by id, read a page at a time from the database; the user's are sent from here, as the user."""

    is_timeline = True

    repository: Messages

    def __init__(self, messages: Messages, reactions: Reactions, attachments: Attachments, docking: Docking, agents: Agents) -> None:
        self.agents = agents
        self.repository, self.reactions, self.attachments, self.docking = messages, reactions, attachments, docking

    def listed(self, listing: Listing) -> RowList:
        page = listing.listed(self.question_list(listing), lambda m: True, timeline=True)
        unread = self.repository.unviewed()
        counts = Counts(all=self.repository.counted(self.repository.main_chat()), open=len(self.open_ids()) + unread, unread=unread)
        return RowList(rows=self.shown_page(page["rows"]), is_last_page=page["is_last_page"], counts=counts)

    def question_list(self, listing: Listing) -> list[Message]:
        if listing.ids:
            return self.repository.numbered(listing.ids)
        return self.chat_rows(self.repository.main_chat(), listing)

    def chat_rows(self, chat: Query, listing: Listing) -> list[Message]:
        if listing.cutoff_at:
            return self.repository.changes(chat, datetime.fromtimestamp(listing.cutoff_at, timezone.utc))
        return self.repository.window(chat, listing.limit + 1, listing.upper_id, listing.lower_id)

    def agent_chat(self, request: Request) -> Response:
        listing = Listing.query_listing(request.query)
        page = listing.listed(self.chat_rows(self.repository.agent_chat(request.params["session"]), listing), lambda m: True, timeline=True)
        return Response.json(RowList(rows=self.shown_page(page["rows"]), is_last_page=page["is_last_page"], counts=Counts(all=len(page["rows"]), open=0, unread=0)))

    def open_ids(self) -> set[int]:
        return {m.row_id for m in self.repository.unanswered()} | {m.row_id for m in self.repository.unread()}

    def shown_page(self, rows: list[Message]) -> list[dict]:
        filed, commented, unanswered = self.repository.linked(Messages.SUBJECT_LINK), self.repository.linked(Messages.COMMENT_LINK), {m.id for m in self.repository.unanswered()}
        return [{**ModelFields.build(m), "answered": m.id not in unanswered, "filed": [ref.id for ref in filed.get(m.row_id, [])],
                 "comments_on": [str(ref) for ref in commented.get(m.row_id, [])], "mentions": [str(ref) for ref in Mentions.found(m.text)]} for m in rows]

    def store(self, request: Request) -> Response:
        key = request.body.get("idempotency", "")
        prior_items = self.repository.sent_with(key) if key else []
        if prior_items:
            return Response.json(self.shown(prior_items[0]), 201)
        message = Message(author=Author.USER, text=request.body.get("text", ""), reply_target=request.body.get("reply_target"), idempotency=key).arrived()
        return Response.json(self.shown(self.repository.save(message, request.actor)), 201)

    def read(self, request: Request) -> Response:
        return Response.json(self.shown(self.repository.read(self.repository.find(request.number("id")), request.actor, self._tool_use())))

    def read_all(self, request: Request) -> Response:
        if "ids" not in request.body:
            return Response.json({})
        for id in request.body["ids"]:
            self.repository.read(self.repository.find(int(id)), request.actor, self._tool_use())
        return Response.json({})

    def reply(self, request: Request) -> Response:
        answered = self.repository.find(request.number("id"))
        message = Message(environment_id=answered.environment_id, author=Author.USER, text=request.body.get("text", ""), reply_target=answered.id).arrived()
        return Response.json(self.shown(self.repository.save(message, request.actor)), 201)

    def react(self, request: Request) -> Response:
        produced = self.reactions.toggle(self.repository.find(request.number("id")), request.body.get("face", ""), Author.USER, request.actor)
        return Response.json(produced or {})

    def press(self, request: Request) -> Response:
        message = self.repository.find(request.number("id"))
        pressed = [str(label) for label in request.body.get("pressed", [])]
        return Response.json(self.shown(self.repository.save(message.with_(data={**message.data, "pressed": pressed}), request.actor)))

    def dock(self, request: Request) -> Response:
        return Response.json(self.shown(self.docking.pin_message(self.repository.find(request.number("id")), request.actor)))

    def undock(self, request: Request) -> Response:
        return Response.json(self.shown(self.docking.release(self.repository.find(request.number("id")), request.actor)))

    def attach(self, request: Request) -> Response:
        message = self.repository.find(request.number("id"))
        names = tuple(self.attachments.store(Message.table(), message.row_id, name, data) for name, data in request.files.items())
        saved = self.repository.save(message.with_(files=(*message.files, *names)), request.actor) if names else message
        return Response.json(self.shown(saved))

    def _tool_use(self) -> int:
        agent = self.agents.current()
        return agent.tool_uses if agent else 0
