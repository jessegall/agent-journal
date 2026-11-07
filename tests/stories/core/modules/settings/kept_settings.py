from core.base.database.database import Database
from tests.stories.core.support.fixtures import UserJoined

KEY = "journal.core.processes.foreground-seconds"
SETTING_READ_LINE = f"setting show {KEY}"


def settings_rows_read(story) -> int:
    return story.container.get(Database).tally.points().tables["settings"]


def test_the_settings_are_read_once_and_a_change_keeps_them_current(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f"setting set {KEY} 20 --project", actor=story.user)
    story.expect_success(SETTING_READ_LINE, "value: 20", actor=story.user)
    first_read_rows = settings_rows_read(story)
    story.expect_success(SETTING_READ_LINE, "value: 20", actor=story.user)
    expect_settings_rows_read(story, first_read_rows)
    story.run(f"setting set {KEY} 30 --project", actor=story.user)
    story.expect_success(SETTING_READ_LINE, "value: 30", actor=story.user)
    expect_settings_rows_read(story, first_read_rows)


def expect_settings_rows_read(story, expected) -> None:
    actual = settings_rows_read(story)
    assert actual == expected, actual
