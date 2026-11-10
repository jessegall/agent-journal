import json

from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text, expect_upgrade_without_text
from core.testing.expect_row import expect_row


def test_the_work_of_an_agent_names_its_new_actor(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("task show 2", f"creator_id: {agent}")


def test_a_session_that_made_rows_but_has_no_version_4_agent_row_moves_as_an_ended_main_session_with_its_question(new_story):
    story = upgraded_story(new_story)
    story.expect_text("agent list --json", '"session": "s-gone"')
    story.expect_text("question show 5", "What did the session with no row ask?")
    expect_upgrade_without_text(story, "skipped questions 5")
    expect_upgrade_text(story, "4 sessions that made rows but had no version 4 agent row moved as ended agents")
