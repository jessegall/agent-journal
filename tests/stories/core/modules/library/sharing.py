import shutil
from dataclasses import dataclass

import pytest

from core.base.query.queries import Queries
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.doc_library_share import DocLibraryShare
from core.modules.library.models.library_copy import LibraryCopy
from core.testing.story import Story
from tests.stories.core.modules.library.support.memo_share import INTERNAL_REASON, PATH
from tests.stories.core.modules.library.support.stored_text import every_stored_text
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

SECRET_VALUE = "sk-live-4f9a2c7e1b"


@dataclass(frozen=True)
class Tokens:
    """The tokens of the three users the real server was started with."""

    admin: str
    editor: str
    reader: str


@pytest.fixture(scope="module")
def shared_server(tmp_path_factory):
    with SharedServerBinary(tmp_path_factory.mktemp("shared")) as server:
        yield server, Tokens(server.new_user("Ada", "admin"), server.new_user("Grace", "edit"), server.new_user("Linus", "read"))


def fields_of(title: str, body: str = "Tag first.") -> dict[str, str]:
    return {"title": title, "abstract": f"About {title}", "body": body}


def connected(new_story, server: SharedServerBinary, token: str, module: str | None = None) -> Story:
    story = new_story(module, fixture=BuilderWithUser) if module else new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story


def new_doc(story: Story, title: str, body: str = "Tag first.", abstract: str | None = None) -> int:
    made = story.run(f'doc make "{title}" --abstract "{abstract or "About " + title}" --body "{body}"', story.user)
    return int(made.output_text.split(":")[0].split()[1])


def server_item(server: SharedServerBinary, token: str, item_id: int) -> dict[str, object]:
    return server.send(token, "GET", f"/items/doc/{item_id}")[1]


def copy_of(story: Story, row_id: int) -> LibraryCopy:
    return story.container.get(Queries).query(LibraryCopy).filter(share="doc", row_id=row_id).first()


def shared(story: Story, server: SharedServerBinary, token: str, title: str) -> tuple[int, int]:
    row_id = new_doc(story, title)
    story.expect_text(f"library share doc {row_id}", "is now library doc ", actor=story.user)
    return row_id, copy_of(story, row_id).item_id


