from core.base.registry.registry import Registry
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare
from tests.stories.core.support.fixtures import UserJoined


def doc_share(story):
    return story.container.get(Registry).library_shares["doc"].checked_class(DocLibraryShare)()


def test_the_registry_holds_the_document_share_the_documents_module_declares(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_rows(type(doc_share(story)) is DocLibraryShare, doc_share(story).model is Doc)


def test_the_document_share_names_the_fields_that_travel(new_story):
    story = new_story(fixture=UserJoined)
    doc = Doc(creator_id=story.user.id, title="Guide", abstract="How to", body="Read it")
    story.expect_rows(doc_share(story).fields(doc) == {"title": "Guide", "abstract": "How to", "body": "Read it"})
