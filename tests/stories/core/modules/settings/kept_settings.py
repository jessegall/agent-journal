from core.base.database.database import Database
from tests.stories.core.support.fixtures import UserJoined

KEY = "journal.core.processes.foreground-seconds"
SHOW = f"setting show {KEY}"


def settings_rows_read(story) -> int:
    return story.container.get(Database).tally.points().tables["settings"]


def test_the_settings_are_read_once_and_again_only_when_one_changes(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f"setting set {KEY} 20 --project", actor=story.user)
    story.expect_success(SHOW, "value: 20", actor=story.user)
    read_once = settings_rows_read(story)
    story.expect_success(SHOW, "value: 20", actor=story.user)
    assert settings_rows_read(story) == read_once
    story.run(f"setting set {KEY} 30 --project", actor=story.user)
    story.expect_success(SHOW, "value: 30", actor=story.user)
    assert settings_rows_read(story) > read_once
