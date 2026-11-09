import shutil
from collections.abc import Callable
from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.library.support.library_address import ADDRESS_SETTING
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.support.library_denied_error import LibraryDeniedError
from core.base.library.library_item import LibraryItem
from core.modules.library.support.library_item_body import LibraryItemBody
from core.modules.library.support.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.support.library_rejected_error import LibraryRejectedError
from core.modules.library.support.library_stale_error import LibraryStaleError
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.server_state import ServerState
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from tests.stories.core.modules.library.support.saved_connection import saved_connection
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.shared_server_binary import SharedServerBinary
from tests.stories.server.support.stub_server import StubAnswer, StubServer

__all__ = ["private_folder"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

DOC_FIELDS = {"title": "Release checklist", "abstract": "What to do before a release", "body": "Tag first."}
NEWER_FIELDS = {"title": "Release checklist", "abstract": "What to do before a release", "body": "Build, then tag."}
JSON_HEADERS = {"Content-Type": "application/json"}
LARGEST_BODY_BYTES = 2 << 20


@dataclass(frozen=True)
class Tokens:
    """The tokens of the users the real server was started with."""

    admin: str
    editor: str
    reader: str


@pytest.fixture(scope="module")
def shared_server(tmp_path_factory):
    with SharedServerBinary(tmp_path_factory.mktemp("shared")) as server:
        tokens = Tokens(server.new_user("Ada", "admin"), server.new_user("Grace", "edit"), server.new_user("Alan", "read"))
        yield server, tokens


def read_client(story: Story) -> LibraryClient:
    return story.container.get(LibraryClient)


def read_outcome(call: Callable[[], object]) -> object:
    try:
        return call()
    except (LibraryStoppedError, LibraryUnreachableError, LibraryDeniedError, LibraryRejectedError, LibraryItemRemovedError, LibraryStaleError) as failure:
        return failure


def new_doc(server: SharedServerBinary, tokens: Tokens) -> int:
    code, item = server.send(tokens.admin, "POST", "/items/doc", {"fields": DOC_FIELDS})
    return int(str(item["id"])) if code == 201 else -1


def test_the_state_and_an_item_read_through_the_real_server(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    story = saved_connection(new_story, server.address, tokens.reader)
    state, item = read_client(story).state(), read_client(story).item("doc", item_id)
    story.expect_rows(("doc", item_id, 1, False) in [(entry.share, entry.item_id, entry.version, entry.is_removed) for entry in state.entries], state.role.value == "read",
                      item.fields == DOC_FIELDS, item.version == 1)


def test_an_editor_updates_an_item_and_gets_its_new_version(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    story = saved_connection(new_story, server.address, tokens.editor)
    updated = read_client(story).update("doc", item_id, 1, NEWER_FIELDS)
    story.expect_rows(updated.version == 2, updated.fields == NEWER_FIELDS)


def test_a_state_the_server_has_not_changed_is_the_state_the_caller_kept(new_story, shared_server):
    server, tokens = shared_server
    story = saved_connection(new_story, server.address, tokens.reader)
    kept = read_client(story).state()
    story.expect_rows(read_client(story).newest_state(kept) is kept)
    new_doc(server, tokens)
    story.expect_rows(read_client(story).newest_state(kept).etag != kept.etag)


def test_a_token_the_server_does_not_know_stops_sync(new_story, shared_server):
    server, _ = shared_server
    story = saved_connection(new_story, server.address, "jsl_not_a_token")
    story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryStoppedError))


def test_a_protocol_the_server_does_not_speak_stops_sync(new_story, shared_server):
    server, tokens = shared_server
    story = saved_connection(new_story, server.address, tokens.reader)
    outcome = read_outcome(lambda: read_client(story).call(server.address, tokens.reader, ServerState.parsed, "GET", "/state", headers={"Journal-Protocol": "9"}, opener=read_client(story).certificate.opener()))
    story.expect_rows(isinstance(outcome, LibraryStoppedError))


def test_a_reader_who_updates_is_denied_for_that_copy_only(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    story = saved_connection(new_story, server.address, tokens.reader)
    story.expect_rows(isinstance(read_outcome(lambda: read_client(story).update("doc", item_id, 1, NEWER_FIELDS)), LibraryDeniedError))


def test_an_update_of_an_old_version_is_stale_and_carries_the_newest_item(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    story = saved_connection(new_story, server.address, tokens.editor)
    read_client(story).update("doc", item_id, 1, NEWER_FIELDS)
    outcome = read_outcome(lambda: read_client(story).update("doc", item_id, 1, {**DOC_FIELDS, "body": "Mine."}))
    story.expect_rows(isinstance(outcome, LibraryStaleError), isinstance(outcome, LibraryStaleError) and outcome.current.version == 2,
                      isinstance(outcome, LibraryStaleError) and outcome.current.fields == NEWER_FIELDS)


def test_an_item_that_does_not_exist_and_an_update_of_a_removed_one_are_both_item_removed(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    server.send(tokens.admin, "DELETE", f"/items/doc/{item_id}")
    story = saved_connection(new_story, server.address, tokens.editor)
    story.expect_rows(isinstance(read_outcome(lambda: read_client(story).item("doc", 9999)), LibraryItemRemovedError),
                      isinstance(read_outcome(lambda: read_client(story).update("doc", item_id, 1, NEWER_FIELDS)), LibraryItemRemovedError))


def test_fields_the_server_will_not_take_are_rejected(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    story = saved_connection(new_story, server.address, tokens.editor)
    oversized = {**DOC_FIELDS, "body": "x" * (LARGEST_BODY_BYTES + 1)}
    story.expect_rows(isinstance(read_outcome(lambda: read_client(story).update("doc", item_id, 1, {"title": ""})), LibraryRejectedError),
                      isinstance(read_outcome(lambda: read_client(story).update("doc", item_id, 1, oversized)), LibraryRejectedError))


def test_an_update_that_names_no_version_is_rejected(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_doc(server, tokens)
    story = saved_connection(new_story, server.address, tokens.editor)
    outcome = read_outcome(lambda: read_client(story).call(server.address, tokens.editor, LibraryItemBody.parsed, "PUT", f"/items/doc/{item_id}", {"fields": NEWER_FIELDS}, opener=read_client(story).certificate.opener()))
    story.expect_rows(isinstance(outcome, LibraryRejectedError))


@pytest.mark.parametrize("code", [418, 500, 502, 503])
def test_any_other_code_is_unreachable_even_with_a_json_body(new_story, code):
    with StubServer(StubAnswer(code, b'{"error": "no"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token")
        story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryUnreachableError), len(stub.requests) == 1)


def test_an_html_error_page_reads_as_unreachable_whatever_its_code(new_story):
    page = b"<html><body>Bad gateway</body></html>"
    with StubServer(StubAnswer(401, page, {"Content-Type": "text/html"})) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token")
        story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryUnreachableError))


def test_an_html_page_with_a_good_code_reads_as_unreachable(new_story):
    with StubServer(StubAnswer(200, b"<html>welcome</html>", {"Content-Type": "text/html"})) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token")
        story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryUnreachableError))


def test_a_json_answer_without_the_fields_to_read_is_unreachable(new_story):
    with StubServer(StubAnswer(200, b'{"items": 3}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token")
        story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryUnreachableError))


@pytest.mark.parametrize("code", [301, 302, 307, 308])
def test_a_redirect_is_not_followed_and_no_token_goes_with_it(new_story, code):
    with StubServer(StubAnswer(200, b"{}", JSON_HEADERS)) as target:
        with StubServer(StubAnswer(code, b"", {"Location": target.address + "/state"})) as redirecting:
            story = saved_connection(new_story, redirecting.address, "jsl_secret_token")
            story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryUnreachableError), len(redirecting.requests) == 1, target.requests == [])


