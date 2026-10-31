from install.upgrade_journal import FINISHED_LINE, UpgradeJournal
from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_edit_moves_as_a_file_edit_of_the_agent_whose_session_made_it(new_story):
    story = upgraded_story(new_story)
    story.expect_success("file-edit show 1", "path: cart.py", "added: 11", "removed: 2")
    assert "journal.suites.coding: moved 2, already moved 0" in story.upgrade_text


def test_an_edit_made_by_no_agent_is_dropped_and_counted_and_one_of_an_unknown_session_is_skipped_and_named(new_story):
    story = upgraded_story(new_story)
    assert "dropped edits made by no agent: 1 rows" in story.upgrade_text
    assert "skipped edits 4: the agent that made it did not move" in story.upgrade_text


def test_a_second_run_moves_no_edit(new_story):
    story = upgraded_story(new_story)
    assert UpgradeJournal(story.home).run(confirmed=True).text == FINISHED_LINE
    story.expect_success("file-edit show 2", "path: totals.py")
    assert "id: 3" not in story.run("file-edit list").output_text.splitlines()
