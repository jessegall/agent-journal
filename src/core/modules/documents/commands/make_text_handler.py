from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.documents.commands.make_text import MakeText
from core.modules.documents.commands.support.new_text import NewText
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.doc_revisions import DocRevisions
from core.modules.documents.support.row_refs import RowRefs


class MakeTextHandler(Handler[MakeText, NewText]):
    """Saves a new document, with its first revision, or a new report, with a link to each row it is about."""

    command = MakeText

    def __init__(self, repository: Repository, revisions: DocRevisions, row_refs: RowRefs) -> None:
        self.repository, self.revisions, self.row_refs = repository, revisions, row_refs

    def handle(self, command: MakeText, context: Context) -> NewText:
        subject_refs = [self.row_refs.parsed(word) for text in command.subjects for word in text.replace(",", " ").split()]
        text_row = self.repository.save(command.text_model(environment_id=context.environment_id, creator_id=context.actor.id, title=command.title,
                                                     abstract=command.abstract, body=command.body), context)
        if isinstance(text_row, Doc):
            self.revisions.record(text_row, context)
        for ref in subject_refs:
            self.repository.save(Link(creator_id=context.actor.id, source_model=text_row.model_name, source_id=text_row.id, target_model=ref.model, target_id=ref.row_id,
                                      link_type=LinkType.SUBJECT), context)
        return NewText(text_row, tuple(ref.text for ref in subject_refs))
