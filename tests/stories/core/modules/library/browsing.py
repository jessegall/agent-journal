import json
import shutil
from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from tests.stories.core.modules.library.support.stored_text import stored_texts
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]


@dataclass(frozen=True)
class Tokens:
    """The tokens of the two users the real server was started with."""

    admin: str
    editor: str


@pytest.fixture(scope="module")
def shared_server(tmp_path_factory):
    with SharedServerBinary(tmp_path_factory.mktemp("shared")) as server:
        yield server, Tokens(server.new_user("Ada", "admin"), server.new_user("Grace", "edit"))


def doc_fields(title: str, body: str = "Tag first.") -> dict[str, str]:
    return {"title": title, "abstract": f"About {title}", "body": body}


def new_item(server: SharedServerBinary, token: str, share: str, fields: dict[str, object]) -> int:
    code, item = server.send(token, "POST", f"/items/{share}", {"fields": fields})
    return int(str(item["id"])) if code == 201 else -1


def connected(new_story, server: SharedServerBinary, token: str) -> Story:
    story = new_story(fixture=UserBuilder)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story


def test_the_list_names_each_item_with_its_version_title_author_and_day(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "doc", doc_fields("Quartz release checklist"))
    story = connected(new_story, server, tokens.editor)
    story.expect_text("library list --search quartz", f"doc {item_id}  v1  Quartz release checklist  Ada  ", actor=story.agent)


def test_a_list_page_has_the_shape_the_viewer_rows_read(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "doc", doc_fields("Basalt page shape"))
    story = connected(new_story, server, tokens.editor)
    listed = json.loads(story.run("library list --search basalt --json", actor=story.agent).output_text)
    row = listed["rows"][0]
    story.expect_rows(sorted(listed) == ["page", "rows", "size", "total"], listed["page"] == 1, listed["total"] == 1,
                      (row["share"], row["id"], row["version"], row["title"], row["creator"], row["updated_by"]) == ("doc", item_id, 1, "Basalt page shape", "Ada", "Ada"))


def test_the_list_filters_by_kind(new_story, shared_server):
    server, tokens = shared_server
    new_item(server, tokens.admin, "doc", doc_fields("Granite filter"))
    new_item(server, tokens.admin, "sequence", {"title": "Granite filter steps", "steps": '["Read it"]', "step_guards": "[]"})
    story = connected(new_story, server, tokens.editor)
    story.expect_text("library list --type sequence --search granite", "Granite filter steps", actor=story.agent)
    story.expect_no_text("library list --type sequence --search granite", "Granite filter  ", actor=story.agent)
    story.expect_text("library list --type doc --search granite", "Granite filter", actor=story.agent)


