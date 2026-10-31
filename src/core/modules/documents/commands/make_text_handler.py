from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.model.tables import Tables
from core.base.repository.repository import Repository
from core.modules.documents.commands.make_text import MakeText
from core.modules.documents.commands.support.new_text import NewText
from core.modules.documents.commands.support.subject_refs import SubjectRefs
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.link import Link
from core.modules.documents.support.doc_revisions import DocRevisions

SUBJECT_LINK_TYPE = "about"


class MakeTextHandler(Handler[MakeText, NewText]):
    """Saves a new document, with its first revision, or a new report, with a link to each row it is about."""

    command = MakeText

    def __init__(self, repository: Repository, revisions: DocRevisions, tables: Tables) -> None:
        self.repository, self.revisions, self.tables = repository, revisions, tables

    def handle(self, command: MakeText, context: Context) -> NewText:
        subject_refs = SubjectRefs.parsed(command.subjects)
        text_row = self.repository.save(command.text_model(environment_id=context.environment_id, creator_id=context.actor.id, title=command.title,
                                                     abstract=command.abstract, body=command.body), context)
        if isinstance(text_row, Doc):
            self.revisions.record(text_row, context)
        for ref in subject_refs:
            self.repository.save(Link(creator_id=context.actor.id, source=f"{self.tables.table(type(text_row)).name}:{text_row.id}", target=ref, link_type=SUBJECT_LINK_TYPE), context)
        return NewText(text_row, subject_refs)
