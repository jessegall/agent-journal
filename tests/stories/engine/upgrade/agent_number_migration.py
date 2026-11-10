from core.modules.agents.migrations.m022_agent_number import AgentNumberMigration
from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.agents.support.numbered_agents import agent_numbers
from tests.stories.core.support.fixtures import MainEnvironment

ENVIRONMENTS = ("main", "shop", "depot")
MAIN_SESSIONS = ("s-1", "s-2", "s-3")
SHOP_WORKER_SESSIONS = ("s-4", "s-5")
DEPOT_MAIN_SESSION = "s-6"
DEPOT_WORKER_SESSIONS = ("s-7", "s-8")


def started(story: Story, session: str, role: str, environment: str) -> int:
    return story.new_row_id(f"agent start {session} claude {role} --environment {environment}")


def agent_rows(story: Story) -> list[tuple]:
    return [tuple(row) for row in story.container.get(Database).rows(Statement("SELECT * FROM agents ORDER BY id"))]


def agent_ids(story: Story, sessions: tuple[str, ...]) -> list[int]:
    rows = {row["session"]: row["id"] for row in story.container.get(Database).rows(Statement("SELECT id, session FROM agents ORDER BY id"))}
    return [rows[session] for session in sessions]


def migrated(story: Story) -> None:
    AgentNumberMigration().run(story.container.get(Database))


class AgentsWithoutNumbers(StoryFixture):
    """Three environments as a journal from before the number: main had three main sessions, each a row of
    its own as a main session was then, shop has only two
    workers and never a main agent, depot has a main agent and two workers. No agent has a number."""

    parent = MainEnvironment

    def steps(self, story: Story) -> None:
        story.run("environment make shop /work/shop")
        story.run("environment make depot /work/depot")
        for session in MAIN_SESSIONS:
            story.run(f"agent end {started(story, session, 'worker', 'main')}")
        story.container.get(Database).update(Statement("UPDATE agents SET role = 'main' WHERE session IN ('s-1', 's-2', 's-3')"))
        for session in SHOP_WORKER_SESSIONS:
            started(story, session, "worker", "shop")
        started(story, DEPOT_MAIN_SESSION, "main", "depot")
        for session in DEPOT_WORKER_SESSIONS:
            started(story, session, "worker", "depot")
        story.container.get(Database).update(Statement("UPDATE agents SET number = NULL"))

    def expect(self, story: Story) -> None:
        story.expect_rows(all(number is None for environment in ENVIRONMENTS for number in agent_numbers(story, environment).values()))


def test_the_migration_numbers_the_newest_main_one_and_every_other_row_in_the_order_it_was_made(new_story):
    story = new_story(fixture=AgentsWithoutNumbers)
    ids = [row[0] for row in agent_rows(story)]
    migrated(story)
    first_main, second_main, newest_main = agent_ids(story, MAIN_SESSIONS)
    depot_main, first_depot_worker, second_depot_worker = agent_ids(story, (DEPOT_MAIN_SESSION, *DEPOT_WORKER_SESSIONS))
    story.expect_rows(agent_numbers(story, "main") == {newest_main: 1, first_main: 2, second_main: 3})
    story.expect_rows(agent_numbers(story, "depot") == {depot_main: 1, first_depot_worker: 2, second_depot_worker: 3})
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
    first_worker, second_worker = agent_ids(story, SHOP_WORKER_SESSIONS)
    story.expect_rows(agent_numbers(story, "shop") == {first_worker: 2, second_worker: 3})
    first_main = started(story, "s-9", "main", "shop")
    story.expect_rows(agent_numbers(story, "shop")[first_main] == 1)
