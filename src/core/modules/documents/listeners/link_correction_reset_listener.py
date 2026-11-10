from engine.event.created import Created
from engine.event.updated import Updated
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.documents.models.link_correction import LinkCorrection
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin
from core.modules.messages.models.message_work_source import MessageWorkSource


class LinkCorrectionResetListener(SaveListener[Created[MessageWorkSource] | Updated[MessageWorkSource]]):
    """Allows attribution again when an agent explicitly selects the request."""

    name = "documents.reset-link-corrections"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Created[MessageWorkSource] | Updated[MessageWorkSource], context: Context) -> None:
        selected = event.row
        if selected.message_id is None or selected.origin not in (WorkSourceOrigin.EXPLICIT, WorkSourceOrigin.REPLY):
            return
        if event.old_row is not None and selected.selection_number == event.old_row.selection_number:
            return
        corrections = self.queries.query(LinkCorrection).filter(source_model="message", source_id=selected.message_id).all_rows()
        for correction in corrections:
            self.repository.delete_stored(correction, context)