def test_a_kind_the_server_does_not_have_is_refused_with_the_kinds_it_has(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal("library list --type poem", "there is no such kind: the kinds are doc, sequence, check", actor=story.agent)


def test_a_search_shows_the_excerpt_around_the_match(new_story, shared_server):
    server, tokens = shared_server
    new_item(server, tokens.admin, "doc", doc_fields("Marble excerpt", "Before anything else, tag the commit and then build the zirconium package."))
    story = connected(new_story, server, tokens.editor)
    story.expect_text("library list --search zirconium", "Marble excerpt", "zirconium", actor=story.agent)


def test_a_search_that_matches_nothing_says_so(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_success("library list --search nothingmatchesthis", "nothing found", actor=story.agent)


def test_a_page_past_the_first_is_asked_for_by_number(new_story, shared_server):
    server, tokens = shared_server
    for number in range(31):
        new_item(server, tokens.admin, "sequence", {"title": f"Slate paging {number:02}", "steps": '["x"]', "step_guards": "[]"})
    story = connected(new_story, server, tokens.editor)
    story.expect_text("library list --type sequence --search slate", "--page 2 for the next", actor=story.agent)
    story.expect_no_text("library list --type sequence --search slate --page 2", "--page 3", actor=story.agent)


def test_an_item_that_has_a_local_copy_names_it_and_the_others_do_not(new_story, shared_server):
    server, tokens = shared_server
    followed = new_item(server, tokens.admin, "doc", doc_fields("Jasper copy followed"))
    loose = new_item(server, tokens.admin, "doc", doc_fields("Jasper copy loose"))
    story = connected(new_story, server, tokens.editor)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    copy = story.container.get(Repository).save(LibraryCopy(creator_id=story.user.id, share="doc", item_id=followed, row_id=1, base_version=1, base_digest="digest"), context)
    rows = {row["id"]: row for row in json.loads(story.run("library list --search jasper --json", actor=story.agent).output_text)["rows"]}
    story.expect_rows(rows[followed]["copy_id"] == copy.id, rows[loose]["copy_id"] is None)
    story.expect_text("library list --search jasper", f"Jasper copy followed  Ada  ", f"copy {copy.id}", actor=story.agent)


def test_one_item_is_read_live_with_its_fields(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "doc", doc_fields("Onyx single", "Build, then tag."))
    story = connected(new_story, server, tokens.editor)
    story.expect_text(f"library show doc {item_id}", f"doc {item_id}  version 1  by Ada", "title: Onyx single", "body: Build, then tag.", actor=story.agent)
    read_item = json.loads(story.run(f"library show doc {item_id} --json", actor=story.agent).output_text)
    story.expect_rows(read_item["fields"] == doc_fields("Onyx single", "Build, then tag."), read_item["creator"] == "Ada", read_item["version"] == 1)


def test_an_item_that_does_not_exist_is_refused_in_the_servers_words(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal("library show doc 99999", "there is no such item", actor=story.agent)


def test_versions_name_who_wrote_each_one_newest_first(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "doc", doc_fields("Opal versions"))
    server.send(tokens.editor, "PUT", f"/items/doc/{item_id}", {"fields": doc_fields("Opal versions", "Changed.")}, {"If-Match": '"1"'})
    story = connected(new_story, server, tokens.editor)
    story.expect_ordered_lines(f"library versions doc {item_id}", "version 2", "Grace", "version 1", "Ada", actor=story.agent)
    listed = json.loads(story.run(f"library versions doc {item_id} --json", actor=story.agent).output_text)["versions"]
    story.expect_rows([(change["version"], change["user"]) for change in listed] == [(2, "Grace"), (1, "Ada")])


def test_with_no_connection_each_read_refuses_in_plain_words(new_story):
    story = new_story(fixture=UserBuilder)
    for line in ("library list", "library show doc 1", "library versions doc 1"):
        story.expect_refusal(line, "This journal is not connected to a shared server.", actor=story.agent)


def test_a_stopped_connection_refuses_with_its_reason_and_opens_no_connection(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_success("library disconnect", actor=story.user)
    story.expect_refusal("library list", "Disconnected. Connect again to sync.", actor=story.agent)


def test_a_server_nobody_answers_at_gives_a_plain_refusal_for_each_read(new_story, tmp_path):
    with SharedServerBinary(tmp_path) as server:
        story = connected(new_story, server, server.new_user("Ada", "admin"))
    for line in ("library list", "library show doc 1", "library versions doc 1"):
        story.expect_refusal(line, "The library cannot be reached. Items you already got still work.", actor=story.agent)


def test_the_reads_write_no_row(new_story, shared_server):
    server, tokens = shared_server
    item_id = new_item(server, tokens.admin, "doc", doc_fields("Agate no rows"))
    story = connected(new_story, server, tokens.editor)
    stored_text = stored_texts(story)
    story.expect_text("library list --search agate", "Agate no rows", actor=story.agent)
    story.expect_text(f"library show doc {item_id}", "title: Agate no rows", actor=story.agent)
    story.expect_text(f"library versions doc {item_id}", "version 1", actor=story.agent)
    story.expect_rows(stored_texts(story) == stored_text)
