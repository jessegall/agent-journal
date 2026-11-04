from core.base.library.library_share import Fields, LibraryShare
from core.modules.documents.models.doc import Doc


class DocLibraryShare(LibraryShare[Doc]):
    """A document travels as its title, abstract and text. Whether it is closed stays with each journal."""

    name = "doc"
    model = Doc

    def fields(self, row: Doc) -> Fields:
        return {"title": row.title, "abstract": row.abstract, "body": row.body}
