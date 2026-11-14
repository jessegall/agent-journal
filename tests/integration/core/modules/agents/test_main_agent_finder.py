from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.query.queries import Queries
from engine.scope.scopes import Scopes


def expect_id_agent_main(queries, expected) -> None:
    actual = [agent.id for agent in MainAgentFinder.rows(queries)]
    assert actual == expected, actual


def test_a_newer_main_agent_replaces_the_older_and_an_ended_one_is_never_found(journal):
    journal.run("agent start s-1 claude main --environment main")
    newer = journal.new_row_id("agent start s-2 claude main --environment main")
    queries = journal.container.get(Queries)
    with journal.container.get(Scopes).read_scope((), None, 1):
        expect_id_agent_main(queries, [newer])
    journal.run(f"agent end {newer}")
    with journal.container.get(Scopes).read_scope((), None, 1):
        newest = MainAgentFinder.newest(queries)
    assert newest is None
