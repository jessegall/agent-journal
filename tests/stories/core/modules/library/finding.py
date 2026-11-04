import json
import shutil
from dataclasses import dataclass

import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.library.support.saved_connection import saved_connection
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.shared_server_binary import SharedServerBinary
from tests.stories.server.support.stub_server import StubAnswer, StubServer

__all__ = ["private_folder"]

pytestmark = pytest.mark.usefixtures("private_folder")

JSON_HEADERS = {"Content-Type": "application/json"}
UNREACHABLE_LINE = "the library could not be reached, so these are local results only"
NEEDS_GO = pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build")


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


@NEEDS_GO
def test_library_hits_follow_the_local_ones_with_their_excerpt(new_story, shared_server):
    server, tokens = shared_server
    server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Recovery procedure", "abstract": "How to undo", "body": "Run the rollback script, then check the logs."}})
    story = new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    local_doc(story, "Deploy notes", "How to rollback after a failed deploy")
    story.expect_ordered_lines("search find rollback", "doc 1: ", "library doc ", actor=story.agent)
    story.expect_text("search find rollback", "library doc 1: Recovery procedure ", "rollback script", actor=story.agent)


@NEEDS_GO
def test_the_library_hits_are_in_the_json_with_whether_the_library_was_reached(new_story, shared_server):
    server, tokens = shared_server
    server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Granite note", "abstract": "About granite", "body": "Granite only."}})
    story = new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    answer = json.loads(story.run("search find granite --json", actor=story.agent).output_text)
    story.expect_rows([(hit["cli_name"], hit["title"]) for hit in answer["library"]] == [("library doc", "Granite note")], answer["library_unreachable"] is False, answer["hits"] == [])


@NEEDS_GO
def test_a_search_with_only_library_hits_does_not_say_nothing_holds_the_words(new_story, shared_server):
    server, tokens = shared_server
    server.send(tokens.admin, "POST", "/items/doc", {"fields": {"title": "Basalt note", "abstract": "About basalt", "body": "Basalt only."}})
    story = new_story(fixture=BuilderWithUser)
    story.expect_text(f"library connect {server.address} --token {tokens.editor}", "Connected: ", actor=story.user)
    story.expect_text("search find basalt", "library doc ", actor=story.agent)
    story.expect_no_text("search find basalt", "nothing here holds all of", actor=story.agent)


def test_with_no_connection_the_output_is_what_it_was(new_story):
    story = new_story(fixture=BuilderWithUser)
    local_doc(story, "Deploy notes", "How to rollback after a failed deploy")
    story.expect_no_text("search find rollback", "library", actor=story.agent)
    story.expect_no_text("search find nothingmatches", UNREACHABLE_LINE, "library", actor=story.agent)
    story.expect_success("search find nothingmatches", "nothing here holds all of: nothingmatches", actor=story.agent)


def test_an_unreachable_library_adds_one_line_after_the_local_hits(new_story):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token", fixture=BuilderWithUser)
        local_doc(story, "Deploy notes", "How to rollback after a failed deploy")
        story.expect_ordered_lines("search find rollback", "doc 1: ", UNREACHABLE_LINE, actor=story.user)
        outcome = story.run("search find rollback", actor=story.user)
        story.expect_rows(outcome.output_text.count(UNREACHABLE_LINE) == 1, len(stub.requests) == 1)


def test_an_unreachable_library_with_no_local_hit_says_both(new_story):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token", fixture=BuilderWithUser)
        story.expect_ordered_lines("search find nothingmatches", "nothing here holds all of: nothingmatches", UNREACHABLE_LINE, actor=story.user)


def test_a_model_filter_that_names_no_share_asks_no_server(new_story):
    with StubServer(StubAnswer(500, b'{"error": "down"}', JSON_HEADERS)) as stub:
        story = saved_connection(new_story, stub.address, "jsl_token", fixture=BuilderWithUser)
        story.expect_success("search find cart --model task", "nothing here holds all of: cart", actor=story.user)
        story.expect_rows(stub.requests == [])


def test_a_search_mark_asks_no_server(new_story):
    with StubServer(StubAnswer(200, b'{"page": 1, "size": 30, "total": 0, "rows": []}', JSON_HEADERS)) as stub:
        story = install_runner(saved_connection(new_story, stub.address, "jsl_token", fixture=BuilderWithUser))
        story.run('task make "Fix the cart" --environment main', actor=story.user)
        story.hook("s-1", search_hook("journal search find cart"))
        story.run_listeners()
        story.expect_rows(stub.requests == [])
        story.expect_text("search find cart", "task 1: ", actor=story.user)
        story.expect_rows(len(stub.requests) == 1)
