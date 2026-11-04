from core.base.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_changed_value


def test_of_two_running_main_agents_the_newest_is_the_one_told_and_an_ended_one_never(new_story):
    story = new_story(fixture=MainEnvironment)
    older = story.new_row_id("agent start s-1 claude main --environment main")
    newer = story.new_row_id("agent start s-2 claude main --environment main")
    queries = story.container.get(Queries)
    expect_id_agent_main(queries, 1, [newer])
    story.run(f"agent end {newer}")
    newest = MainAgentFinder.newest(queries, 1)
    expect_changed_value(newest, None)
    expect_id_newest(newest, older)


def expect_id_newest(newest, expected) -> None:
    actual = newest.id
    assert actual == expected, actual


def expect_id_agent_main(queries, number, expected) -> None:
    actual = [agent.id for agent in MainAgentFinder.rows(queries, number)]
    assert actual == expected, actual
