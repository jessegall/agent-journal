from core.modules.agents.migrations.m022_agent_number import AgentNumberMigration
from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.agents.support.numbered_agents import agent_numbers
from tests.stories.core.support.fixtures import MainEnvironment

ENVIRONMENTS = ("main", "shop", "depot")


def started(story: Story, session: str, role: str, environment: str) -> int:
    return story.new_row_id(f"agent start {session} claude {role} --environment {environment}")


def agent_rows(story: Story) -> list[tuple]:
    return [tuple(row) for row in story.container.get(Database).rows(Statement("SELECT * FROM agents ORDER BY id"))]


def migrated(story: Story) -> None:
    AgentNumberMigration().run(story.container.get(Database))


class AgentsWithoutNumbers(StoryFixture):
    """Three environments as a journal from before the number: main had three main sessions, shop has only two
    workers and never a main agent, depot has a main agent and two workers. No agent has a number."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.run("environment make shop /work/shop")
        story.run("environment make depot /work/depot")
        story.main_sessions = []
        for session in ("s-1", "s-2", "s-3"):
            story.main_sessions.append(started(story, session, "main", "main"))
            story.run(f"agent end {story.main_sessions[-1]}")
        story.shop_workers = [started(story, session, "worker", "shop") for session in ("s-4", "s-5")]
        story.depot_main = started(story, "s-6", "main", "depot")
        story.depot_workers = [started(story, session, "worker", "depot") for session in ("s-7", "s-8")]
        story.container.get(Database).update(Statement("UPDATE agents SET number = NULL"))

    def expect(self, story: Story) -> None:
        story.expect_rows(all(number is None for environment in ENVIRONMENTS for number in agent_numbers(story, environment).values()))


def test_the_migration_numbers_the_newest_main_one_and_every_other_row_in_the_order_it_was_made(new_story):
    story = new_story(fixture=AgentsWithoutNumbers)
    ids = [row[0] for row in agent_rows(story)]
    migrated(story)
    first_main, second_main, newest_main = story.main_sessions
    story.expect_rows(agent_numbers(story, "main") == {newest_main: 1, first_main: 2, second_main: 3})
    story.expect_rows(agent_numbers(story, "depot") == {story.depot_main: 1, story.depot_workers[0]: 2, story.depot_workers[1]: 3})
    story.expect_rows([row[0] for row in agent_rows(story)] == ids)


def test_the_migration_run_a_second_time_changes_no_row(new_story):
    story = new_story(fixture=AgentsWithoutNumbers)
    migrated(story)
    rows = agent_rows(story)
    migrated(story)
    story.expect_rows(agent_rows(story) == rows)


def test_an_environment_that_never_had_a_main_agent_numbers_from_two_and_its_first_main_is_one(new_story):
    story = new_story(fixture=AgentsWithoutNumbers)
    migrated(story)
    story.expect_rows(agent_numbers(story, "shop") == {story.shop_workers[0]: 2, story.shop_workers[1]: 3})
    first_main = started(story, "s-9", "main", "shop")
    story.expect_rows(agent_numbers(story, "shop")[first_main] == 1)
