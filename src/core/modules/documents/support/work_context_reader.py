import base64
import binascii
import hashlib
from dataclasses import replace

from core.base.caller.caller import Caller
from core.base.actor_type import ActorType
from core.base.query.conditions.among import Among
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.documents.commands.support.row_comments import RowComments
from core.modules.documents.conditions.work_context_messages import WorkContextMessages, WorkContextSeeds, WorkContextReferenceColumns
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.documents.support.work_context_message import WorkContextMessage, WorkContextReference
from core.modules.documents.support.work_context_page import WorkContextPage, WorkContextRequest, WorkContextText
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES, MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.work_sources import WorkSources
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.models.task import Task

CONTEXT_CHARACTERS = 8000
ANCESTRY_LENGTH = 20
CONTEXT_TYPES = (*PERSON_MESSAGE_TYPES, MessageType.AGENT)
SOURCE_TYPES = (LinkType.SUBJECT, LinkType.EDITED)


class WorkContextReader:
    """Reads one bounded conversation through existing resource links and message threads."""

    def __init__(self, queries: Queries, messages: MessageQuery, comments: RowComments,
                 plans: TaskPlans, sources: WorkSources) -> None:
        self.queries, self.messages, self.comments, self.plans, self.sources = queries, messages, comments, plans, sources

    def read(self, row: Task | Plan, caller: Caller, request: WorkContextRequest) -> WorkContextPage | WorkContextText:
        self.check(request)
        request = replace(request, page_size=min(request.page_size, 50))
        rows = self.related_rows(row)
        source = self.sources.for_work(caller)
        excluded = (source.message_id,) if source is not None and source.unavailable and source.message_id is not None else ()
        visible = self.visible(row.environment_id, excluded)
        source_queries = tuple(visible.matching(SubqueryMatch("id", self.source_links(root).select.column("source_id"))) for root in rows)
        source_selects = tuple(query.scoped(query.select).column("id") for query in source_queries)
        comment_selects = tuple(self.comments.query(root).filter(environment_id=row.environment_id, is_chat_visible=True)
                                .matching(Among("type", CONTEXT_TYPES)).matching(Among("id", excluded, negated=True)).select.column("id")
                                for root in rows)
        seeds = WorkContextSeeds((*source_selects, *comment_selects))
        primary = visible.matching(SubqueryMatch("id", WorkContextSeeds(source_selects))).with_text_segment(0, CONTEXT_CHARACTERS).ordered("created_at", "id").first()
        if primary is None:
            primary = visible.matching(SubqueryMatch("id", seeds)).with_text_segment(0, CONTEXT_CHARACTERS).ordered("created_at", "id").first()
        anchor = self.anchor(row, caller, primary)
        start = self.cursor_start(request.ancestor_cursor, anchor, row.environment_id)
        participants = {caller.actor.id, *(root.creator_id for root in rows)}
        if source is not None and source.selecting_actor_id is not None:
            participants.add(source.selecting_actor_id)
        participant_ids = tuple(sorted(participants)) if caller.actor.type is ActorType.AGENT else ()
        window = WorkContextMessages(seeds, row.environment_id, start, ANCESTRY_LENGTH, excluded, participant_ids)
        conversation = visible.matching(window)
        command = f"journal {row.cli_name} context {row.id}"
        if request.ancestor_cursor is not None:
            command += f" --ancestor-cursor {request.ancestor_cursor}"
        if request.message_id is not None:
            return self.text(row, conversation, request, command)
        total = conversation.count()
        picked = self.page_rows(conversation, primary if start == 0 else None, request)
        rendered = self.rendered(picked, primary, rows, command)
        more = visible.matching(replace(window, start=start + ANCESTRY_LENGTH)).exists()
        cursor = self.cursor(anchor, start + ANCESTRY_LENGTH) if more else None
        next_command = f"{command} --page {request.page + 1} --page-size {request.page_size}" if request.page * request.page_size < total else None
        ancestor_command = f"journal {row.cli_name} context {row.id} --ancestor-cursor {cursor} --page-size {request.page_size}" if cursor is not None else None
        return WorkContextPage(row.cli_name, row.id, rendered, request.page, request.page_size, total, start,
                               next_command, cursor, ancestor_command, (*self.unavailable(rows, visible), *self.references(rows)))

    def check(self, request: WorkContextRequest) -> None:
        if request.page < 1 or request.page_size < 1 or not 0 <= request.text_offset <= 9223372036854767800:
            raise Refusal("use a positive context page and page size and a nonnegative text offset")
        if request.page > 9223372036854775807 // min(request.page_size, 50):
            raise Refusal("this context page number is too large")
        if request.message_id is not None and not 0 < request.message_id <= 9223372036854775807:
            raise Refusal("name a positive message number")
        if request.message_id is None and request.text_offset:
            raise Refusal("a text offset needs --message")

    def related_rows(self, row: Task | Plan) -> tuple[Task | Plan, ...]:
        if not isinstance(row, Task):
            return (row,)
        plan = self.plans.find(row.id)
        return (row,) if plan is None else (row, plan)

    def visible(self, environment_id: int, excluded: tuple[int, ...]) -> MessageQuery:
        return self.messages.filter(environment_id=environment_id, is_chat_visible=True).matching(Among("type", CONTEXT_TYPES)).matching(Among("id", excluded, negated=True))

    def source_links(self, row: Task | Plan) -> Query[Link]:
        return self.queries.query(Link).filter(source_model="message", target_model=row.model_name, target_id=row.id).matching(Among("link_type", SOURCE_TYPES))

    def anchor(self, row: Task | Plan, caller: Caller, primary: Message | None) -> str:
        identity = "none" if primary is None else f"{primary.id}:{primary.creation_timestamp().text}"
        return hashlib.sha256(f"{row.model_name}:{row.id}:{row.environment_id}:{caller.actor.id}:{identity}".encode()).hexdigest()

    def cursor(self, anchor: str, start: int) -> str:
        return base64.urlsafe_b64encode(f"{anchor}:{start}".encode()).decode().rstrip("=")

    def cursor_start(self, token: str | None, anchor: str, environment_id: int) -> int:
        if token is None:
            return 0
        if len(token) > 160:
            raise Refusal("this ancestry cursor is invalid")
        try:
            identity, number = base64.b64decode(token + "=" * (-len(token) % 4), altchars=b"-_", validate=True).decode("ascii").split(":")
            start = int(number)
        except (ValueError, UnicodeError, binascii.Error) as error:
            raise Refusal("this ancestry cursor is invalid") from error
        if identity != anchor or start < ANCESTRY_LENGTH or start % ANCESTRY_LENGTH:
            raise Refusal("this ancestry cursor belongs to another context or source")
        if start > self.messages.filter(environment_id=environment_id).count():
            raise Refusal("this ancestry cursor is beyond the conversation")
        return start

    def page_rows(self, conversation: MessageQuery, primary: Message | None, request: WorkContextRequest) -> tuple[Message, ...]:
        pool = conversation.with_text_segment(0, CONTEXT_CHARACTERS).ordered("created_at", "id")
        reserved = ()
        offset = (request.page - 1) * request.page_size
        size = request.page_size
        if primary is not None:
            pool = pool.matching(Among("id", (primary.id,), negated=True))
            if request.page == 1:
                reserved = (primary,)
                size -= 1
            else:
                offset -= 1
        selected = tuple(pool.rows(pool.select.sliced(size, offset))) if size else ()
        return tuple(sorted((*reserved, *selected), key=lambda message: (message.creation_timestamp().text, message.id)))

    def rendered(self, messages: tuple[Message, ...], primary: Message | None,
                 roots: tuple[Task | Plan, ...], command: str) -> tuple[WorkContextMessage, ...]:
        actors = {actor.id: " ".join(actor.name.split()) for actor in self.queries.query(ActorRecord).matching(Among("id", tuple(message.creator_id for message in messages))).all_rows()}
        relations: dict[int, set[str]] = {message.id: set() for message in messages}
        for root in roots:
            links = self.queries.query(Link).filter(source_model="message", target_model=root.model_name, target_id=root.id)
            for link in links.matching(Among("source_id", tuple(relations))).matching(Among("link_type", (*SOURCE_TYPES, LinkType.COMMENT))).all_rows():
                relations[link.source_id].add(f"{link.link_type} {root.cli_name}:{root.id}")
        comments = self.queries.query(Link).filter(source_model="message", target_model="message", link_type=LinkType.COMMENT)
        for link in comments.matching(Among("source_id", tuple(relations))).all_rows():
            relations[link.source_id].add(f"comments_on message:{link.target_id}")
            if link.target_id in relations:
                relations[link.target_id].add(f"commented on by message:{link.source_id}")
        budget_order = sorted(messages, key=lambda message: primary is None or message.id != primary.id)
        rendered: dict[int, WorkContextMessage] = {}
        remaining = CONTEXT_CHARACTERS
        for message in budget_order:
            text = message.text[:remaining]
            remaining -= len(text)
            offset = len(text) if len(message.text) > len(text) else None
            next_command = f"{command} --message {message.id} --text-offset {offset}" if offset is not None else None
            if message.parent_id is not None:
                relations[message.id].add(f"reply message:{message.parent_id}")
            labels = tuple(sorted(relations[message.id])) or ("thread",)
            rendered[message.id] = WorkContextMessage(message.id, text, actors.get(message.creator_id, f"actor:{message.creator_id}"),
                message.creator_id, str(message.type), message.creation_timestamp().text, labels, offset, next_command)
        return tuple(rendered[message.id] for message in messages)

    def text(self, row: Task | Plan, conversation: MessageQuery, request: WorkContextRequest, command: str) -> WorkContextText:
        message = conversation.filter(id=request.message_id).with_text_segment(request.text_offset, CONTEXT_CHARACTERS).first()
        if message is None:
            raise Refusal("this message is not available in the requested context", "use its context page or ancestry continuation")
        text = message.text[:CONTEXT_CHARACTERS]
        offset = request.text_offset + len(text) if len(message.text) > len(text) else None
        next_command = f"{command} --message {message.id} --text-offset {offset}" if offset is not None else None
        return WorkContextText(row.cli_name, row.id, message.id, text, request.text_offset, offset, next_command)

    def unavailable(self, roots: tuple[Task | Plan, ...], visible: MessageQuery) -> tuple[WorkContextReference, ...]:
        references: dict[int, set[str]] = {}
        for root in roots:
            links = self.queries.query(Link).filter(source_model="message", target_model=root.model_name, target_id=root.id)
            missing = links.matching(Among("link_type", (*SOURCE_TYPES, LinkType.COMMENT))).matching(SubqueryMatch("source_id", visible.select.column("id"), negated=True)).limited(50)
            for link in missing:
                references.setdefault(link.source_id, set()).add(f"{link.link_type} {root.cli_name}:{root.id}")
        return tuple(WorkContextReference("message", number, "message unavailable", tuple(sorted(relations)), True)
                     for number, relations in sorted(references.items()))

    def references(self, roots: tuple[Task | Plan, ...]) -> tuple[WorkContextReference, ...]:
        references: dict[tuple[str, int], set[str]] = {}
        for root in roots:
            outgoing = self.queries.query(Link).filter(source_model=root.model_name, source_id=root.id).matching(Among("target_model", ("doc", "report")))
            incoming = self.queries.query(Link).filter(target_model=root.model_name, target_id=root.id).matching(Among("source_model", ("doc", "report")))
            for link in outgoing.matching(Among("link_type", (LinkType.SUBJECT, LinkType.REFERENCE))).limited(50):
                references.setdefault((link.target_model, link.target_id), set()).add(str(link.link_type))
            for link in incoming.matching(Among("link_type", (LinkType.SUBJECT, LinkType.REFERENCE))).limited(50):
                references.setdefault((link.source_model, link.source_id), set()).add(str(link.link_type))
            if isinstance(root, Plan) and root.document_id is not None:
                references.setdefault(("doc", root.document_id), set()).add("design")
        titles: dict[tuple[str, int], str] = {}
        for model in (Doc, Report):
            ids = tuple(number for name, number in references if name == model.model_name)
            query = self.queries.query(model).matching(Among("id", ids))
            query = query.with_select(query.select.column(WorkContextReferenceColumns.columns(query.table.columns)))
            titles.update({(model.model_name, row.id): " ".join(row.title.split()) for row in query.all_rows()})
        return tuple(WorkContextReference(model, number, titles.get((model, number), "reference unavailable"),
                     tuple(sorted(relations)), (model, number) not in titles) for (model, number), relations in sorted(references.items()))
