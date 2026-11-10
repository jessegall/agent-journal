import base64
import binascii
import hashlib
import shlex
from collections.abc import Sequence
from dataclasses import replace

from engine.caller.caller import Caller
from engine.enums.actor_type import ActorType
from engine.query.conditions.among import Among
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.queries import Queries
from engine.query.query import Query
from engine.errors.refusal import Refusal
from core.base.scope.scopes import Scopes
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.documents.support.row_comments import RowComments
from core.modules.documents.conditions.work_context_messages import WorkContextMessages
from core.modules.documents.conditions.work_context_seeds import WorkContextSeeds
from core.modules.documents.conditions.work_context_reference_columns import WorkContextReferenceColumns
from core.modules.documents.conditions.context_message_type import ContextMessageType
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.documents.support.work_context_message import WorkContextMessage
from core.modules.documents.support.work_context_reference import WorkContextReference
from core.modules.documents.support.work_context_attachment import WorkContextAttachment
from core.modules.documents.support.work_context_page import WorkContextPage
from core.modules.documents.support.work_context_request import WorkContextRequest
from core.modules.documents.support.work_context_text import WorkContextText
from core.modules.documents.support.work_context_attachment_page import WorkContextAttachmentPage
from core.modules.documents.support.work_context_file import WorkContextFile
from core.modules.documents.support.work_context_file_content import WorkContextFileContent
from core.modules.documents.support.work_context_order import WorkContextOrder
from core.modules.messages.models.enums.message_type import MessageType, PERSON_MESSAGE_TYPES
from core.modules.messages.support.assigned_work_sources import AssignedWorkSources
from core.modules.messages.support.work_source_copy import WorkSourceCopy
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.work_sources import WorkSources
from core.modules.messages.support.message_files import MessageFiles
from core.modules.messages.support.message_captions import MessageCaptions
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.plans.support.plan_approval import PlanApproval
from core.modules.tasks.models.task import Task

CONTEXT_CHARACTERS = 8000
ANCESTRY_MESSAGES = 20
SOURCE_TYPES = (LinkType.SUBJECT, LinkType.EDITED)
PAGE_ATTACHMENT_FILES = 5
CAPTION_CHARACTERS = 512
PAGE_ATTACHMENT_CHARACTERS = 2000


