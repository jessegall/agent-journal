from install.upgrade_journal import UpgradeJournal
from tests.stories.core.upgrade.upgrade import upgrade, upgrading
from tests.stories.core.upgrade.support.move_samples import PATH

NOTES, TAGS, FAILS_ONCE = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:FailsOnceTagsModule"


def test_the_dry_run_prints_what_would_move_as_a_plain_table_and_says_nothing_was_written(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    text = UpgradeJournal(story.home).run(dry_run=True).text
    lines = text.splitlines()
    assert lines[0] == "what would move" and lines[1].split() == ["module", "rows", "left", "behind"]
    assert any(line.split()[:2] == ["movenotes", "2"] and "note_drafts: 1 rows" in line for line in lines)
    assert any(line.split()[:2] == ["movetags", "2"] for line in lines)
    assert "tables no module claims" in lines and any(line.split()[:2] == ["old_reports", "1"] for line in lines)
    assert lines[-1] == "nothing was written"


def test_the_upgrade_prints_the_same_as_what_moved_and_the_path_of_the_backup(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    text = upgrade(story).text
    lines = text.splitlines()
    assert "what moved" in lines and any(line.startswith("backup: ") for line in lines)
    assert any(line.split()[:2] == ["movenotes", "2"] for line in lines) and "nothing was written" not in lines


def test_a_failed_upgrade_says_which_module_failed_what_rolled_back_what_stayed_moved_and_how_to_finish(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    outcome = upgrade(story)
    lines = outcome.text.splitlines()
    assert outcome.code == 1
    assert "failed: movetags (the tags table could not be read)" in lines and "rolled back: movetags" in lines
    assert any(line.startswith("stayed moved: ") and "movenotes" in line and "movetags" not in line for line in lines)
    assert lines[-1] == "run journal upgrade again to finish"


def test_the_report_is_saved_and_a_rerun_replaces_it_keeping_the_earlier_one(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    first = upgrade(story)
    saved = story.home.folder / "upgrade-report.txt"
    assert saved.read_text().strip() == first.text.strip()
    second = upgrade(story)
    assert second.code == 0 and saved.read_text().strip() == second.text.strip()
    assert (story.home.folder / "upgrade-report.1.txt").read_text().strip() == first.text.strip()


def test_the_first_start_after_an_upgrade_shows_one_chat_mark_with_the_counts_and_a_second_start_shows_none(new_story):
    from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text
    from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story

    story = upgraded_story(new_story)
    story.run_listeners()
    assert mark_count(story) >= 1
    text = marks_text(story)
    assert "Upgraded from version 4: 3 tasks, 3 plans, 2 messages, 4 memories moved" in text, text
    before = mark_count(story)
    story.run_listeners()
    assert mark_count(story) == before
    UpgradeJournal(story.home).run(confirmed=True)
    story.run_listeners()
    assert mark_count(story) == before
