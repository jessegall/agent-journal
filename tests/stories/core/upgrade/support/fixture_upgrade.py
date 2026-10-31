from install.upgrade_journal import UpgradeJournal
from install.upgrade_outcome import UpgradeOutcome
from tests.stories.fixtures.version_four import version_four_fixture


def upgraded_story(new_story):
    """A story whose home holds the version 4 fixture database as journal.db and has been upgraded once."""
    story = new_story()
    version_four_fixture(story.home.folder / "journal.db")
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    story.upgrade_text = outcome.text
    return story


def upgrade_again(story) -> UpgradeOutcome:
    return UpgradeJournal(story.home).run(confirmed=True)
