from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_rows import SettingRows
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def loaded_setting_rows(home: JournalHome) -> int:
    container = synced_container(home)
    database = container.get(Database)
    try:
        container.get(SettingRows).kept_table(Setting)
        return database.repeated_work.tables["settings"]
    finally:
        database.close()


def test_a_fresh_container_does_not_load_the_settings_table_again(new_story):
    home = new_story(fixture=MainEnvironment).container.get(JournalHome)
    loaded_setting_rows(home)
    expect_value(loaded_setting_rows(home), 0)
