from typing import TypedDict

from engine.command.context import Context
from engine.library.library_share import Fields, LibraryShare
from engine.repository.repository import Repository
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_revisions import DocRevisions


class DocText(TypedDict):
    title: str
    abstract: str
    body: str


class DocLibraryShare(LibraryShare[Doc]):
    """A document is sent as its title, abstract and text. Whether it is closed stays with each journal, and a
    closed document goes on following. A version from the server always opens a revision of its own, so the
    text it replaces can be read again."""

    name = "doc"
    model = Doc

    def __init__(self, repository: Repository, revisions: DocRevisions) -> None:
        self.repository, self.revisions = repository, revisions

    def fields(self, row: Doc) -> Fields:
        return {"title": row.title, "abstract": row.abstract, "body": row.body}

    def arrive(self, fields: Fields, context: Context) -> Doc:
        doc = self.repository.save(Doc(creator_id=context.actor.id, **self.columns(fields)), context)
        self.revisions.record_standalone(doc, context)
        return doc

    def follow(self, row: Doc, fields: Fields, context: Context) -> Doc:
        doc = self.repository.update(row, context, **self.columns(fields))
        self.revisions.record_standalone(doc, context)
        return doc

    @staticmethod
    def columns(fields: Fields) -> DocText:
        return {"title": str(fields["title"]), "abstract": str(fields["abstract"]), "body": str(fields["body"])}
