import json
import shutil
from dataclasses import dataclass, replace

import pytest

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.models.doc import Doc
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from tests.stories.core.modules.library.support import command_share, paused_share
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]


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


def doc_fields(title: str, body: str = "Tag first.") -> dict[str, str]:
    return {"title": title, "abstract": f"About {title}", "body": body}


def new_item(server: SharedServerBinary, token: str, title: str, body: str = "Tag first.") -> int:
    return int(str(server.send(token, "POST", "/items/doc", {"fields": doc_fields(title, body)})[1]["id"]))


def connected(new_story, server: SharedServerBinary, token: str, module: str | None = None) -> Story:
    story = new_story(module, fixture=BuilderWithUser) if module else new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story


def made_copy(story: Story, server: SharedServerBinary, token: str, title: str) -> LibraryCopy:
    item_id = new_item(server, token, title)
    story.expect_text(f"library get doc {item_id}", f"library doc {item_id}, version 1 is now doc ", actor=story.user)
    return copy_of_item(story, item_id)


def copy_of_item(story: Story, item_id: int) -> LibraryCopy:
    return story.container.get(Queries).query(LibraryCopy).filter(share="doc", item_id=item_id).first()


def copy_with(story: Story, copy: LibraryCopy, **values: object) -> None:
    story.container.get(Repository).save(replace(copy, **values), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def connection_with(story: Story, **values: object) -> None:
    connection = story.container.get(Queries).query(LibraryConnection).first()
    story.container.get(Repository).save(replace(connection, **values), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def copy_line(story: Story, copy: LibraryCopy) -> str:
    return next(line for line in story.run("library copies", story.agent).output_text.splitlines() if line.startswith(f"copy {copy.id}:"))


def test_getting_an_item_makes_one_document_and_one_copy_that_follows_it(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Quartz got", "Read it first.")
    story = connected(new_story, server, tokens.editor)
    story.expect_success(f"library get doc {item_id}", f"library doc {item_id}, version 1 is now doc 1", actor=story.agent)
    copy, doc = copy_of_item(story, item_id), story.row(Doc, 1)
    story.expect_rows(doc.title == "Quartz got", doc.abstract == "About Quartz got", doc.body == "Read it first.", len(list(story.container.get(Queries).query(Doc).all_rows())) == 1)
    story.expect_rows(copy.row_id == 1, copy.base_version == 1, copy.state is CopyState.SYNCED, len(list(story.container.get(Queries).query(LibraryCopy).all_rows())) == 1)
    story.expect_text("doc revision 1 1", "Read it first.", actor=story.user)


def test_getting_an_item_again_is_refused_and_names_the_row_that_follows_it(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story, server, tokens.admin, "Onyx fetched twice")
    story.expect_refusal(f"library get doc {copy.item_id}", f"library doc {copy.item_id} is already doc {copy.row_id} on this journal", actor=story.user)
    story.expect_rows(len(list(story.container.get(Queries).query(Doc).all_rows())) == 1)


def test_a_kind_this_journal_lacks_is_refused_in_plain_words_and_nothing_is_made(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal("library get sequence 1", "this journal shares no sequence with the library", actor=story.user)
    story.expect_rows(len(list(story.container.get(Queries).query(LibraryCopy).all_rows())) == 0)


def test_an_item_removed_from_the_library_is_not_got(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Basalt removed")
    server.send(tokens.admin, "DELETE", f"/items/doc/{item_id}")
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal(f"library get doc {item_id}", f"library doc {item_id} is removed from the library", actor=story.user)
    story.expect_rows(len(list(story.container.get(Queries).query(Doc).all_rows())) == 0)


def test_an_item_that_warns_is_got_only_when_it_was_read_first(new_story, shared_server):
    server, tokens = shared_server
    code, item = server.send(tokens.admin, "POST", "/items/check", {"fields": {"title": "Granite check", "command": "echo hello", "brief": "Says hello", "interval_minutes": 5}})
    story = connected(new_story, server, tokens.editor, f"{command_share.PATH}:CommandShareModule")
    story.expect_refusal(f"library get check {item['id']}", command_share.WARNING, actor=story.user)
    story.expect_rows(code == 201, len(list(story.container.get(Queries).query(Doc).all_rows())) == 0)
    story.expect_text(f"library get check {item['id']} --read", f"library check {item['id']}, version 1 is now check 1", actor=story.user)
    story.expect_rows(story.row(Doc, 1).body == "echo hello")


def test_leaving_makes_the_row_a_plain_document_and_changes_nothing_on_the_server(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Marble left")
    server_item = server.send(tokens.editor, "GET", f"/items/doc/{copy.item_id}")[1]
    story.expect_success(f"library leave {copy.id}", f"doc {copy.row_id} no longer follows library doc {copy.item_id}", actor=story.user)
    story.expect_rows(copy_of_item(story, copy.item_id) is None, story.row(Doc, copy.row_id).title == "Marble left",
                      server.send(tokens.editor, "GET", f"/items/doc/{copy.item_id}")[1] == server_item)
    story.expect_text("library copies", "no copies", actor=story.agent)


def test_an_agent_cannot_leave_and_a_copy_that_is_not_there_is_refused(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Slate agent")
    story.expect_refusal(f"library leave {copy.id}", "an agent cannot stop following for the team", actor=story.agent)
    story.expect_refusal("library leave 99", "no library-copy 99", actor=story.user)
    story.expect_rows(copy_of_item(story, copy.item_id) is not None)


def test_a_copy_in_step_reads_in_sync(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Opal in sync")
    story.expect_rows(copy_line(story, copy) == f"copy {copy.id}: doc {copy.row_id} follows library doc {copy.item_id}, version 1. Status: In sync")


def test_a_local_change_reads_sending_while_the_server_is_reached_and_waiting_to_send_when_it_is_not(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Jasper local change")
    story.expect_success(f'doc edit {copy.row_id} --body "Changed here."', actor=story.user)
    story.expect_rows(copy_line(story, copy).endswith("Status: Sending"))
    connection_with(story, failure="The library cannot be reached.")
    story.expect_rows(copy_line(story, copy).endswith("Status: Waiting to send"))


def test_a_newer_version_that_must_wait_for_a_run_reads_waiting_for_its_run_to_end(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor, f"{paused_share.PATH}:PausedShareModule")
    row = story.container.get(Repository).save(Doc(creator_id=story.user.id, title="Agate paused", abstract="About it", body="Steps."), Context(story.user, story.clock.timestamp(), ReadMessage(1)))
    paused = story.container.get(Repository).save(LibraryCopy(creator_id=story.user.id, share="sequence", item_id=1, row_id=row.id, base_version=1, base_digest=story.container.get(
        paused_share.PausedShare).digest(row), server_version=2), Context(story.user, story.clock.timestamp(), ReadMessage(1)))
    story.expect_rows(copy_line(story, paused).endswith("Status: Waiting for its run to end"))


@pytest.mark.parametrize("state, label", [(CopyState.DENIED, "Local change, not sent"), (CopyState.REJECTED, "Not accepted by the server"), (CopyState.CONFLICT, "Conflict"),
                                          (CopyState.REVIEW, "New version to read"), (CopyState.REMOVED, "Removed from the library")])
def test_a_copy_kept_from_being_in_step_reads_the_status_of_its_reason(new_story, shared_server, state, label):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, f"Pearl {state.value}")
    copy_with(story, copy, state=state, note="The command of this check changed." if state is CopyState.REVIEW else "")
    story.expect_rows(f"Status: {label}" in copy_line(story, copy))


def test_the_note_of_a_copy_is_printed_with_its_status(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    copy = made_copy(story,server, tokens.admin, "Garnet note")
    copy_with(story, copy, state=CopyState.REJECTED, note="This text is over the size limit.")
    story.expect_text("library copies", "Status: Not accepted by the server", "This text is over the size limit.", actor=story.agent)


def test_copies_are_filtered_by_status_and_read_as_json(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    kept = made_copy(story,server, tokens.admin, "Amber kept")
    conflicted = made_copy(story,server, tokens.admin, "Amber conflicted")
    copy_with(story, conflicted, state=CopyState.CONFLICT)
    story.expect_text("library copies --state conflict", f"copy {conflicted.id}:", actor=story.agent)
    story.expect_absent("library copies --state conflict", f"copy {kept.id}:", actor=story.agent)
    rows = json.loads(story.run("library copies --json", story.agent).output_text)
    story.expect_rows({row["status"] for row in rows["rows"]} == {"synced", "conflict"}, {row["copy_id"] for row in rows["rows"]} == {kept.id, conflicted.id})


def test_a_got_document_is_not_linked_to_the_rows_its_text_names(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "Topaz mentions", "See task 1 before you start.")
    story = connected(new_story, server, tokens.editor)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.expect_text(f"library get doc {item_id}", "is now doc 1", actor=story.user)
    story.run('doc make "Plain notes" --abstract "Notes" --body "See task 1 before you start."', actor=story.user)
    story.run_listeners()
    story.expect_text("link list --source doc:2", "mentions  task:1", actor=story.user)
    story.expect_absent("link list --source doc:1", "task:1", actor=story.user)
