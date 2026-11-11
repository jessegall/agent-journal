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


SECTION_COUNT = 2
PIECES_IN_A_SECTION = 3


def chain_worker(story: Story, position: int) -> Actor:
    """One of the three workers LotWithSections started after Ada: position 1, 2 or 3."""
    return Actor(story.user.id + position, ActorType.AGENT)


def piece_ids(section_id: int) -> list[int]:
    """The ids of the pieces LotWithSections put in a section: 1 to 3 in section 1, 4 to 6 in section 2."""
    first_id = (section_id - 1) * PIECES_IN_A_SECTION + 1
    return list(range(first_id, first_id + PIECES_IN_A_SECTION))


class LotWithSections(StoryFixture):
    """The main agent, the person Ada, three workers, and one lot of two sections with three pieces in each,
    of the chain module, which the story names when it starts."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        for session in ("s-2", "s-3", "s-4"):
            story.run(f"agent start {session} claude worker --environment main")
        story.run('lot make "North yard" --environment main', actor=story.user)
        for section_id in range(1, SECTION_COUNT + 1):
            story.run(f'section make 1 "Section {section_id}" --environment main', actor=story.user)
            for piece_id in piece_ids(section_id):
                story.run(f'piece make "Piece {piece_id}" --environment main', actor=story.user)
                story.run(f"section-piece make {section_id} {piece_id} --environment main", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success("section-piece show 6", "section_id: 2", "piece_id: 6", actor=story.user)
