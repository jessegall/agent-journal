import json

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text, expect_upgrade_without_text
from core.testing.expect_row import expect_row


def test_a_version_4_agent_moves_with_its_session_program_and_role(new_story):
    story = upgraded_story(new_story)
    listing = story.run("agent list")
    listing.expect_text("s-1")
    listing.expect_text("claude")
    listing.expect_text("main")


def test_the_work_of_an_agent_names_its_new_actor(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("task show 2", f"creator_id: {agent}")


def test_an_agent_with_a_role_version_5_does_not_know_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "skipped agents 2: role ghost-role")
    story.expect_no_text("agent list", "s-2")


def test_a_version_4_agent_with_no_role_moves_as_a_main_session_and_its_question_moves_with_it(new_story):
    story = upgraded_story(new_story)
    story.expect_text("agent list --json", '"session": "s-early"', '"role": "main"')
    story.expect_text("question show 4", "What did the early session ask?")


def test_a_session_that_made_rows_but_has_no_version_4_agent_row_moves_as_an_ended_main_session_with_its_question(new_story):
    story = upgraded_story(new_story)
    story.expect_text("agent list --json", '"session": "s-gone"')
    story.expect_text("question show 5", "What did the session with no row ask?")
    expect_upgrade_without_text(story, "skipped questions 5")
    expect_upgrade_text(story, "4 sessions that made rows but had no version 4 agent row moved as ended agents")


def test_a_worker_session_with_no_agent_row_moves_as_an_ended_worker_with_the_program_it_was_sent_with(new_story):
    story = upgraded_story(new_story)
    worker = next(agent for agent in json.loads(story.run("agent list --json").output_text)["rows"] if agent["session"] == "s-3")
    expect_row(worker, role="worker")
    expect_row(worker, program="claude")


def test_a_main_session_with_no_agent_row_takes_the_program_of_its_subagents(new_story):
    story = upgraded_story(new_story)
    main = next(agent for agent in json.loads(story.run("agent list --json").output_text)["rows"] if agent["session"] == "s-gone")
    expect_row(main, role="main")
    expect_row(main, program="codex")


def test_a_session_with_no_agent_row_that_wrote_in_two_environments_moves_into_the_one_of_its_first_row(new_story):
    story = upgraded_story(new_story)
    main = next(agent for agent in json.loads(story.run("agent list --json").output_text)["rows"] if agent["session"] == "s-gone")
    expect_row(main, environment_id=1)
