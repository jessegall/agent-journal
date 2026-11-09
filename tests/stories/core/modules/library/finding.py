import json
import shutil
from dataclasses import dataclass
from datetime import datetime, timezone

import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.library.support.saved_connection import saved_connection
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.shared_server_binary import SharedServerBinary
from tests.stories.server.support.stub_server import StubAnswer, StubServer
from tests.stories.server.viewer.share import SharedLink, opened

__all__ = ["private_folder"]

pytestmark = pytest.mark.usefixtures("private_folder")

JSON_HEADERS = {"Content-Type": "application/json"}
DOCUMENTS_WINDOW = "documents.documents"
UNREACHABLE_LINE = "the library could not be reached, so these are local results only"
SERVER_BUILD_REQUIRED = pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build")


@dataclass(frozen=True)
class Tokens:
    """The tokens of the two users the real server was started with."""

    admin: str
    editor: str


@pytest.fixture(scope="module")
def shared_server(tmp_path_factory):
    with SharedServerBinary(tmp_path_factory.mktemp("shared")) as server:
        yield server, Tokens(server.new_user("Ada", "admin"), server.new_user("Grace", "edit"))


def search_hook(line: str):
    tokens = line.split()
    return HookSamples.shell(line, ShellPart(tokens[0], CommandCategory.JOURNAL, tokens[1:], subcommand=tokens[1]))


def local_doc(story, title: str, body: str) -> None:
    story.expect_text(f'doc make "{title}" --abstract "About {title}" --body "{body}"', f"{title}", actor=story.user)


@SERVER_BUILD_REQUIRED
def test_the_library_hits_are_in_the_json_with_whether_the_library_was_reached(new_story, shared_server):
    server, tokens = shared_server
    server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Granite note", "abstract": "About granite", "body": "Granite only."}})
    story = new_story(fixture=UserBuilder)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    answer = json.loads(story.run("search find granite --json", actor=story.agent).output_text)
    story.expect_rows([(hit["cli_name"], hit["title"]) for hit in answer["library"]] == [("library doc", "Granite note")], answer["library_unreachable_error"] is False, answer["hits"] == [])


@SERVER_BUILD_REQUIRED
def test_a_search_with_only_library_hits_does_not_say_nothing_holds_the_words(new_story, shared_server):
    server, tokens = shared_server
    server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Basalt note", "abstract": "About basalt", "body": "Basalt only."}})
    story = new_story(fixture=UserBuilder)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    story.expect_text("search find basalt", "library doc ", actor=story.agent)
    story.expect_no_text("search find basalt", "nothing here holds all of", actor=story.agent)


def test_an_unreachable_library_adds_one_line_after_the_local_hits(new_story):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token", fixture=UserBuilder)
        local_doc(story, "Deploy notes", "How to rollback after a failed deploy")
        story.expect_ordered_lines("search find rollback", "doc 1: ", UNREACHABLE_LINE, actor=story.user)
        outcome = story.run("search find rollback", actor=story.user)
        story.expect_rows(outcome.output_text.count(UNREACHABLE_LINE) == 1, len(stub.requests) == 1)


def test_an_unreachable_library_with_no_local_hit_says_both(new_story):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token", fixture=UserBuilder)
        story.expect_ordered_lines("search find nothingmatches", "nothing here holds all of: nothingmatches", UNREACHABLE_LINE, actor=story.user)


def test_a_model_filter_that_names_no_share_asks_no_server(new_story):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token", fixture=UserBuilder)
        story.expect_success("search find cart --model task", "nothing here holds all of: cart", actor=story.user)
        story.expect_rows(stub.requests == [])


def test_a_search_mark_asks_no_server(new_story):
    with StubServer(StubAnswer(200, b'{"page": 1, "size": 30, "total": 0, "rows": []}', JSON_HEADERS)) as stub:
        story = install_runner(saved_connection(new_story, stub.address, "jsl_token", fixture=UserBuilder))
        story.run('task make "Fix the cart" --environment main', actor=story.user)
        story.hook("s-1", search_hook("journal search find cart"))
        story.run_listeners()
        story.expect_rows(stub.requests == [])
        story.expect_text("search find cart", "task 1: ", actor=story.user)
        story.expect_rows(len(stub.requests) == 3)


