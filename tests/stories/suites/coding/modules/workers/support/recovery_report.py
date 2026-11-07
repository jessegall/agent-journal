from core.testing.story import Story
from tests.stories.fixtures.worker_recovery import CHECK_WAIT_COUNT, HISTORY_COUNTS, RECOVERY_HELPERS, UNMOVED_LINK_COUNT, backup_history_counts, recovery_brief


def expect_recovery_report(story: Story) -> None:
    report = story.upgrade_text
    for number, helper_type, name, state, unfinished in RECOVERY_HELPERS:
        prefix = f"{helper_type} {name} had not finished ({state}):"
        if not unfinished:
            assert prefix not in report, prefix
            continue
        expected = f"{prefix} {recovery_brief(name)}; send this work again (version 4 {helper_type} {number})"
        assert expected in report, expected
    for table, count in HISTORY_COUNTS.items():
        assert f"dropped {table}: {count} rows" in report, table
    assert f"dropped check wait targets: {CHECK_WAIT_COUNT} rows" in report
    assert f"dropped links to a row that did not move: {UNMOVED_LINK_COUNT} rows" in report
    backup = story.home.folder / "version-4" / "journal.db"
    assert backup_history_counts(backup) == HISTORY_COUNTS
