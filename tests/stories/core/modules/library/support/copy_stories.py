from dataclasses import dataclass, replace
from pathlib import Path

import pytest

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from core.testing.template_databases import TemplateDatabases
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.shared_server_binary import SharedServerBinary


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
    story = new_story(module, fixture=UserBuilder) if module else new_story(fixture=UserBuilder)
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story


def made_copy(story: Story, server: SharedServerBinary, token: str, title: str) -> LibraryCopy:
    item_id = new_item(server, token, title)
    story.expect_text(f"library get doc {item_id}", f"library doc {item_id}, version 1 is now doc ", actor=story.user)
    return item_copy(story, item_id)


def item_copy(story: Story, item_id: int) -> LibraryCopy:
    return story.container.get(Queries).query(LibraryCopy).filter(share="doc", item_id=item_id).first()


def copy_with(story: Story, copy: LibraryCopy, **values: object) -> None:
    story.container.get(Repository).save(replace(copy, **values), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def connection_with(story: Story, **values: object) -> None:
    connection = story.container.get(Queries).query(LibraryConnection).first()
    story.container.get(Repository).save(replace(connection, **values), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def copy_line(story: Story, copy: LibraryCopy) -> str:
    return next(line for line in story.run("library copies", story.agent).output_text.splitlines() if line.startswith(f"copy {copy.id}:"))


def server_change(server: SharedServerBinary, token: str, item_id: int, title: str, body: str, version: int) -> None:
    code = server.send(token, "PUT", f"/items/doc/{item_id}", {"fields": doc_fields(title, body)}, {"If-Match": f'"{version}"'})[0]
    assert code == 200


def second_story(templates: TemplateDatabases, folder: Path) -> Story:
    return templates.story(folder, (), UserBuilder)


def connected_second(story: Story, server: SharedServerBinary, token: str) -> Story:
    story.expect_text(f"library connect {server.address} --token {token}", "Connected: ", actor=story.user)
    return story
