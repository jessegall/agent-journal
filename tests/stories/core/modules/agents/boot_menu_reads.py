import json

import pytest

from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.samples import SAMPLES

WORKER_ROWS = 1001


def read_rows(story, line: str) -> list[dict[str, object]]:
    return json.loads(story.run(f"{line} --json").output_text)["rows"]


@pytest.fixture
def multi_agent_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    for number in range(WORKER_ROWS):
        story.run(f"agent start worker-{number} claude worker --environment main")
    story.ended_main_id = story.new_row_id("agent start s-old claude main --environment main")
    story.run(f"agent end {story.ended_main_id}")
    story.main_id = story.new_row_id("agent start s-new claude main --environment main")
    story.run("agent start s-codex codex worker --environment main")
    return story


def test_the_environment_menu_says_a_main_runs_past_a_thousand_agent_rows(multi_agent_story):
    rows = read_rows(multi_agent_story, "environment menu")
    multi_agent_story.expect_rows([(row["name"], row["suite"], row["main_running"]) for row in rows] == [("main", "samples", True)])


def test_the_running_mains_are_named_past_a_thousand_agent_rows(multi_agent_story):
    rows = read_rows(multi_agent_story, "agent running-main-agents --environment main")
    multi_agent_story.expect_rows([row["id"] for row in rows] == [multi_agent_story.main_id])


def test_the_main_sessions_of_a_program_come_newest_first_with_no_worker(multi_agent_story):
    rows = read_rows(multi_agent_story, "agent main-sessions claude --environment main")
    multi_agent_story.expect_rows([row["session"] for row in rows] == ["s-new", "s-old"])


def test_the_environment_menu_says_no_main_runs_once_it_ended(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    main_id = story.new_row_id("agent start s-1 claude main --environment main")
    story.run(f"agent end {main_id}")
    story.expect_rows([row["main_running"] for row in read_rows(story, "environment menu")] == [False])


def test_the_environment_menu_shows_the_suite_an_environment_chose(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.run("environment make second /work/second")
    story.run("suite choose samples --environment second")
    story.expect_rows([row["suite"] for row in read_rows(story, "environment menu")] == ["samples", "samples"])
