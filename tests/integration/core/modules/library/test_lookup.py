from datetime import timedelta
from engine.container.container import Container
from engine.library.library_ref import LibraryRef
from tests.stories.core.modules.library.support.saved_connection import saved_connection
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.shared_server_binary import SharedServerBinary
from tests.stories.server.support.stub_server import StubAnswer, StubServer
from dataclasses import dataclass
import shutil

from engine.library.library_hits import LibraryHits
from engine.library.library_lookup import LibraryLookup
from tests.stories.core.modules.secrets.support.private_home import private_folder
import pytest

__all__ = ["private_folder"]
pytestmark = pytest.mark.usefixtures("private_folder")
JSON_HEADERS = {"Content-Type": "application/json"}
EMPTY_PAGE = b'{"page": 1, "size": 30, "total": 0, "rows": []}'
ASKS = 10
REQUIRES_COMPILER = pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build")


@dataclass(frozen=True)
class Tokens:
    """The tokens of the two users the real server was started with."""

    admin: str
    editor: str


def test_the_library_module_binds_its_own_lookup(journal):
    assert type(journal.container.get(LibraryLookup)).__name__ == 'ServerLibraryLookup'


def test_with_no_connection_a_search_answers_nothing(journal):
    lookup = journal.container.get(LibraryLookup)
    assert lookup.hits(['release'], ['doc', 'sequence', 'check']) == LibraryHits()
    assert lookup.title('doc', 1) is None


__all__ = ["private_folder"]


pytestmark = pytest.mark.usefixtures("private_folder")


JSON_HEADERS = {"Content-Type": "application/json"}


EMPTY_PAGE = b'{"page": 1, "size": 30, "total": 0, "rows": []}'


ASKS = 10


REQUIRES_COMPILER = pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build")


@pytest.fixture(scope="module")
def shared_server(tmp_path_factory):
    with SharedServerBinary(tmp_path_factory.mktemp("shared")) as server:
        yield server, Tokens(server.new_user("Ada", "admin"), server.new_user("Grace", "edit"))


def test_a_connection_that_stopped_asks_no_server(played):
    with StubServer(StubAnswer(200, EMPTY_PAGE, JSON_HEADERS)) as stub:
        story = saved_connection(played, stub.address, "jsl_token", stopped="The address changed. Connect again to send your token to it.")
        lookup = story.container.get(LibraryLookup)
        story.expect_rows(lookup.hits(["release"], ["doc"]) == LibraryHits(), lookup.title("doc", 1) is None, stub.requests == [])


def test_a_dead_server_is_waited_on_once_across_ten_searches(played):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(played, stub.address, "jsl_token")
        lookup = story.container.get(LibraryLookup)
        answers = [lookup.hits(["release"], ["doc"]) for _ in range(ASKS)]
        story.expect_rows(answers == [LibraryHits(is_unreachable=True)] * ASKS, len(stub.requests) == 1)


def test_the_server_is_asked_again_after_a_minute(played):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(played, stub.address, "jsl_token")
        lookup = story.container.get(LibraryLookup)
        lookup.hits(["release"], ["doc"])
        story.advance(timedelta(seconds=59))
        lookup.hits(["release"], ["doc"])
        story.expect_rows(len(stub.requests) == 1)
        story.advance(timedelta(seconds=2))
        lookup.hits(["release"], ["doc"])
        story.expect_rows(len(stub.requests) == 2)


def test_a_slow_server_is_waited_on_for_two_seconds_and_no_longer(played):
    with StubServer(StubAnswer(200, EMPTY_PAGE, JSON_HEADERS, poll_release=True)) as stub:
        story = saved_connection(played, stub.address, "jsl_token")
        lookup = story.container.get(LibraryLookup)
        answer = lookup.hits(["release"], ["doc"])
        story.expect_rows(answer == LibraryHits(is_unreachable=True))


def test_a_server_that_answers_has_no_failure_kept(played):
    with StubServer(StubAnswer(200, EMPTY_PAGE, JSON_HEADERS)) as stub:
        story = saved_connection(played, stub.address, "jsl_token")
        lookup = story.container.get(LibraryLookup)
        for _ in range(3):
            lookup.hits(["release"], ["doc"])
        story.expect_rows(len(stub.requests) == 3)


@REQUIRES_COMPILER
def test_a_search_finds_items_of_each_share_with_the_text_around_the_match(played, shared_server):
    server, tokens = shared_server
    server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Marble lookup", "abstract": "About it", "body": "Before anything, tag the commit and build the xenolith package."}})
    server.send(tokens.admin, "POST", "/items/check", {"fields": {"title": "Xenolith check", "command": "make", "brief": "Builds xenolith", "interval_minutes": 0}})
    story = played(UserJoined)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    matches = story.container.get(LibraryLookup).hits(["xenolith"], ["doc", "check"]).entries
    story.expect_rows([(hit.share, hit.title) for hit in matches] == [("doc", "Marble lookup"), ("check", "Xenolith check")], "xenolith" in matches[0].excerpt)


@REQUIRES_COMPILER
def test_an_item_is_read_by_its_library_number_and_a_title_is_looked_up(played, shared_server):
    server, tokens = shared_server
    item = server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Onyx read", "abstract": "About it", "body": "Tag first."}})[1]
    story = played(UserJoined)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    lookup = story.container.get(LibraryLookup)
    fetched = lookup.item("doc", LibraryRef(int(str(item["id"]))))
    story.expect_rows(fetched.fields["body"] == "Tag first.", lookup.title("doc", int(str(item["id"]))) == "Onyx read", lookup.title("doc", 99999) is None)


@REQUIRES_COMPILER
def test_a_local_row_that_follows_an_item_is_a_copy_and_others_are_not(played, shared_server):
    server, tokens = shared_server
    story = played(UserJoined)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    made = story.run('doc make "Jade copy" --abstract "About it" --body "Tag first."', story.user)
    row_id = int(made.output_text.split(":")[0].split()[1])
    lookup = story.container.get(LibraryLookup)
    story.expect_rows(lookup.is_copy("doc", row_id) is False)
    story.expect_text(f"library share doc {row_id}", "is now library doc ", actor=story.user)
    story.expect_rows(lookup.is_copy("doc", row_id) is True, lookup.is_copy("doc", row_id + 1) is False, lookup.is_copy("check", row_id) is False)