def connected_story(new_story, server: SharedServerBinary, token: str):
    story = new_story(fixture=UserBuilder)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story


@SERVER_BUILD_REQUIRED
def test_a_library_document_is_read_by_its_library_number_with_every_reading_flag(new_story, shared_server):
    server, tokens = shared_server
    item = server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Reading alpha", "abstract": "About alpha", "body": "## Steps\nTag first.\n- one\n- two\n## Notes\nThen build."}})[1]
    number = int(str(item["id"]))
    story = connected_story(new_story, server, tokens.editor)
    story.expect_text(f"doc show library:{number}", "From the team's library, version 1, changed by Ada", f"library doc {number}: Reading alpha", "1  Steps", "2  Notes", actor=story.agent)
    story.expect_text(f"doc show library:{number} --section 1", "1. Steps", "Tag first.", actor=story.agent)
    story.expect_text(f"doc show library:{number} --section 1 --bullets", "- one", actor=story.agent)
    story.expect_text(f"doc show library:{number} --grep build", "2 Notes: Then build.", actor=story.agent)
    story.expect_text(f"doc show library:{number} --all", "Then build.", actor=story.agent)
    document = json.loads(story.run(f"doc show library:{number} --json", actor=story.agent).output_text)
    story.expect_rows(document["fields"]["title"] == "Reading alpha", document["id"] == number)


@SERVER_BUILD_REQUIRED
def test_nothing_is_saved_by_reading_a_library_document(new_story, shared_server):
    server, tokens = shared_server
    item = server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Reading beta", "abstract": "About beta", "body": "Tag first."}})[1]
    story = connected_story(new_story, server, tokens.editor)
    story.run(f"doc show library:{int(str(item['id']))}", actor=story.agent)
    story.expect_no_text("doc list", "Reading beta", actor=story.agent)


@SERVER_BUILD_REQUIRED
def test_a_plain_number_with_no_local_document_is_refused_with_the_library_item_of_that_number(new_story, shared_server):
    server, tokens = shared_server
    item = server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Rollback procedure", "abstract": "How to undo", "body": "Run it."}})[1]
    number = int(str(item["id"]))
    story = connected_story(new_story, server, tokens.editor)
    story.expect_refusal(f"doc show {number}", f"library doc {number} exists: Rollback procedure; read it with journal doc show library:{number}", actor=story.agent)


@SERVER_BUILD_REQUIRED
def test_a_library_reading_lists_no_links_of_the_local_row_with_the_same_number(new_story, tmp_path):
    with SharedServerBinary(tmp_path) as server:
        token = server.new_user("Ada", "admin")
        server.send(token, "POST", "/items/doc", {"fields": {"title": "Library one", "abstract": "About it", "body": "Plain words."}})
        story = connected_story(new_story, server, token)
        story.expect_success('task make "Fix the cart" --environment main', actor=story.user)
        story.expect_success('doc make "Local one" --abstract "About it" --body "See task 1 for the cart."', actor=story.user)
        story.expect_text("doc show 1", "links: task:1", actor=story.agent)
        story.expect_text("doc show library:1", "library doc 1: Library one", actor=story.agent)
        story.expect_no_text("doc show library:1", "links:", actor=story.agent)
        story.expect_no_text("doc show library:1 --all", "links:", actor=story.agent)


