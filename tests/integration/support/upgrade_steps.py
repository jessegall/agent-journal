import sqlite3
from pathlib import Path
from engine.database.statement import Statement
from install.version_four.upgrade_journal import UpgradeJournal
from install.version_four.upgrade_outcome import UpgradeOutcome
from tests.stories.engine.upgrade.support.move_samples import FAILURES, ORDER, PATH, version_four_database

NOTES, TAGS, RETRYABLE_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:RetryableTagsModule"


def count(story, table: str) -> int:
    return story.database.rows(Statement(f"SELECT count(*) AS total FROM {table}"))[0]["total"]


def upgrading(journal_with, *modules: str, with_rows: bool = True):
    story = journal_with(*modules)
    ORDER.clear()
    FAILURES["tags"] = 0
    return story, version_four_database(story.home.folder, "journal.db", with_rows)


def upgrade(story, dry_run: bool = False, confirmed: bool = True) -> UpgradeOutcome:
    return UpgradeJournal(story.home).run(dry_run=dry_run, confirmed=confirmed)


def expect_upgrade(story, *lines: str, dry_run: bool = False) -> UpgradeOutcome:
    outcome = upgrade(story, dry_run)
    assert outcome.code == 0, outcome.text
    missing = [line for line in lines if line not in outcome.text.splitlines()]
    assert not missing, f"{missing} not in {outcome.text}"
    return outcome


def expect_refusal(story, text: str) -> None:
    outcome = upgrade(story)
    assert outcome.code == 1 and text in outcome.text, outcome


def content(path: Path) -> list[str]:
    connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
    try:
        return list(connection.iterdump())
    finally:
        connection.close()


def line_value(text: str, label: str) -> str:
    return next(line.split(label, 1)[1].strip() for line in text.splitlines() if line.startswith(label))


def expect_count(story, table: str, expected) -> None:
    actual = count(story, table)
    assert actual == expected, actual


def expect_table_counts(story, text, text_2, expected) -> None:
    actual = (count(story, text), count(story, text_2))
    assert actual == expected, actual


def expect_upgrade_code(story, expected) -> None:
    actual = upgrade(story).code
    assert actual == expected, actual
