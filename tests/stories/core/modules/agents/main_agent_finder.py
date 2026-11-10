from engine.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_newer_main_agent_replaces_the_older_and_an_ended_one_is_never_found(new_story):
    story = new_story(fixture=MainEnvironment)
    story.run("agent start s-1 claude main --environment main")
    newer = story.new_row_id("agent start s-2 claude main --environment main")
    queries = story.container.get(Queries)
    with story.container.get(Scopes).read_scope((), None, 1):
        expect_id_agent_main(queries, [newer])
    story.run(f"agent end {newer}")
    with story.container.get(Scopes).read_scope((), None, 1):
        newest = MainAgentFinder.newest(queries)
    story.expect_rows(newest is None)


def expect_id_agent_main(queries, expected) -> None:
    actual = [agent.id for agent in MainAgentFinder.rows(queries)]
    assert actual == expected, actual
