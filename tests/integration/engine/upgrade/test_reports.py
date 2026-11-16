from tests.stories.support.story_checks import expect_value
from install.version_four.upgrade_journal import UpgradeJournal
from tests.integration.support.upgrade_steps import upgrade, upgrading
from tests.stories.engine.upgrade.support.move_samples import PATH
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_code_outcome, expect_lines, expect_value_with, expect_value_without

NOTES, TAGS, RETRYABLE_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:RetryableTagsModule"


def test_the_dry_run_prints_what_would_move_as_a_plain_table_and_says_nothing_was_written(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    text = UpgradeJournal(story.home).run(dry_run=True).text
    lines = text.splitlines()
    expect_value(lines[0], 'what would move')
    expect_value(lines[1].split(), ['module', 'rows', 'left', 'behind'])
    expect_value(bool(any((line.split()[:2] == ['movenotes', '2'] and 'note_drafts: 1 rows' in line for line in lines))), True)
    expect_value(bool(any((line.split()[:2] == ['movetags', '2'] for line in lines))), True)
    expect_value_with(lines, "tables no module claims")
    expect_value(bool(any((line.split()[:2] == ['old_reports', '1'] for line in lines))), True)
    expect_lines(lines, 1, "nothing was written")


def test_the_upgrade_prints_the_same_as_what_moved_and_the_path_of_the_backup(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    text = upgrade(story).text
    lines = text.splitlines()
    expect_value_with(lines, "what moved")
    expect_value(bool(any((line.startswith('backup: ') for line in lines))), True)
    expect_value(bool(any((line.split()[:2] == ['movenotes', '2'] for line in lines))), True)
    expect_value_without(lines, "nothing was written")


def test_a_failed_upgrade_says_which_module_failed_what_rolled_back_what_stayed_moved_and_how_to_finish(journal_with):
    story, version_four = upgrading(journal_with, NOTES, RETRYABLE_TAGS)
    outcome = upgrade(story)
    lines = outcome.text.splitlines()
    expect_row(outcome, code=1)
    expect_value_with(lines, "failed: movetags (the tags table could not be read)")
    expect_value_with(lines, "rolled back: movetags")
    expect_value(bool(any((line.startswith('stayed moved: ') and 'movenotes' in line and ('movetags' not in line) for line in lines))), True)
    expect_lines(lines, 1, "run journal upgrade again to finish")


def test_the_report_is_saved_and_a_rerun_replaces_it_keeping_the_earlier_one(journal_with):
    story, version_four = upgrading(journal_with, NOTES, RETRYABLE_TAGS)
    first = upgrade(story)
    saved = story.home.folder / "upgrade-report.txt"
    expect_value(saved.read_text().strip(), first.text.strip())
    second = upgrade(story)
    expect_code_outcome(second, 0)
    expect_value(saved.read_text().strip(), second.text.strip())
    expect_value((story.home.folder / 'upgrade-report.1.txt').read_text().strip(), first.text.strip())


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
