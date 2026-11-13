import json
from pathlib import Path

from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.reviews.support.review_fixtures import OneReviewerAllowed
from tests.stories.core.support.coding_fixtures import UserBuilder

SOURCE = Path(__file__).resolve().parents[4] / "src"
MERGER_START = 'helper start journal-merger --brief "Merge the finished workers" --environment main'
RETIRED_ENUMS = ("HelperRole", "CodingHelperRole")


def agent_rows(story, role: str) -> list[dict]:
    return json.loads(story.run(f"agent list --role {role} --json --limit 50 --environment main", actor=story.user).output_text)["rows"]


def limits_group(story, role: str, profile: str) -> str:
    rows = json.loads(story.run("agent limits --json --environment main", actor=story.agent).output_text)["rows"]
    profiles = next(row for row in rows if row["key"] == role)["profiles"]
    return next(entry["group"] for entry in profiles if entry["profile"] == profile)


class MergerStarted(StoryFixture):
    """A main agent that started the merger for merging, through the shipped merger profile."""

    parent = UserBuilder

    def steps(self, story) -> None:
        launcher = FakeLauncher.accepting(story.home.socket("launcher"))
        story.run(MERGER_START, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()

    def expect(self, story) -> None:
        story.expect_text("agent list --environment main", "journal-merger", actor=story.user)


def test_an_agent_started_for_merging_has_the_merger_key(new_story):
    story = new_story(fixture=MergerStarted)
    mergers = agent_rows(story, "merger")
    story.expect_rows([row["profile"] for row in mergers] == ["journal-merger"], agent_rows(story, "helper") == [])


def test_the_merger_runs_its_commands_and_the_main_agent_does_not(new_story):
    story = new_story(fixture=MergerStarted)
    merger = story.agent_actor(agent_rows(story, "merger")[0]["id"])
    story.expect_success("merger next --environment main", actor=merger)
    story.expect_refusal("merger next --environment main", "only the merger runs this", actor=story.agent)


def test_the_merger_is_shown_in_the_merger_group(new_story):
    story = new_story(fixture=MergerStarted)
    story.expect_rows(limits_group(story, "merger", "journal-merger") == "merger")


def test_a_reviewer_is_a_helper_with_the_reviewer_profile(new_story):
    story = new_story(fixture=OneReviewerAllowed)
    reviewer = story.new_row_id("reviewer add --environment main", actor=story.agent)
    story.expect_rows([row["id"] for row in agent_rows(story, "helper") if row["profile"] == "journal-reviewer"] == [reviewer])
    story.expect_text("reviewer list --environment main", "reviewers: 1", actor=story.agent)


def test_no_source_file_names_the_retired_role_enums(new_story):
    story = new_story(fixture=UserBuilder)
    naming = [str(path.relative_to(SOURCE)) for path in SOURCE.rglob("*.py") if any(name in path.read_text() for name in RETIRED_ENUMS)]
    story.expect_rows(naming == [], detail=str(naming))


def test_the_coding_suite_names_no_reviewer_or_verifier_driver_and_the_keys_are_gone(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_no_text("suite show coding --environment main", "coding.reviewer", "coding.verifier", actor=story.user)
    story.expect_usage_error("agent start v-1 claude verifier --environment main")
