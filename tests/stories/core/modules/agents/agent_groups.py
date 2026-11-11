import json

from engine.agent.agent_group import AgentGroup
from engine.agent.agent_group_book import AgentGroupBook
from engine.agent.agent_group_entry import AgentGroupEntry
from engine.registry.registry import Registry
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value


def helper_groups(story) -> dict[str, str]:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    return {row["profile"]: row["group"] for row in next(row for row in rows if row["key"] == "helper")["profiles"]}


def test_s49_the_coding_suite_shows_each_special_helper_profile_in_its_own_group(new_story):
    story = new_story(fixture=UserBuilder)
    groups = helper_groups(story)
    expect_value((groups["journal-merger"], groups["journal-designer"], groups["journal-researcher"]), ("merger", "designer", "helpers"))


def test_s49_every_profile_is_in_exactly_one_group(new_story):
    story = new_story(fixture=UserBuilder)
    book = story.container.get(Registry).agent_group_book()
    expect_value([book.group("worker", "journal-worker").key, book.group("helper", "journal-merger").key, book.group("helper", "anything").key], ["workers", "merger", "helpers"])


def entries(*groups: AgentGroup) -> tuple[AgentGroupEntry, ...]:
    return tuple(AgentGroupEntry.declared("journal.test", group) for group in groups)


def test_s49_a_profile_in_two_groups_or_two_catch_all_groups_is_a_problem():
    book = AgentGroupBook(entries(AgentGroup("a", "A", "helper", tuple(["p"])), AgentGroup("b", "B", "helper", tuple(["p"])), AgentGroup("c", "C", "helper"), AgentGroup("d", "D", "helper")))
    problems = list(book.problems(frozenset({"helper"})))
    expect_value(len(problems), 2)


def test_s49_a_group_of_an_unregistered_type_or_declared_twice_is_a_problem():
    book = AgentGroupBook(entries(AgentGroup("a", "A", "ghost"), AgentGroup("a", "A", "helper")))
    expect_value(len(list(book.problems(frozenset({"helper"})))), 2)


def test_s49_a_stored_group_without_profiles_reads_back_with_none():
    expect_value(AgentGroupEntry.restored({"module": "m", "key": "k", "label": "K", "agent_type": "helper"}).profiles, ())