def test_a_report_takes_no_library_number(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_usage_error("report show library:3", actor=story.agent)


def test_a_library_number_that_is_no_number_is_a_usage_error(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_usage_error("doc show library:twelve", actor=story.agent)


def test_a_share_session_reads_the_shared_document_and_never_the_library_item_with_that_number(new_story):
    story = new_story(fixture=UserBuilder)
    story.advance(datetime.now(timezone.utc) - story.clock.timestamp().value)
    story.expect_success('doc make "Shared one" --abstract "About it" --body "Plain words."', actor=story.user)
    made = json.loads(story.run("share make docs:1 --environment main --json", actor=story.user).output_text)
    with server_story(story) as server:
        visitor = opened(server, SharedLink(int(made["id"]), str(made["link"])))
        server.expect_viewer_line(visitor, {"window": DOCUMENTS_WINDOW, "line": ["doc", "show", "1"], "environment": "main"}, 200, '"code": 0')
        server.expect_viewer_line(visitor, {"window": DOCUMENTS_WINDOW, "line": ["doc", "show", "library:1"], "environment": "main"}, 403, "not part of what is shared")
        server.expect_viewer_line(visitor, {"window": DOCUMENTS_WINDOW, "line": ["doc", "show", "library:14"], "environment": "main"}, 403, "not part of what is shared")
        for share_name in SHARE_NAMES:
            server.expect_viewer_line(visitor, {"window": DOCUMENTS_WINDOW, "line": [share_name, "show", "library:1"], "environment": "main"}, 403, "not shared by the link")
            server.expect_viewer_line(visitor, {"window": DOCUMENTS_WINDOW, "line": [share_name, "show", "1"], "environment": "main"}, 403, "not shared by the link")


SHARE_NAMES = ["sequence", "check"]


def library_item(server: SharedServerBinary, token: str, share_name: str, title: str) -> int:
    fields = ({"title": title, "steps": json.dumps(["Run the suite", "Tag the release"]), "step_guards": "[]"} if share_name == "sequence"
              else {"title": title, "command": "make release", "brief": "Builds the release", "interval_minutes": 0})
    return int(str(server.send(token, "POST", f"/items/{share_name}", {"fields": fields})[1]["id"]))


@SERVER_BUILD_REQUIRED
@pytest.mark.parametrize("share_name", SHARE_NAMES)
def test_a_library_sequence_or_check_is_read_by_its_library_number_and_nothing_is_saved(new_story, shared_server, share_name):
    server, tokens = shared_server
    number = library_item(server, tokens.admin, share_name, f"Reading {share_name}")
    story = connected_story(new_story, server, tokens.editor)
    expected = ["1. Run the suite", "2. Tag the release"] if share_name == "sequence" else ["command: make release", "brief: Builds the release"]
    story.expect_text(f"{share_name} show library:{number}", f"From the team's library, version 1, changed by Ada; it is not a {share_name} of this journal.", f"library {share_name} {number}: Reading {share_name}", *expected, actor=story.agent)
    document = json.loads(story.run(f"{share_name} show library:{number} --json", actor=story.agent).output_text)
    story.expect_rows(document["fields"]["title"] == f"Reading {share_name}", document["id"] == number)
    story.expect_no_text(f"{share_name} list", f"Reading {share_name}", actor=story.agent)


@SERVER_BUILD_REQUIRED
@pytest.mark.parametrize("share_name", SHARE_NAMES)
def test_a_plain_number_with_no_local_sequence_or_check_is_refused_with_the_library_item_of_that_number(new_story, shared_server, share_name):
    server, tokens = shared_server
    number = library_item(server, tokens.admin, share_name, f"Hinted {share_name}")
    story = connected_story(new_story, server, tokens.editor)
    story.expect_refusal(f"{share_name} show {number}", f"library {share_name} {number} exists: Hinted {share_name}; read it with journal {share_name} show library:{number}", actor=story.agent)


@SERVER_BUILD_REQUIRED
def test_a_library_check_lists_no_links_of_the_local_check_with_the_same_number(new_story, shared_server):
    server, tokens = shared_server
    number = library_item(server, tokens.admin, "check", "Library check one")
    story = connected_story(new_story, server, tokens.editor)
    story.expect_success('check make "Local one" --command "true" --every 0', actor=story.user)
    story.expect_text("check show 1", "Local one", actor=story.agent)
    story.expect_text(f"check show library:{number}", f"library check {number}: Library check one", actor=story.agent)
    story.expect_no_text(f"check show library:{number}", "Local one", "links:", actor=story.agent)


@pytest.mark.parametrize("share_name", SHARE_NAMES)
def test_a_library_number_that_is_no_number_is_a_usage_error_for_a_sequence_or_check(new_story, share_name):
    story = new_story(fixture=UserBuilder)
    story.expect_usage_error(f"{share_name} show library:twelve", actor=story.agent)


def test_a_sequence_cannot_be_run_from_the_library_before_it_is_got(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal("sequence run library:3", "get it first with journal library get sequence 3", actor=story.agent)
