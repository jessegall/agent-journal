import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder


def listed(story: Story, environment: str = "main") -> dict[int, dict]:
    rows = json.loads(story.run(f"agent list --environment {environment} --json", actor=story.user).output_text)["rows"]
    return {row["id"]: row for row in rows}


def worker_of(story: Story, environment: str) -> int:
    return next(agent_id for agent_id, row in listed(story, environment).items() if row["role"] == "worker")


def main_of(story: Story, environment: str) -> Actor:
    return Actor(next(agent_id for agent_id, row in listed(story, environment).items() if row["role"] == "main"), ActorType.AGENT)


def started_worker(story: Story, session: str, environment: str, parent_id: int) -> int:
    return story.new_row_id(f"agent start {session} claude worker --parent {parent_id} --environment {environment}")


class TwoEnvironments(StoryFixture):
    """Main has its main agent, number 1, and a worker, number 2; shop has its own main, number 1, and
    worker, number 2."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.run("environment make shop /work/shop")
        started_worker(story, "s-2", "main", story.agent.id)
        shop_main_id = story.new_row_id("agent start s-3 claude main --environment shop")
        started_worker(story, "s-4", "shop", shop_main_id)

    def expect(self, story: Story) -> None:
        story.expect_success("environment show 2", "name: shop")


class ShopWithThreeAgents(StoryFixture):
    """Two environments, and shop has a second worker, number 3, a number main does not have."""

    parent = TwoEnvironments

    def steps(self, story: Story) -> None:
        started_worker(story, "s-5", "shop", main_of(story, "shop").id)

    def expect(self, story: Story) -> None:
        story.expect_rows(len(listed(story, "shop")) == 3, len(listed(story, "main")) == 2)
