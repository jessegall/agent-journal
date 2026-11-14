import json

from tests.stories.engine.upgrade.support.fixture_upgrade import expect_upgrade_text, expect_upgrade_without_text
from engine.testing.expectations.expect_row import expect_row


def test_the_work_of_an_agent_names_its_new_actor(upgraded):
    story = upgraded
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("task show 2", f"creator_id: {agent}")


def test_a_session_that_made_rows_but_has_no_version_4_agent_row_moves_as_a_past_session_of_the_main_agent_with_its_question(upgraded):
    story = upgraded
    story.expect_rows('"session": "s-gone"' not in story.run("agent list --json").output_text)
    story.expect_text("question show 5", "What did the session with no row ask?")
    expect_upgrade_without_text(story, "skipped questions 5")
    expect_upgrade_text(story, "4 sessions that made rows but had no version 4 agent row moved as ended agents")


def test_each_environment_keeps_one_main_agent_with_its_older_main_sessions_as_past_sessions(upgraded):
    story = upgraded
    main_agents = json.loads(story.run("agent list --role main --json").output_text)["rows"]
    environments = [row["environment_id"] for row in main_agents]
    story.expect_rows(len(environments) == len(set(environments)), detail=str(main_agents))
