from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_link_writer import RowLinkWriter
from core.modules.transcriptions.commands.add_transcription_link.add_transcription_link import AddTranscriptionLink
from core.modules.transcriptions.models.transcription import Transcription


class AddTranscriptionLinkHandler(Handler[AddTranscriptionLink, Link]):
    """Saves the link from a transcription to a row made from it."""

    command = AddTranscriptionLink

    def __init__(self, queries: Queries, links: RowLinkWriter) -> None:
        self.queries, self.links = queries, links

    def handle(self, command: AddTranscriptionLink, context: Context) -> Link:
        transcription = self.queries.query(Transcription).find(command.transcription_id)
        return self.links.save(Link(creator_id=context.actor.id, source_model=transcription.model_name, source_id=transcription.id, target_model=command.target_model,
                                         target_id=command.target_id, link_type=LinkType.SUBJECT), context)
