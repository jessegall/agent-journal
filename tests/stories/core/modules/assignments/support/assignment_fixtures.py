from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined

WORKER_START = "agent start s-2 claude worker --environment main"
SECOND_PERSON = 'actor make user "Grace"'
CRATE = "crate 1"
PALLET = "pallet 1"


def worker(story: Story) -> Actor:
    """The worker agent CratesAndActors started: the actor made after Ada."""
    return Actor(story.user.id + 1, ActorType.AGENT)


def second_person(story: Story) -> Actor:
    """Grace, the person CratesAndActors made after Ada."""
    return Actor(story.user.id + 2, ActorType.USER)


class CratesAndActors(StoryFixture):
    """The main agent, a worker, the persons Ada and Grace, and one crate, one pallet and one shelf of the
    depot module, which the story names when it starts."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.run(WORKER_START)
        story.run(SECOND_PERSON)
        story.run('crate make "Bolts" --environment main', actor=story.user)
        story.run('pallet make "Planks" --environment main', actor=story.user)
        story.run('shelf make "Top shelf" --environment main', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("crate show 1", "title: Bolts", actor=story.user)
        story.expect_success("pallet show 1", "title: Planks", actor=story.user)
