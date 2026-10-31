from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_finished_command_output_moves_as_a_finished_process_under_its_number_with_its_output(new_story):
    story = upgraded_story(new_story)
    story.expect_success("process show 1", "state: finished", "line: pytest tests", "exit_code: 0")
    story.expect_success("output show 1", "state: pruned", "read_at: 2026-01-01T00:00:00.000000+00:00")


def test_a_failed_a_stopped_and_a_never_ended_command_output_keep_how_they_ended(new_story):
    story = upgraded_story(new_story)
    story.expect_success("process show 2", "state: failed", "exit_code: 2")
    story.expect_success("process show 3", "state: orphaned")
    story.expect_success("process show 4", "state: stopped")


def test_a_command_output_of_an_unknown_session_is_skipped_and_named(new_story):
    story = upgraded_story(new_story)
    assert "skipped command_outputs 5: the agent that ran it or its environment did not move" in story.upgrade_text
    assert "processes: moved 4" in story.upgrade_text


def test_the_readers_reports_and_suggestions_are_dropped_and_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped reader_reports: 1 rows" in story.upgrade_text and "dropped reader_suggestions: 1 rows" in story.upgrade_text
