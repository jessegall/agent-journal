import pytest

from engine.event.deleted import Deleted
from core.modules.drivers.support.driver_settings import HOOK_WAIT_SECONDS
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_rows import SettingRows
from engine.journal.journal_home import JournalHome
from core.modules.drivers.listeners.hook_wait_file_listener import HookWaitFileListener
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import marks_text, expect_marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderHelper
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_count_marks, expect_value_with

FINISHED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
LOG_LINES = "1700000000 hook claude\n1700000005 hook claude\n"


def log_file(story):
    path = story.container.get(JournalHome).bypass_log
    path.parent.mkdir(parents=True, exist_ok=True)
    return path






def test_the_hook_wait_a_person_sets_reaches_the_file_the_go_hook_reads(played):
    story = played(UserJoined)
    home = story.container.get(JournalHome)
    home.hook_wait_file.parent.mkdir(parents=True, exist_ok=True)
    story.expect_success(f"setting set {HOOK_WAIT_SECONDS} 12 --project", actor=story.user)
    story.run_listeners()
    story.expect_rows(home.hook_wait_file.read_text().strip() == "12")
    setting = next(row for row in story.container.get(SettingRows).kept_table(Setting).values() if row.key == HOOK_WAIT_SECONDS)
    story.container.get(HookWaitFileListener).handle(Deleted(setting), None)
    story.expect_rows(not home.hook_wait_file.exists())


@pytest.fixture
def two_bypassed_hooks(played):
    story = played(BuilderStarted)
    log_file(story).write_text(LOG_LINES)
    story.hook("s-1", FINISHED)
    story.run_listeners()
    return story
