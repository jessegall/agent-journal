from engine.enums.actor_type import ActorType
from core.base.change.created import Created
from core.base.change.updated import Updated
from engine.command.context import Context
from engine.command.edit_command import EditCommand
from engine.command.make_command import MakeCommand
from core.base.library.library_lookup import LibraryLookup
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.documents.commands.edit_text.edit_text import EditText
from core.modules.documents.commands.make_text.make_text import MakeText
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.documents.support.row_link_writer import RowLinkWriter
from core.modules.messages.models.message import Message
from core.modules.messages.support.work_sources import WorkSources
from core.modules.plans.models.plan import Plan
from core.modules.tasks.models.task import Task

TEXT_ROW_FIELDS = ("title", "abstract", "body")
TEXT_FIELDS = {Task: ("title", "brief", "outcome"), Plan: ("title", "brief"), Doc: TEXT_ROW_FIELDS, Report: TEXT_ROW_FIELDS}


class WorkSourceLinkListener(SaveListener[Created[Task] | Updated[Task] | Created[Plan] | Updated[Plan] |
                                          Created[Doc] | Updated[Doc] | Created[Report] | Updated[Report]]):
    """Links direct resource writes to the selected request in the resource's save transaction."""

    name = "documents.work-source-links"

    def __init__(self, sources: WorkSources, links: RowLinkWriter, library: LibraryLookup) -> None:
        self.sources, self.links, self.library = sources, links, library

    def handle(self, event: Created[Task] | Updated[Task] | Created[Plan] | Updated[Plan] |
               Created[Doc] | Updated[Doc] | Created[Report] | Updated[Report], context: Context) -> None:
        row = event.row
        if context.actor.type is not ActorType.AGENT or not self.is_direct(row, context):
            return
        if event.old_row is not None and not any(getattr(row, field) != getattr(event.old_row, field) for field in TEXT_FIELDS[type(row)]):
            return
        if self.library.is_copy(row.model_name, row.id):
            return
        selected = self.sources.work_source(context)
        if selected is None or selected.message_id is None or not self.sources.is_available(selected, context):
            return
        relations = [LinkType.SUBJECT] if isinstance(event, Created) else [LinkType.SUBJECT, LinkType.EDITED]
        self.links.save_automatic(tuple(Link(creator_id=context.actor.id, source_model=Message.model_name, source_id=selected.message_id,
                                        target_model=row.model_name, target_id=row.id, link_type=relation) for relation in relations), context)
        self.sources.use_copy(selected, context)

    def is_direct(self, row: Model, context: Context) -> bool:
        if issubclass(type(context.command), (MakeCommand, EditCommand)):
            return context.command.model() is type(row)
        if isinstance(context.command, (MakeText, EditText)):
            return context.command.text_model is type(row)
        return False