class WorkContextReader:
    """Reads one bounded conversation through existing resource links and message threads."""

    def __init__(self, queries: Queries, messages: MessageQuery, comments: RowComments,
                 plans: TaskPlans, sources: WorkSources, files: MessageFiles, assignments: AssignedWorkSources, scopes: Scopes) -> None:
        self.queries, self.messages, self.comments, self.plans, self.sources = queries, messages, comments, plans, sources
        self.files = files
        self.assignments = assignments
        self.scopes = scopes

    def overview(self, task: Task, caller: Caller) -> WorkContextPage:
        page = self.read(task, caller, WorkContextRequest(order=WorkContextOrder.NEWEST))
        assert isinstance(page, WorkContextPage)
        return page

    def read(self, row: Task | Plan, caller: Caller, request: WorkContextRequest) -> WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile:
        with self.scopes.row_scope(row):
            return self.read_scoped(row, caller, request)

    def read_scoped(self, row: Task | Plan, caller: Caller, request: WorkContextRequest) -> WorkContextPage | WorkContextText | WorkContextAttachmentPage | WorkContextFile:
        self.check(request)
        request = replace(request, page_size=min(request.page_size, 50))
        rows = self.related_rows(row)
        source = self.sources.work_source(caller)
        excluded = (source.message_id,) if source is not None and source.unavailable and source.message_id is not None else ()
        visible = self.visible(excluded)
        assigned = self.assignments.task_source(row.id, caller) if isinstance(row, Task) and caller.actor.type is ActorType.AGENT else None
        assignment_queries: list[MessageQuery] = []
        assigned_message_id = self.usable_message_id(assigned, row)
        if assigned_message_id is not None:
            assignment_queries = [visible.filter(id=assigned_message_id).matching(Among("type", PERSON_MESSAGE_TYPES))]
        source_queries = tuple(visible.matching(SubqueryMatch("id", self.source_links(root).select.column("source_id"))) for root in rows)
        source_queries = (*assignment_queries, *source_queries)
        source_selects = tuple(query.scoped(query.select).column("id") for query in source_queries)
        comment_selects = tuple(self.comments.query(root).matching(SubqueryMatch("id", visible.scoped(visible.select).column("id"))).select.column("id")
                                for root in rows)
        seeds = WorkContextSeeds((*source_selects, *comment_selects))
        primary = assignment_queries[0].with_text_segment(0, CONTEXT_CHARACTERS).first() if assignment_queries else None
        if primary is None:
            primary = visible.matching(SubqueryMatch("id", WorkContextSeeds(source_selects))).with_text_segment(0, CONTEXT_CHARACTERS).ordered("created_at", "id").first()
        if primary is None:
            primary = visible.matching(SubqueryMatch("id", seeds)).with_text_segment(0, CONTEXT_CHARACTERS).ordered("created_at", "id").first()
        anchor = self.anchor(row, caller, primary)
        start = self.cursor_start(request.ancestor_cursor, anchor)
        participants = {caller.actor.id, *(root.creator_id for root in rows)}
        if source is not None and source.selecting_actor_id is not None:
            participants.add(source.selecting_actor_id)
        participant_ids = tuple(sorted(participants)) if caller.actor.type is ActorType.AGENT else ()
        window = WorkContextMessages(seeds, row.environment_id, start, ANCESTRY_MESSAGES, excluded, participant_ids)
        conversation = visible.matching(window)
        command = f"journal {row.cli_name} context {row.id}{request.order.command()}"
        if request.ancestor_cursor is not None:
            command += f" --ancestor-cursor {request.ancestor_cursor}"
        if request.message_id is not None:
            return self.message_read(row, conversation, request, command)
        total = conversation.count()
        page_messages = self.page_rows(conversation, primary if start == 0 else None, request)
        rendered = self.rendered(page_messages, primary, rows, command)
        has_older_messages = visible.matching(replace(window, start=start + ANCESTRY_MESSAGES)).exists()
        cursor = self.cursor(anchor, start + ANCESTRY_MESSAGES) if has_older_messages else None
        next_command = f"{command} --page {request.page + 1} --page-size {request.page_size}" if request.page * request.page_size < total else None
        ancestor_command = f"journal {row.cli_name} context {row.id}{request.order.command()} --ancestor-cursor {cursor} --page-size {request.page_size}" if cursor is not None else None
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
        if (request.attachment is not None or request.attachment_page is not None) and request.message_id is None:
            raise Refusal("an attachment read needs --message in this context")
        if request.attachment_page is not None and request.attachment_page < 1:
            raise Refusal("use a positive attachment page")
        if (request.attachment is not None or request.attachment_page is not None) and request.text_offset:
            raise Refusal("read message text and attachments separately")

    def related_rows(self, row: Task | Plan) -> tuple[Task | Plan, ...]:
        if not isinstance(row, Task):
            return (row,)
        plan = self.plans.find(row.id)
        return (row,) if plan is None else (row, plan)

    @staticmethod
    def usable_message_id(assigned: WorkSourceCopy | None, row: Task | Plan) -> int | None:
        if assigned is None or assigned.environment_id != row.environment_id or assigned.unavailable:
            return None
        return assigned.message_id

    def visible(self, excluded: Sequence[int]) -> MessageQuery:
        users = self.queries.query(ActorRecord).filter(type=ActorType.USER).select.column("id")
        return self.messages.filter(is_chat_visible=True).matching(ContextMessageType(users)).matching(Among("id", excluded, negated=True))

    def source_links(self, row: Task | Plan) -> Query[Link]:
        return self.queries.query(Link).filter(source_model="message", target_model=row.model_name, target_id=row.id).matching(Among("link_type", SOURCE_TYPES))

    def anchor(self, row: Task | Plan, caller: Caller, primary: Message | None) -> str:
        identity = "none" if primary is None else f"{primary.id}:{primary.creation_timestamp().text}"
        return hashlib.sha256(f"{row.model_name}:{row.id}:{row.environment_id}:{caller.actor.id}:{identity}".encode()).hexdigest()

    def cursor(self, anchor: str, start: int) -> str:
        return base64.urlsafe_b64encode(f"{anchor}:{start}".encode()).decode().rstrip("=")

    def cursor_start(self, token: str | None, anchor: str) -> int:
        if token is None:
            return 0
        if len(token) > 160:
            raise Refusal("this ancestry cursor is invalid")
        try:
            identity, number = base64.b64decode(token + "=" * (-len(token) % 4), altchars=b"-_", validate=True).decode("ascii").split(":")
            start = int(number)
        except (ValueError, UnicodeError, binascii.Error) as error:
            raise Refusal("this ancestry cursor is invalid") from error
        if identity != anchor or start < ANCESTRY_MESSAGES or start % ANCESTRY_MESSAGES:
            raise Refusal("this ancestry cursor belongs to another context or source")
        if start > self.messages.count():
            raise Refusal("this ancestry cursor is beyond the conversation")
        return start

    def page_rows(self, conversation: MessageQuery, primary: Message | None, request: WorkContextRequest) -> tuple[Message, ...]:
        pool = conversation.with_text_segment(0, CONTEXT_CHARACTERS)
        pool = pool.descending("created_at", "id") if request.order is WorkContextOrder.NEWEST else pool.ordered("created_at", "id")
        reserved: tuple[Message, ...] = ()
        offset = (request.page - 1) * request.page_size
        size = request.page_size
        if primary is not None:
            anchors: tuple[Message, ...] = (primary,)
            if request.order is WorkContextOrder.NEWEST:
                original = conversation.with_text_segment(0, CONTEXT_CHARACTERS).ordered("created_at", "id").first()
                if original is not None and original.id != primary.id and size > 1:
                    anchors = (primary, original)
            pool = pool.matching(Among("id", tuple(message.id for message in anchors), negated=True))
            if request.page == 1:
                reserved = anchors
                size -= len(anchors)
            else:
                offset -= len(anchors)
        selected = tuple(pool.rows(pool.select.sliced(size, offset))) if size else ()
        return tuple(sorted((*reserved, *selected), key=lambda message: (message.creation_timestamp().text, message.id)))

    def rendered(self, messages: tuple[Message, ...], primary: Message | None,
                 roots: tuple[Task | Plan, ...], command: str) -> tuple[WorkContextMessage, ...]:
        actor_ids = tuple({number for message in messages for number in (message.creator_id, message.session_agent_id) if number is not None})
        actors = {actor.id: actor for actor in self.queries.query(ActorRecord).matching(Among("id", actor_ids)).all_rows()}
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
        attachments: dict[int, tuple[WorkContextAttachment, ...]] = {}
        attachment_budget = PAGE_ATTACHMENT_CHARACTERS
        for message in budget_order:
            preview = self.attachment_previews(message, command, 1, attachment_budget)
            attachments[message.id] = preview
            attachment_budget -= sum(len(file.name) + len(file.caption) for file in preview)
        rendered: dict[int, WorkContextMessage] = {}
        remaining = CONTEXT_CHARACTERS - (PAGE_ATTACHMENT_CHARACTERS - attachment_budget)
        for message in budget_order:
            is_journal_record = message.type is MessageType.JOURNAL
            text = "" if is_journal_record else message.text[:remaining]
            remaining -= len(text)
            offset = len(text) if not is_journal_record and len(message.text) > len(text) else None
            next_command = f"{command} --message {message.id} --text-offset {offset}" if offset is not None else None
            if is_journal_record:
                next_command = f"journal message show {message.id}"
            if message.parent_id is not None:
                relations[message.id].add(f"reply message:{message.parent_id}")
            labels = tuple(sorted(relations[message.id])) or tuple(["thread"])
            actor_id = message.session_agent_id if message.type is MessageType.AGENT else message.creator_id
            author = self.author(message, actors.get(actor_id) if actor_id is not None else None)
            rendered[message.id] = WorkContextMessage(message.id, text, author, None if is_journal_record else actor_id,
                str(message.type), message.creation_timestamp().text, labels, offset, next_command,
                attachments[message.id], len(message.files), self.attachment_next(message, attachments[message.id], command, 1), is_journal_record)
        return tuple(rendered[message.id] for message in messages)

    def message_read(self, row: Task | Plan, conversation: MessageQuery, request: WorkContextRequest, command: str) -> WorkContextText | WorkContextAttachmentPage | WorkContextFile:
        message = conversation.filter(id=request.message_id).with_text_segment(request.text_offset, CONTEXT_CHARACTERS).first()
        if message is None:
            raise Refusal("this message is not available in the requested context", "use its context page or ancestry continuation")
        if message.type is MessageType.JOURNAL:
            raise Refusal("this journal record is a reference, not a person request", f"journal message show {message.id}")
        if request.attachment is not None:
            data = self.files.read_attached(message, request.attachment)
            caption = MessageCaptions.decoded(message).get(request.attachment, "")
            return WorkContextFile(row.cli_name, row.id, message.id,
                                   WorkContextFileContent(request.attachment, base64.b64encode(data).decode(), caption))
        if request.attachment_page is not None:
            preview = self.attachment_previews(message, command, request.attachment_page, CONTEXT_CHARACTERS)
            return WorkContextAttachmentPage(row.cli_name, row.id, message.id, preview, request.attachment_page,
                                              len(message.files), self.attachment_next(message, preview, command, request.attachment_page))
        preview = self.attachment_previews(message, command, 1, PAGE_ATTACHMENT_CHARACTERS)
        budget = CONTEXT_CHARACTERS - sum(len(file.name) + len(file.caption) for file in preview)
        text = message.text[:budget]
        offset = request.text_offset + len(text) if len(message.text) > len(text) else None
        next_command = f"{command} --message {message.id} --text-offset {offset}" if offset is not None else None
        actor_id = message.session_agent_id if message.type is MessageType.AGENT else message.creator_id
        actor = self.queries.query(ActorRecord).filter(id=actor_id).first() if actor_id is not None else None
        return WorkContextText(row.cli_name, row.id, message.id, text, request.text_offset, offset, next_command,
                               self.author(message, actor), str(message.type), preview, len(message.files), self.attachment_next(message, preview, command, 1))

    def author(self, message: Message, actor: ActorRecord | None) -> str:
        if message.type is MessageType.JOURNAL:
            return "Journal"
        by_agent = message.type is MessageType.AGENT
        if actor is None or actor.type is not (ActorType.AGENT if by_agent else ActorType.USER):
            return "Agent (identity unavailable)" if by_agent else "Person (identity unavailable)"
        name = " ".join(actor.name.split())
        return f"Agent {name}" if by_agent else name

    def attachment_previews(self, message: Message, command: str, page: int, budget: int) -> tuple[WorkContextAttachment, ...]:
        if message.type is MessageType.JOURNAL:
            return ()
        captions = MessageCaptions.decoded(message)
        names = message.files[(page - 1) * PAGE_ATTACHMENT_FILES:page * PAGE_ATTACHMENT_FILES]
        previews: list[WorkContextAttachment] = []
        for name in names:
            if len(name) > budget:
                break
            budget -= len(name)
            caption = captions.get(name, "")
            shown = caption[:min(budget, CAPTION_CHARACTERS)]
            budget -= len(shown)
            previews.append(WorkContextAttachment(name, shown,
                            f"{command} --message {message.id} --attachment {shlex.quote(name)}", len(shown) < len(caption)))
        return tuple(previews)

    def attachment_next(self, message: Message, preview: tuple[WorkContextAttachment, ...], command: str, page: int) -> str | None:
        start = (page - 1) * PAGE_ATTACHMENT_FILES
        if start + len(preview) >= len(message.files):
            return None
        next_page = page + 1 if len(preview) == PAGE_ATTACHMENT_FILES else page
        return f"{command} --message {message.id} --attachment-page {next_page}"

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
            if isinstance(root, Plan):
                approval = PlanApproval.message_id(root)
                if approval is not None:
                    references.setdefault(("message", approval), set()).add("plan approval")
            outgoing = self.queries.query(Link).filter(source_model=root.model_name, source_id=root.id).matching(Among("target_model", ("doc", "report")))
            incoming = self.queries.query(Link).filter(target_model=root.model_name, target_id=root.id).matching(Among("source_model", ("doc", "report")))
            for link in outgoing.matching(Among("link_type", (LinkType.SUBJECT, LinkType.REFERENCE))).limited(50):
                references.setdefault((link.target_model, link.target_id), set()).add(str(link.link_type))
            for link in incoming.matching(Among("link_type", (LinkType.SUBJECT, LinkType.REFERENCE))).limited(50):
                references.setdefault((link.source_model, link.source_id), set()).add(str(link.link_type))
            if isinstance(root, Plan) and root.document_id is not None:
                references.setdefault(("doc", root.document_id), set()).add("design")
        titles: dict[tuple[str, int], str] = {}
        for root in roots:
            if not isinstance(root, Plan):
                continue
            approval = PlanApproval.message_id(root)
            if approval is not None and self.visible(()).filter(id=approval).exists():
                titles[("message", approval)] = "Plan approval"
        for model in (Doc, Report):
            ids = tuple(number for name, number in references if name == model.model_name)
            query = self.queries.query(model).matching(Among("id", ids))
            query = query.with_select(query.select.column(WorkContextReferenceColumns.columns(query.table.columns)))
            titles.update({(model.model_name, row.id): " ".join(row.title.split()) for row in query.all_rows()})
        return tuple(WorkContextReference(model, number, titles.get((model, number), "reference unavailable"),
                     tuple(sorted(relations)), (model, number) not in titles) for (model, number), relations in sorted(references.items()))
