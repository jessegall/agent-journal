import threading

from install.upgrade_journal import FINISHED_LINE, UpgradeJournal
from install.upgrade_outcome import UpgradeOutcome
from tests.stories.core.base.upgrade.upgrade import count, upgrading
from tests.stories.core.base.upgrade.support.move_samples import PATH

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
    assert len(answers) == RUNNERS and all(answer.code == 0 for answer in answers), [answer.text for answer in answers]
    assert sorted(answer.text == FINISHED_LINE for answer in answers) == [False, True]
    assert (count(story, "notes"), count(story, "tags")) == (2, 2)
    assert not version_four.exists() and len(list((story.home.folder / "version-4").glob("*/journal.db"))) == 1


def test_a_second_upgrade_while_the_first_holds_the_lock_waits_for_it(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    from install.server_lock import ServerLock

    with ServerLock(story.home):
        answers: list[UpgradeOutcome] = []
        runner = threading.Thread(target=lambda: answers.append(UpgradeJournal(story.home).run(confirmed=True)))
        runner.start()
        runner.join(timeout=1.5)
        assert runner.is_alive() and answers == [] and version_four.exists()
    runner.join(timeout=120)
    assert answers[0].code == 0 and not version_four.exists()
