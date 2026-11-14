import json

from engine.agent.groups.agent_group import AgentGroup
from engine.agent.groups.agent_group_book import AgentGroupBook
from engine.agent.groups.agent_group_entry import AgentGroupEntry
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value
from suites.coding.support.shipped_profiles import DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE


def helper_groups(story) -> dict[str, str]:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    return {row["profile"]: row["group"] for row in next(row for row in rows if row["key"] == "helper")["profiles"]}


def test_s49_the_coding_suite_shows_each_special_helper_profile_in_its_own_group(new_story):
    story = new_story(fixture=UserBuilder)
    groups = helper_groups(story)
    expect_value((groups[f"{DESIGNER_PROFILE.name}"], groups[f"{RESEARCHER_PROFILE.name}"]), ("designer", "helpers"))
    story.expect_agent_group("merger", f"{MERGER_PROFILE.name}", "merger")


def test_s49_every_profile_is_in_exactly_one_group(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_agent_group("worker", f"{WORKER_PROFILE.name}", "workers")
    story.expect_agent_group("merger", f"{MERGER_PROFILE.name}", "merger")
    story.expect_agent_group("helper", "anything", "helpers")


def entries(*groups: AgentGroup) -> tuple[AgentGroupEntry, ...]:
    return tuple(AgentGroupEntry.declared("journal.test", group) for group in groups)


