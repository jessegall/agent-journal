import threading

from install.version_four.upgrade_journal import FINISHED_LINE, UpgradeJournal
from install.version_four.upgrade_outcome import UpgradeOutcome
from tests.stories.engine.upgrade.upgrade import expect_table_counts, upgrading
from tests.stories.engine.upgrade.support.move_samples import PATH
from tests.stories.support.story_checks import expect_absent_exists_version_four, expect_answers, expect_exists_version_four, expect_value

NOTES, TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule"
RUNNERS = 2


def parallel_upgrades(story) -> list[UpgradeOutcome]:
    answers: list[UpgradeOutcome] = []
    runners = [threading.Thread(target=lambda: answers.append(UpgradeJournal(story.home).run(confirmed=True))) for _ in range(RUNNERS)]
    for runner in runners:
        runner.start()
    for runner in runners:
        runner.join(timeout=120)
    return answers


def test_two_parallel_upgrades_run_in_turn_the_second_finds_nothing_left_and_no_row_is_moved_twice(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    answers = parallel_upgrades(story)
    expect_answers(answers, RUNNERS)
    expect_code_answer_answers(0, answers)
    expect_answer_answers(FINISHED_LINE, answers, [False, True])
    expect_table_counts(story, "notes", "tags", (2, 2))
    expect_absent_exists_version_four(version_four)
    expect_home_files(story, "version-4", "*/journal.db", 1)


def test_a_second_upgrade_while_the_first_holds_the_lock_waits_for_it(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    from install.server_lock import ServerLock

    with ServerLock(story.home):
        answers: list[UpgradeOutcome] = []
        runner = threading.Thread(target=lambda: answers.append(UpgradeJournal(story.home).run(confirmed=True)))
        runner.start()
        runner.join(timeout=1.5)
        expect_running_runner(runner)
        expect_value(answers, [])
        expect_exists_version_four(version_four)
    runner.join(timeout=120)
    expect_code_answers(answers, 0)
    expect_absent_exists_version_four(version_four)


def expect_code_answers(answers, expected) -> None:
    actual = answers[0].code
    assert actual == expected, actual


def expect_running_runner(runner) -> None:
    actual = runner.is_alive()
    assert actual, actual


def expect_home_files(story, text, text_2, expected) -> None:
    actual = len(list((story.home.folder / text).glob(text_2)))
    assert actual == expected, actual


def expect_answer_answers(item, answers, expected) -> None:
    actual = sorted((answer.text == item for answer in answers))
    assert actual == expected, actual


def expect_code_answer_answers(number, answers) -> None:
    actual = all((answer.code == number for answer in answers))
    assert actual, actual
