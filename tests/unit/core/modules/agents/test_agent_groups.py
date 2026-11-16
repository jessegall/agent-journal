import json

from engine.agent.groups.agent_group import AgentGroup
from engine.agent.groups.agent_group_book import AgentGroupBook
from engine.agent.groups.agent_group_entry import AgentGroupEntry
from tests.stories.support.story_checks import expect_value


def helper_groups(story) -> dict[str, str]:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    return {row["profile"]: row["group"] for row in next(row for row in rows if row["key"] == "helper")["profiles"]}


def entries(*groups: AgentGroup) -> tuple[AgentGroupEntry, ...]:
    return tuple(AgentGroupEntry.declared("journal.test", group) for group in groups)


def test_s49_a_profile_in_two_groups_or_two_catch_all_groups_is_a_problem():
    book = AgentGroupBook(entries(AgentGroup("a", "A", "helper", ("p",)), AgentGroup("b", "B", "helper", ("p",)), AgentGroup("c", "C", "helper"), AgentGroup("d", "D", "helper")))
    problems = list(book.problems(frozenset({"helper"})))
    expect_value(len(problems), 2)


def test_s49_a_group_of_an_unregistered_type_or_declared_twice_is_a_problem():
    book = AgentGroupBook(entries(AgentGroup("a", "A", "ghost"), AgentGroup("a", "A", "helper")))
    expect_value(len(list(book.problems(frozenset({"helper"})))), 2)


def test_s49_a_stored_group_without_profiles_reads_back_with_none():
    expect_value(AgentGroupEntry.restored({"module": "m", "key": "k", "label": "K", "agent_type": "helper"}).profiles, ())
