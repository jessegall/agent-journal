from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_outcome_with


def test_version_4s_voice_settings_move_under_the_voices_module_names(new_story):
    story = upgraded_story(new_story)
    shown = story.run("setting list")
    shown.expect_text('journal.core.voices.profile  "coach"')
    shown.expect_text('journal.core.voices.avatar-shown  "working"')
    story.expect_text("voice list", "* coach")


def test_a_setting_no_module_declares_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "skipped settings 2: no module declares the key no.such.key")


def test_a_declared_key_moves_once_per_scope_with_its_value_and_a_second_one_for_the_same_scope_is_skipped(new_story):
    import sqlite3

    from install.upgrade_journal import UpgradeJournal
    from tests.stories.engine.upgrade.support.move_samples import PATH
    from tests.stories.fixtures.version_four import version_four_fixture

    story = new_story(f"{PATH}:PrefsModule")
    database = version_four_fixture(story.home.folder / "journal.db")
    connection = sqlite3.connect(database)
    connection.executemany("INSERT INTO settings (environment_id, key, value) VALUES (?, ?, ?)",
                           [(None, "moveprefs.limit", "7"), (None, "moveprefs.limit", "8"), (1, "moveprefs.limit", "9")])
    connection.commit()
    connection.close()
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    expect_row(outcome, code=0)
    expect_outcome_with(outcome, "skipped settings 12: the key moveprefs.limit is already moved for that scope")
    listing = story.run("setting list")
    listing.expect_text("moveprefs.limit  7")
    listing.expect_text("moveprefs.limit  9")
    listing.expect_no_text("moveprefs.limit  8")


def test_a_version_4_text_of_kinds_becomes_the_list_version_5_declares(new_story):
    story = upgraded_story(new_story)
    story.expect_text("setting list", "journal.suites.coding.worker-command-types  ")
    story.expect_text("setting show journal.suites.coding.worker-command-types", "read")


def test_a_version_4_key_with_no_counterpart_is_listed_by_its_key_as_not_carried(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "skipped settings")
    expect_upgrade_text(story, "no module declares the key features.aliases")
