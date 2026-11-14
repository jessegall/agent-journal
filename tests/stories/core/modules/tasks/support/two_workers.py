from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder

TASK_COUNT = 4


class TwoWorkersFourTasks(StoryFixture):
    """The main agent, the user Ada, the workers W and V, and four open tasks that nobody is assigned to."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run("agent start s-2 claude worker --environment main")
        story.run("agent start s-3 claude worker --environment main")
        for number in range(1, TASK_COUNT + 1):
            story.run(f'task make "Job {number}" --brief "Do job {number}" --environment main', actor=story.agent)


def worker_w(story: Story) -> Actor:
    return Actor(story.user.id + 1, ActorType.AGENT)


def worker_v(story: Story) -> Actor:
    return Actor(story.user.id + 2, ActorType.AGENT)


def assign(story: Story, task_id: int, actor: Actor) -> None:
    story.expect_success(f"assign task {task_id} --to {actor.id} --environment main", actor=story.user)
