from core.base.actor import Actor
from engine.enums.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.ticks.agent_ticks import AgentTicks
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderHelper

RUNNING_READ = "ended_at IS NULL"
AGENT_COUNT = 4


class FourAgents(StoryFixture):
    """The builder's agent with three helpers under it."""

    parent = BuilderHelper

    def steps(self, story: Story) -> None:
        for session in ("sub-2", "sub-3"):
            story.expect_success(f"agent start {session} claude helper --parent {story.agent.id} --environment main")


def test_a_tick_with_four_agents_reads_one_row_set(new_story):
    story = new_story(fixture=FourAgents)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    AgentTicks()(story.container)
    cost = database.repeated_work.points().minus(start)
    rows_read = sum(rows for statement, rows in cost.statements.items() if "agents" in statement and RUNNING_READ in statement and "count(*)" not in statement)
    story.expect_rows(rows_read == AGENT_COUNT)


def test_running_agents_are_read_by_role_and_parent_and_an_ended_one_leaves(new_story):
    story = new_story(fixture=FourAgents)
    rows = story.container.get(AgentRows)
    story.expect_rows(len(rows.running()) == AGENT_COUNT, len(rows.running(AgentRole.HELPER)) == AGENT_COUNT - 1,
                      len(rows.running(AgentRole.HELPER, story.agent.id)) == AGENT_COUNT - 1, rows.running(AgentRole.MAIN)[0].id == story.agent.id,
                      rows.running(parent_id=story.helper.id) == ())
    story.container.get(Bus).run(EndAgent(story.helper.id), Actor.core())
    story.expect_rows(story.helper.id not in [agent.id for agent in rows.running()])
