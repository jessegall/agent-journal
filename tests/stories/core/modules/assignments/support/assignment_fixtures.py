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
    """Grace, the user CratesAndActors made after Ada."""
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


BAY_COUNT = 2
PARCELS_IN_A_BAY = 3


def chain_worker(story: Story, position: int) -> Actor:
    """One of the three workers YardWithBays started after Ada: position 1, 2 or 3."""
    return Actor(story.user.id + position, ActorType.AGENT)


def parcel_ids(bay_id: int) -> list[int]:
    """The ids of the parcels YardWithBays put in a bay: 1 to 3 in bay 1, 4 to 6 in bay 2."""
    first_id = (bay_id - 1) * PARCELS_IN_A_BAY + 1
    return list(range(first_id, first_id + PARCELS_IN_A_BAY))


class YardWithBays(StoryFixture):
    """The main agent, the user Ada, three workers, and one yard of two bays with three parcels in each,
    of the chain module, which the story names when it starts."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        for session in ("s-2", "s-3", "s-4"):
            story.run(f"agent start {session} claude worker --environment main")
        story.run('yard make "North yard" --environment main', actor=story.user)
        for bay_id in range(1, BAY_COUNT + 1):
            story.run(f'bay make 1 "Bay {bay_id}" --environment main', actor=story.user)
            for parcel_id in parcel_ids(bay_id):
                story.run(f'parcel make "Parcel {parcel_id}" --environment main', actor=story.user)
                story.run(f"bay-parcel make {bay_id} {parcel_id} --environment main", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("bay-parcel show 6", "bay_id: 2", "parcel_id: 6", actor=story.user)
