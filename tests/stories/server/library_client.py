import shutil
from collections.abc import Callable
import pytest

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.errors.library_denied_error import LibraryDeniedError
from core.modules.library.errors.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.errors.library_rejected_error import LibraryRejectedError
from core.modules.library.errors.library_stale_error import LibraryStaleError
from core.modules.library.errors.library_stopped_error import LibraryStoppedError
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError
from core.modules.messages.commands.read_message.read_message import ReadMessage
from engine.testing.stories.story import Story
from tests.stories.core.modules.library.support.saved_connection import saved_connection
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.stub_server import StubAnswer, StubServer

__all__ = ["private_folder"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

DOC_FIELDS = {"title": "Release checklist", "abstract": "What to do before a release", "body": "Tag first."}
NEWER_FIELDS = {"title": "Release checklist", "abstract": "What to do before a release", "body": "Build, then tag."}
JSON_HEADERS = {"Content-Type": "application/json"}
LARGEST_BODY_BYTES = 2 << 20


def read_client(story: Story) -> LibraryClient:
    return story.container.get(LibraryClient)


def read_outcome(call: Callable[[], object]) -> object:
    try:
        return call()
    except (LibraryStoppedError, LibraryUnreachableError, LibraryDeniedError, LibraryRejectedError, LibraryItemRemovedError, LibraryStaleError) as failure:
        return failure


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
