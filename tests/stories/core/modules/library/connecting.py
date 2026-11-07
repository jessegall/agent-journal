import shutil

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.private.secret_values import SecretValues
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.queries.library_connection_query import LibraryConnectionQuery
from core.modules.library.support.library_address import ADDRESS_SETTING
from core.modules.library.support.library_client import TOKEN_VARIABLE, LibraryClient
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.testing.story import Story
from tests.stories.core.modules.library.support.stored_text import every_stored_text
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.shared_server_binary import SharedServerBinary
from tests.stories.server.support.stub_server import StubAnswer, StubServer
from tests.stories.server.support.tls_files import TlsFiles

__all__ = ["private_folder"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

SKIP_ADDRESS_GUARD = '--skip-guard library.address-by-person --skip-reason "the address is right"'


@pytest.fixture(scope="module")
def shared_server(tmp_path_factory):
    with SharedServerBinary(tmp_path_factory.mktemp("shared")) as server:
        yield server, server.new_user("Grace", "edit")


@pytest.fixture(scope="module")
def encrypted_server(tmp_path_factory):
    folder = tmp_path_factory.mktemp("encrypted")
    tls = TlsFiles.made_in(folder)
    with SharedServerBinary(folder, tls) as server:
        yield server, server.new_user("Grace", "edit"), tls


def library_connection(story: Story) -> LibraryConnection | None:
    return story.container.get(LibraryConnectionQuery).current()


def test_a_person_connects_with_a_url_and_a_token_and_sees_the_server_and_their_role(new_story, shared_server):
    server, token = shared_server
    story = new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", ". Role: edit.", actor=story.user)
    story.expect_text("library status", f"address: {server.address}", "user_name: Grace", "role: edit", "is_connected: True", actor=story.user)
    story.expect_text(f"setting show {ADDRESS_SETTING}", server.address, actor=story.user)
    story.expect_rows(library_connection(story).server_key == server.server_key(), library_connection(story).stopped == "", TOKEN_VARIABLE in story.container.get(SecretValues).values())


def test_a_bare_ip_means_https_so_a_server_without_a_certificate_cannot_be_reached(new_story, shared_server):
    server, token = shared_server
    bare = server.address.removeprefix("http://")
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(f"library connect {bare} --token {token}", f"The server could not be reached at https://{bare}.", actor=story.user)
    story.expect_rows(library_connection(story) is None, TOKEN_VARIABLE not in story.container.get(SecretValues).values())


def test_a_bare_ip_connects_over_https_with_the_certificate_of_the_server(new_story, encrypted_server):
    server, token, tls = encrypted_server
    bare = server.address.removeprefix("https://")
    story = new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {bare} --token {token} --certificate {tls.certificate}", "Role: edit.", actor=story.user)
    story.expect_text("library status", f"address: {server.address}", "is_encrypted: True", actor=story.user)
    story.expect_rows(library_client(story).state().role.value == "edit")


def test_a_certificate_the_server_does_not_use_is_refused_and_a_file_that_is_no_certificate_too(new_story, encrypted_server, tmp_path):
    server, token, _ = encrypted_server
    second = TlsFiles.made_in(tmp_path)
    notes = tmp_path / "notes.txt"
    notes.write_text("not a certificate")
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(f"library connect {server.address} --token {token} --certificate {second.certificate}", "The server could not be reached at", actor=story.user)
    story.expect_refusal(f"library connect {server.address} --token {token} --certificate {notes}", f"{notes} is no certificate file this journal can read", actor=story.user)
    story.expect_rows(library_connection(story) is None)


def test_a_wrong_token_is_refused_and_nothing_is_kept(new_story, shared_server):
    server, _ = shared_server
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(f"library connect {server.address} --token jsl_wrong", "The server did not accept this token.", actor=story.user)
    story.expect_rows(library_connection(story) is None, TOKEN_VARIABLE not in story.container.get(SecretValues).values(), "jsl_wrong" not in every_stored_text(story))


def test_an_address_nobody_answers_at_is_refused_and_named(new_story):
    with StubServer(StubAnswer(200)) as closed:
        address = closed.address
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal(f"library connect {address} --token jsl_token", f"The server could not be reached at {address}.", actor=story.user)
    story.expect_rows(library_connection(story) is None)


def test_an_address_that_is_no_address_is_refused_before_anything_is_sent(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("library connect ftp://nowhere --token jsl_token", "ftp://nowhere is no server address", actor=story.user)


def test_a_connect_with_no_address_uses_the_setting(new_story, shared_server):
    server, token = shared_server
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {ADDRESS_SETTING} {server.address} --project", actor=story.user)
    story.expect_text(f"library connect --token {token}", "Role: edit.", actor=story.user)


def test_a_connect_with_no_address_and_no_setting_is_refused(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("library connect --token jsl_token", "is no server address", actor=story.user)


def test_an_agent_cannot_connect_and_nothing_is_sent(new_story):
    with StubServer(StubAnswer(200, b"{}")) as stub:
        story = new_story(fixture=BuilderWithUser)
        story.expect_refusal(f"library connect {stub.address} --token jsl_token", "connection credentials are entered by a person", actor=story.agent)
        story.expect_rows(stub.requests == [], library_connection(story) is None, TOKEN_VARIABLE not in story.container.get(SecretValues).values())


def test_the_address_guard_cannot_be_skipped_and_no_token_leaves(new_story, shared_server):
    server, token = shared_server
    with StubServer(StubAnswer(200, b"{}")) as stub:
        story = new_story(fixture=BuilderWithUser)
        story.expect_success(f"library connect {server.address} --token {token}", actor=story.user)
        story.expect_refusal(f"setting set {ADDRESS_SETTING} {stub.address} --project", "library.address-by-person", actor=story.agent)
        story.expect_refusal(f"setting set {ADDRESS_SETTING} {stub.address} --project {SKIP_ADDRESS_GUARD}", "safety refusal", actor=story.agent)
        library_client(story).state()
        story.expect_rows(stub.requests == [])


def test_the_token_is_in_no_row_no_output_and_no_process_line(new_story, shared_server):
    server, token = shared_server
    story = new_story(fixture=BuilderWithUser)
    outcome = story.run(f"library connect {server.address} --token {token}", actor=story.user)
    status = story.run("library status --json", actor=story.user)
    settings = story.run("setting list", actor=story.user)
    story.expect_rows(token not in outcome.output_text, token not in status.output_text, token not in settings.output_text, token not in every_stored_text(story),
                      token in story.container.get(SecretValues).values().get(TOKEN_VARIABLE, ""))


def test_connecting_again_after_a_plain_disconnect_resumes_the_same_connection(new_story, shared_server):
    server, token = shared_server
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"library connect {server.address} --token {token}", actor=story.user)
    story.expect_success("library disconnect", "Disconnected. 0 copies stay and wait.", actor=story.user)
    story.expect_text("library status", "stopped: Disconnected. Connect again to sync.", actor=story.user)
    story.expect_rows(TOKEN_VARIABLE not in story.container.get(SecretValues).values())
    story.expect_text(f"library connect --token {token}", "Role: edit.", actor=story.user)
    story.expect_absent("library status", "stopped: Disconnected. Connect again to sync.", actor=story.user)
    story.expect_rows(story.container.get(Database).rows(Statement("SELECT id FROM library_connections"))[0]["id"] == 1)


def test_disconnect_with_forget_deletes_the_connection(new_story, shared_server):
    server, token = shared_server
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"library connect {server.address} --token {token}", actor=story.user)
    story.expect_success("library disconnect --forget", "Disconnected. 0 copies deleted.", actor=story.user)
    story.expect_text("library status", "is_connected: False", actor=story.user)
    story.expect_rows(library_connection(story) is None)


def test_an_agent_cannot_disconnect(new_story, shared_server):
    server, token = shared_server
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"library connect {server.address} --token {token}", actor=story.user)
    story.expect_refusal("library disconnect --forget", "only a person connects to the shared server or disconnects from it", actor=story.agent)
    story.expect_rows(library_connection(story) is not None, TOKEN_VARIABLE in story.container.get(SecretValues).values())


def test_disconnecting_with_no_connection_says_so(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("library disconnect", "This journal is not connected to a shared server.", actor=story.user)


def test_the_status_of_a_journal_with_no_connection_says_so(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_text("library status", "is_connected: False", "stopped: This journal is not connected to a shared server.", actor=story.agent)


def library_client(story: Story) -> LibraryClient:
    return story.container.get(LibraryClient)
