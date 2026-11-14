from install.version_four.upgrade_journal import FINISHED_LINE, UpgradeJournal
from install.version_four.upgrade_outcome import UpgradeOutcome
from tests.stories.fixtures.version_four import version_four_fixture


def upgraded_story(new_story, prepare=None):
    """A story whose home holds the version 4 fixture database as journal.db and has been upgraded once, after
    prepare, when given, put what else version 4 kept in its folder."""
    story = new_story()
    version_four_fixture(story.home.folder / "journal.db")
    if prepare:
        prepare(story.home.folder)
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    story.upgrade_text = outcome.text
    return story


def repeated_upgrade(story) -> UpgradeOutcome:
    return UpgradeJournal(story.home).run(confirmed=True)


def expect_upgrade_text(story, text: str) -> None:
    assert text in story.upgrade_text, story.upgrade_text


def expect_upgrade_without_text(story, text: str) -> None:
    assert text not in story.upgrade_text, story.upgrade_text


def expect_upgrade_finished(story) -> None:
    assert repeated_upgrade(story).text == FINISHED_LINE


def expect_output_without_line(story, command: str, line: str) -> None:
    output = story.run(command).output_text
    assert line not in output.splitlines(), output
