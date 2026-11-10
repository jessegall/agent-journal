from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import MainEnvironment


class LoginUser(StoryFixture):
    """A person with login ada in main, with no agent started."""

    parent = MainEnvironment

    def steps(self, story) -> None:
        story.user = Actor(story.new_row_id('actor make user "ada"'), ActorType.USER)
