from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_setting_a_module_declares_moves_under_its_full_name_with_its_value(new_story):
    story = upgraded_story(new_story)
    assert "journal.core.memories.keyword-limit  4" in story.run("setting list").output_text


def test_a_setting_no_module_declares_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    assert "skipped settings 2: no module declares the key no.such.key" in story.upgrade_text


def test_a_declared_key_moves_once_per_scope_with_its_value_and_a_second_one_for_the_same_scope_is_skipped(new_story):
    import sqlite3

    from install.upgrade_journal import UpgradeJournal
    from tests.stories.core.base.upgrade.support.move_samples import PATH
    from tests.stories.fixtures.version_four import version_four_fixture

    story = new_story(f"{PATH}:PrefsModule")
    database = version_four_fixture(story.home.folder / "journal.db")
    connection = sqlite3.connect(database)
    connection.executemany("INSERT INTO settings (environment_id, key, value) VALUES (?, ?, ?)",
                           [(None, "moveprefs.limit", "7"), (None, "moveprefs.limit", "8"), (1, "moveprefs.limit", "9")])
    connection.commit()
    connection.close()
    outcome = UpgradeJournal(story.home).run(confirmed=True)
    assert outcome.code == 0, outcome.text
    assert "skipped settings 9: the key moveprefs.limit is already moved for that scope" in outcome.text
    listing = story.run("setting list").output_text
    assert "moveprefs.limit" in listing and "7" in listing and "9" in listing and "8" not in listing.replace("moveprefs", "")


def test_a_version_4_key_with_a_version_5_counterpart_moves_under_the_full_key(new_story):
    story = upgraded_story(new_story)
    shown = story.run("setting list").output_text
    assert "journal.suites.coding.workers.worker-limit  3" in shown
    assert "journal.suites.coding.workers.builder-dispatches-workers  false" in shown


def test_a_version_4_text_of_kinds_becomes_the_list_version_5_declares(new_story):
    story = upgraded_story(new_story)
    assert "journal.suites.coding.worker-command-types  " in story.run("setting list").output_text
    story.expect_text("setting show journal.suites.coding.worker-command-types", "read")


def test_a_version_4_key_with_no_counterpart_is_listed_by_its_key_as_not_carried(new_story):
    story = upgraded_story(new_story)
    assert "skipped settings" in story.upgrade_text and "no module declares the key features.aliases" in story.upgrade_text
