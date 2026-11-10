from tests.stories.engine.upgrade.support.fixture_upgrade import (
    expect_output_without_line,
    expect_upgrade_finished,
    expect_upgrade_text,
    expect_upgrade_without_text,
    upgraded_story,
)


def test_an_edit_made_by_no_agent_is_dropped_and_counted_and_one_of_a_session_with_no_agent_row_moves(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "dropped edits made by no agent: 1 rows")
    expect_upgrade_without_text(story, "skipped edits 4")


def test_a_second_run_moves_no_edit(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_finished(story)
    story.expect_success("file-edit show 2", "path: totals.py")
    expect_output_without_line(story, "file-edit list", "id: 3")