def test_a_server_that_is_not_listening_is_unreachable(new_story):
    with StubServer(StubAnswer(200)) as closed:
        address = closed.address
    story = saved_connection(new_story, address, "jsl_token")
    story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryUnreachableError))


def test_a_changed_address_setting_stops_sync_and_no_request_leaves(new_story):
    with StubServer(StubAnswer(200, b"{}", JSON_HEADERS)) as stub, StubServer(StubAnswer(200, b"{}", JSON_HEADERS)) as second:
        story = saved_connection(new_story, stub.address, "jsl_secret_token")
        story.expect_success(f"setting set {ADDRESS_SETTING} {second.address} --project", actor=story.user)
        outcome = read_outcome(read_client(story).state)
        story.expect_rows(isinstance(outcome, LibraryStoppedError), isinstance(outcome, LibraryStoppedError) and "Connect again" in outcome.reason, stub.requests == [], second.requests == [])


def test_an_address_setting_that_is_no_address_stops_sync_too(new_story):
    with StubServer(StubAnswer(200, b"{}", JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_secret_token")
        story.expect_success(f"setting set {ADDRESS_SETTING} 'ftp://nowhere' --project", actor=story.user)
        story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryStoppedError), stub.requests == [])


def test_with_no_connection_nothing_is_sent(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_rows(isinstance(read_outcome(read_client(story).state), LibraryStoppedError), read_client(story).is_connected is False)


def test_a_connection_with_a_token_is_connected_and_a_stopped_one_is_not(new_story):
    with StubServer(StubAnswer(200)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token")
        story.expect_rows(read_client(story).is_connected)
        connection = story.container.get(LibraryClient).connections.current()
        story.container.get(Repository).save(connection.changed(stopped="Connect again."), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))
        story.expect_rows(read_client(story).is_connected is False)

