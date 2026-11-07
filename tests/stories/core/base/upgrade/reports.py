from install.upgrade_journal import UpgradeJournal
from tests.stories.core.base.upgrade.upgrade import upgrade, upgrading
from tests.stories.core.base.upgrade.support.move_samples import PATH
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_code_outcome, expect_lines, expect_value_with, expect_value_without

NOTES, TAGS, RETRYABLE_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:RetryableTagsModule"


def test_the_dry_run_prints_what_would_move_as_a_plain_table_and_says_nothing_was_written(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    text = UpgradeJournal(story.home).run(dry_run=True).text
    lines = text.splitlines()
    expect_lines_4(lines, "what would move")
    expect_split_lines_3(lines, ["module", "rows", "left", "behind"])
    expect_split_lines_2(2, "movenotes", "2", "note_drafts: 1 rows", lines)
    expect_split_lines(2, "movetags", "2", lines)
    expect_value_with(lines, "tables no module claims")
    expect_split_lines(2, "old_reports", "1", lines)
    expect_lines(lines, 1, "nothing was written")


def test_the_upgrade_prints_the_same_as_what_moved_and_the_path_of_the_backup(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    text = upgrade(story).text
    lines = text.splitlines()
    expect_value_with(lines, "what moved")
    expect_startswith_lines_2("backup: ", lines)
    expect_split_lines(2, "movenotes", "2", lines)
    expect_value_without(lines, "nothing was written")


def test_a_failed_upgrade_says_which_module_failed_what_rolled_back_what_stayed_moved_and_how_to_finish(new_story):
    story, version_four = upgrading(new_story, NOTES, RETRYABLE_TAGS)
    outcome = upgrade(story)
    lines = outcome.text.splitlines()
    expect_row(outcome, code=1)
    expect_value_with(lines, "failed: movetags (the tags table could not be read)")
    expect_value_with(lines, "rolled back: movetags")
    expect_startswith_lines("stayed moved: ", "movenotes", "movetags", lines)
    expect_lines(lines, 1, "run journal upgrade again to finish")


def test_the_report_is_saved_and_a_rerun_replaces_it_keeping_the_earlier_one(new_story):
    story, version_four = upgrading(new_story, NOTES, RETRYABLE_TAGS)
    first = upgrade(story)
    saved = story.home.folder / "upgrade-report.txt"
    expect_saved(saved, first.text.strip())
    second = upgrade(story)
    expect_code_outcome(second, 0)
    expect_saved(saved, second.text.strip())
    expect_folder_home_upgrade(story, "upgrade-report.1.txt", first.text.strip())


def test_the_first_start_after_an_upgrade_shows_one_chat_mark_with_the_counts_and_a_second_start_shows_none(new_story):
    from tests.stories.core.modules.chat.support.mark_samples import expect_mark_count, mark_count, marks_text
    from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story

    story = upgraded_story(new_story)
    story.run_listeners()
    expect_mark_count_minimum(mark_count, story, 1)
    text = marks_text(story)
    expect_value_with(text, "Upgraded from version 4: 4 tasks, 3 plans, 2 messages, 5 memories moved")
    starting_count = mark_count(story)
    story.run_listeners()
    expect_mark_count(story, starting_count)
    UpgradeJournal(story.home).run(confirmed=True)
    story.run_listeners()
    expect_mark_count(story, starting_count)


def expect_mark_count_minimum(mark_count, story, expected) -> None:
    actual = mark_count(story)
    assert actual >= expected, actual


def expect_folder_home_upgrade(story, text, expected) -> None:
    actual = (story.home.folder / text).read_text().strip()
    assert actual == expected, actual


def expect_saved(saved, expected) -> None:
    actual = saved.read_text().strip()
    assert actual == expected, actual


def expect_startswith_lines(text, text_2, text_3, lines) -> None:
    actual = any((line.startswith(text) and text_2 in line and (text_3 not in line) for line in lines))
    assert actual, actual


def expect_split_lines(number, text, text_2, lines) -> None:
    actual = any((line.split()[:number] == [text, text_2] for line in lines))
    assert actual, actual


def expect_startswith_lines_2(text, lines) -> None:
    actual = any((line.startswith(text) for line in lines))
    assert actual, actual


def expect_split_lines_2(number, text, text_2, text_3, lines) -> None:
    actual = any((line.split()[:number] == [text, text_2] and text_3 in line for line in lines))
    assert actual, actual


def expect_lines_4(lines, expected) -> None:
    actual = lines[0]
    assert actual == expected, actual


def expect_split_lines_3(lines, expected) -> None:
    actual = lines[1].split()
    assert actual == expected, actual