def test_a_person_shares_a_document_and_the_row_follows_the_new_item(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    row_id = new_doc(story, "Quartz release")
    outcome = story.run(f"library share doc {row_id}", actor=story.user)
    copy = copy_of(story, row_id)
    item = server_item(server, tokens.editor, copy.item_id)
    doc = story.container.get(Queries).query(Doc).find(row_id)
    story.expect_rows(outcome.output_text.strip() == f"doc {row_id} is now library doc {copy.item_id}, version 1", item["fields"] == fields_of("Quartz release"),
                      item["creator"] == "Grace", (copy.base_version, copy.base_digest) == (1, story.container.get(DocLibraryShare).digest(doc)))


def test_a_text_that_names_local_rows_is_shared_with_a_warning(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    row_id = new_doc(story, "Basalt notes", "Follow task 6367 and doc 12 first.")
    story.expect_text(f"library share doc {row_id}", "is now library doc ", "this text names task 6367 and doc 12; those numbers mean something else in another journal", actor=story.user)
    story.expect_rows(copy_of(story, row_id) is not None)


def test_an_agent_cannot_share_and_nothing_reaches_the_server(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    row_id = new_doc(story, "Granite agent")
    story.expect_refusal(f"library share doc {row_id}", "an agent cannot share with the team: ask the user to share it", actor=story.agent)
    story.expect_rows(copy_of(story, row_id) is None, server.send(tokens.editor, "GET", "/items?kind=doc&search=granite")[1]["total"] == 0)


def test_a_row_the_share_refuses_is_not_sent(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor, f"{PATH}:MemoShareModule")
    row_id = new_doc(story, "Marble internal", abstract="Internal only")
    story.expect_refusal(f"library share memo {row_id}", f"memo {row_id} cannot be shared: {INTERNAL_REASON}", actor=story.user)
    story.expect_rows(server.send(tokens.editor, "GET", "/items?kind=doc&search=marble")[1]["total"] == 0)


def test_a_text_holding_the_value_of_a_stored_secret_is_refused_though_the_row_is_older(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    row_id = new_doc(story, "Jasper deploy", f"Use {SECRET_VALUE} to deploy.")
    story.expect_success('secret make "Github" --environment main', "secret 1 made: Github, waiting for the user to fill key on the Secrets window", actor=story.agent)
    story.expect_success(f"secret fill 1 key {SECRET_VALUE}", actor=story.user)
    story.expect_refusal(f"library share doc {row_id}", "this doc contains the value of GITHUB_KEY: name the secret, never its value", actor=story.user)
    story.expect_rows(copy_of(story, row_id) is None, server.send(tokens.editor, "GET", "/items?kind=doc&search=jasper")[1]["total"] == 0)


def test_a_row_that_follows_an_item_is_not_shared_twice(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    row_id, item_id = shared(story, server, tokens.editor, "Onyx twice")
    story.expect_refusal(f"library share doc {row_id}", f"doc {row_id} already follows library doc {item_id}", actor=story.user)


def test_a_reader_cannot_share_and_a_share_of_a_missing_row_or_kind_is_refused(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.reader)
    row_id = new_doc(story, "Opal reader")
    story.expect_refusal(f"library share doc {row_id}", "your role cannot do this", actor=story.user)
    story.expect_refusal("library share doc 9999", "no doc 9999", actor=story.user)
    story.expect_refusal(f"library share poem {row_id}", "this journal shares no poem with the library", actor=story.user)
    story.expect_rows(copy_of(story, row_id) is None)


def test_sharing_with_no_connection_is_refused_in_plain_words(new_story):
    story = new_story(fixture=BuilderWithUser)
    row_id = new_doc(story, "Agate offline")
    story.expect_refusal(f"library share doc {row_id}", "This journal is not connected to a shared server.", actor=story.user)


def test_sharing_while_the_server_is_down_names_its_address_and_writes_nothing(new_story, tmp_path):
    with SharedServerBinary(tmp_path) as server:
        story = connected(new_story, server, server.new_user("Ada", "admin"))
        address = server.address
    row_id = new_doc(story, "Amber down")
    story.expect_refusal(f"library share doc {row_id}", f"The library cannot be reached at {address}.", actor=story.user)
    story.expect_rows(copy_of(story, row_id) is None)


def test_an_admin_removes_an_item_and_every_local_row_stays(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    row_id, item_id = shared(story, server, tokens.admin, "Slate removed")
    stored_copy = copy_of(story, row_id)
    story.expect_success(f"library remove doc {item_id}", f"library doc {item_id} is removed, as version 2", actor=story.user)
    story.expect_rows(server_item(server, tokens.admin, item_id)["removed_at"] != "", copy_of(story, row_id) == stored_copy, story.container.get(Queries).query(Doc).find(row_id).title == "Slate removed")


def test_only_an_admin_removes_and_only_a_person(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    _, item_id = shared(story, server, tokens.editor, "Flint kept")
    story.expect_refusal(f"library remove doc {item_id}", "your role cannot do this", actor=story.user)
    story.expect_refusal(f"library remove doc {item_id}", "an agent cannot remove an item from the library: ask the user to remove it", actor=story.agent)
    story.expect_rows("removed_at" not in server_item(server, tokens.editor, item_id))


def test_an_admin_brings_back_a_removed_item_and_an_editor_cannot(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    _, item_id = shared(story, server, tokens.admin, "Coral restored")
    story.expect_success(f"library remove doc {item_id}", actor=story.user)
    story.expect_success(f"library connect --token {tokens.editor}", actor=story.user)
    story.expect_refusal(f"library restore doc {item_id}", "your role cannot do this", actor=story.user)
    story.expect_success(f"library connect --token {tokens.admin}", actor=story.user)
    story.expect_success(f"library restore doc {item_id}", f"library doc {item_id} is back, as version 3", actor=story.user)
    story.expect_rows("removed_at" not in server_item(server, tokens.admin, item_id))


def test_an_item_that_is_not_removed_is_not_restored_without_a_version(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    _, item_id = shared(story, server, tokens.admin, "Pearl present")
    story.expect_refusal(f"library restore doc {item_id}", f"library doc {item_id} is not removed", actor=story.user)


def test_an_old_version_is_put_in_again_as_a_new_version_and_the_bad_edit_stays_in_the_history(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    _, item_id = shared(story, server, tokens.editor, "Topaz undo", )
    server.send(tokens.editor, "PUT", f"/items/doc/{item_id}", {"fields": fields_of("Topaz undo", "Nonsense.")}, {"If-Match": '"1"'})
    story.expect_success(f"library restore doc {item_id} --version 1", f"library doc {item_id} is back at the text of version 1, as version 3", actor=story.user)
    story.expect_rows(server_item(server, tokens.editor, item_id)["fields"] == fields_of("Topaz undo"), server_item(server, tokens.editor, item_id)["version"] == 3)
    story.expect_text(f"library versions doc {item_id}", "version 3", "version 2", "version 1", actor=story.agent)


def test_the_old_version_of_a_removed_item_brings_it_back_with_that_text(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    _, item_id = shared(story, server, tokens.admin, "Garnet both")
    story.expect_success(f"library remove doc {item_id}", actor=story.user)
    story.expect_success(f"library restore doc {item_id} --version 1", f"library doc {item_id} is back at the text of version 1, as version 3", actor=story.user)
    story.expect_rows("removed_at" not in server_item(server, tokens.admin, item_id), server_item(server, tokens.admin, item_id)["fields"] == fields_of("Garnet both"))


def test_a_version_the_server_does_not_have_and_an_agent_are_both_refused(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    _, item_id = shared(story, server, tokens.editor, "Jade versions")
    story.expect_refusal(f"library restore doc {item_id} --version 9", "there is no such item", actor=story.user)
    story.expect_refusal(f"library restore doc {item_id} --version 1", "an agent cannot restore an item of the library: ask the user to restore it", actor=story.agent)


def test_no_command_leaves_the_token_in_a_row(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    _, item_id = shared(story, server, tokens.admin, "Onyx token")
    story.expect_success(f"library remove doc {item_id}", actor=story.user)
    story.expect_rows(tokens.admin not in every_stored_text(story))
