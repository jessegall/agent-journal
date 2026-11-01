import json

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_agent_moves_with_its_session_program_and_role(new_story):
    story = upgraded_story(new_story)
    listing = story.run("agent list").output_text
    assert "s-1" in listing and "claude" in listing and "main" in listing


def test_the_work_of_an_agent_names_its_new_actor(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("task show 2", f"creator_id: {agent}")


def test_an_agent_with_a_role_version_5_does_not_know_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    assert "skipped agents 2: role ghost-role" in story.upgrade_text and "s-2" not in story.run("agent list").output_text


def test_a_version_4_agent_with_no_role_moves_as_a_main_session_and_its_question_moves_with_it(new_story):
    story = upgraded_story(new_story)
    story.expect_text("agent list --json", '"session": "s-early"', '"role": "main"')
    story.expect_text("question show 4", "What did the early session ask?")


def test_a_session_that_made_rows_but_has_no_version_4_agent_row_moves_as_an_ended_main_session_with_its_question(new_story):
    story = upgraded_story(new_story)
    story.expect_text("agent list --json", '"session": "s-gone"')
    story.expect_text("question show 5", "What did the session with no row ask?")
    assert "skipped questions 5" not in story.upgrade_text
    assert "4 sessions that made rows but had no version 4 agent row moved as ended agents" in story.upgrade_text


def test_a_worker_session_with_no_agent_row_moves_as_an_ended_worker_with_the_program_it_was_sent_with(new_story):
    story = upgraded_story(new_story)
    worker = next(agent for agent in json.loads(story.run("agent list --json").output_text)["rows"] if agent["session"] == "s-3")
    assert worker["role"] == "worker" and worker["program"] == "claude", worker


def test_a_main_session_with_no_agent_row_takes_the_program_of_its_subagents(new_story):
    story = upgraded_story(new_story)
    main = next(agent for agent in json.loads(story.run("agent list --json").output_text)["rows"] if agent["session"] == "s-gone")
    assert main["role"] == "main" and main["program"] == "codex", main


def test_a_session_with_no_agent_row_that_wrote_in_two_environments_moves_into_the_one_of_its_first_row(new_story):
    story = upgraded_story(new_story)
    main = next(agent for agent in json.loads(story.run("agent list --json").output_text)["rows"] if agent["session"] == "s-gone")
    assert main["environment_id"] == 1, main
