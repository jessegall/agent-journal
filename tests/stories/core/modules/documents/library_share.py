from engine.command.context import Context
from core.base.registry.registry import Registry
from core.modules.documents.commands.edit_text.edit_text import EditText
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare
from tests.stories.core.modules.documents.docs import doc_story
from tests.stories.core.support.fixtures import UserJoined


def doc_share(story):
    return story.container.get(story.container.get(Registry).library_shares["doc"].checked_class(DocLibraryShare))


def team_context(story):
    return Context(story.user, story.clock.timestamp(), EditText(Doc, 1, None, None))


def team_version(title, body):
    return {"title": title, "abstract": "From the team", "body": body}


def test_the_registry_holds_the_document_share_the_documents_module_declares(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_rows(type(doc_share(story)) is DocLibraryShare, doc_share(story).model is Doc)


def test_the_document_share_names_the_fields_that_travel(new_story):
    story = new_story(fixture=UserJoined)
    doc = Doc(creator_id=story.user.id, title="Guide", abstract="How to", body="Read it")
    story.expect_rows(doc_share(story).fields(doc) == {"title": "Guide", "abstract": "How to", "body": "Read it"})


def test_arriving_makes_a_document_with_the_title_abstract_and_text_from_the_server_and_one_revision(new_story):
    story = new_story(fixture=UserJoined)
    doc = doc_share(story).arrive(team_version("Team guide", "Read it"), team_context(story))
    story.expect_rows(doc.id == 1, doc.title == "Team guide", doc.abstract == "From the team", doc.body == "Read it", doc.creator_id == story.user.id)
    story.expect_text("doc revision 1 1", "doc 1, revision 1 of 1: Team guide", "Read it", actor=story.user)


def test_following_twice_inside_one_revision_window_opens_a_revision_each_time(new_story):
    story = doc_story(new_story)
    share = doc_share(story)
    followed = share.follow(story.row(Doc, 1), team_version("Cart rules, team", "first team text"), team_context(story))
    share.follow(followed, team_version("Cart rules, team", "second team text"), team_context(story))
    story.expect_text("doc revision 1 2", "doc 1, revision 2 of 3: Cart rules, team", "first team text", actor=story.user)
    story.expect_text("doc revision 1 3", "doc 1, revision 3 of 3: Cart rules, team", "second team text", actor=story.user)


def test_a_version_equal_to_the_latest_revision_opens_no_revision(new_story):
    story = doc_story(new_story)
    doc = story.row(Doc, 1)
    doc_share(story).follow(doc, {"title": doc.title, "abstract": doc.abstract, "body": doc.body}, team_context(story))
    story.expect_absent("doc revisions 1", "2", actor=story.user)
