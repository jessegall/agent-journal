from core.base.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from tests.stories.core.support.fixtures import MainEnvironment


def test_of_two_running_main_agents_the_newest_is_the_one_told_and_an_ended_one_never(new_story):
    story = new_story(fixture=MainEnvironment)
    older = story.new_row_id("agent start s-1 claude main --environment main")
    newer = story.new_row_id("agent start s-2 claude main --environment main")
    queries = story.container.get(Queries)
    assert [agent.id for agent in MainAgentFinder.rows(queries, 1)] == [newer]
    story.run(f"agent end {newer}")
    newest = MainAgentFinder.newest(queries, 1)
    assert newest is not None and newest.id == older
