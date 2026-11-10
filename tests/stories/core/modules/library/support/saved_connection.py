from engine.actor.actor import Actor
from engine.command.context import Context
from engine.private.secret_values import SecretValues
from engine.repository.repository import Repository
from core.modules.library.models.library_connection import LibraryConnection
from core.modules.library.support.library_address import ADDRESS_SETTING, LibraryAddress
from core.modules.library.support.library_client import TOKEN_VARIABLE
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


def saved_connection(new_story, address: str, token: str, stopped: str = "", fixture: type[StoryFixture] = UserJoined) -> Story:
    story = new_story(fixture=fixture)
    story.expect_success(f"setting set {ADDRESS_SETTING} {address} --project", actor=story.user)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    story.container.get(Repository).save(LibraryConnection(creator_id=story.user.id, server_key="b3f1c9d2", address=LibraryAddress(address).base, name="Team", stopped=stopped), context)
    story.container.get(SecretValues).put(TOKEN_VARIABLE, token, True, 0)
    return story
