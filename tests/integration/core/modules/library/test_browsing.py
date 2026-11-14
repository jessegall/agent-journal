import json
import shutil
from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.modules.library.support.stored_text import stored_texts
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.shared_server_binary import SharedServerBinary
from tests.integration.support.fixture_journal import FixtureJournal

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


def connected(played, server: SharedServerBinary, token: str) -> FixtureJournal:
    story = played(UserBuilder)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story








def test_an_item_that_has_a_local_copy_names_it_and_the_others_do_not(played, shared_server):
    server, tokens = shared_server
    followed = new_item(server, tokens.admin, "doc", doc_fields("Jasper copy followed"))
    loose = new_item(server, tokens.admin, "doc", doc_fields("Jasper copy loose"))
    story = connected(played, server, tokens.editor)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    copy = story.container.get(Repository).save(LibraryCopy(creator_id=story.user.id, share="doc", item_id=followed, row_id=1, base_version=1, base_digest="digest"), context)
    rows = {row["id"]: row for row in json.loads(story.run("library list --search jasper --json", actor=story.agent).output_text)["rows"]}
    story.expect_rows(rows[followed]["copy_id"] == copy.id, rows[loose]["copy_id"] is None)
    story.expect_text("library list --search jasper", f"Jasper copy followed  Ada  ", f"copy {copy.id}", actor=story.agent)














