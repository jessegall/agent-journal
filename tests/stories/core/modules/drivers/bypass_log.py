import pytest

from engine.change.deleted import Deleted
from core.modules.drivers.support.driver_settings import HOOK_WAIT_SECONDS
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_rows import SettingRows
from engine.journal.journal_home import JournalHome
from core.modules.drivers.listeners.hook_wait_file_listener import HookWaitFileListener
from core.testing.hook_samples import HookSamples
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


def test_the_next_answered_hook_names_what_went_around_once_in_the_chat_and_to_the_agent(two_bypassed_hooks):
    story = two_bypassed_hooks
    expect_marks_text(story, "2 hooks went through unchecked while the journal did not answer")
    story.expect_rows(not log_file(story).exists())
    story.expect_hook_allowed("s-1", FINISHED, "2 of your hooks went through unchecked")
    story.run_listeners()
    story.expect_absent_hook_line("s-1", FINISHED, "went through unchecked")
    expect_count_marks(story, "went through unchecked", 1)


def test_a_helpers_hook_leaves_the_log_for_the_main_agent(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run_listeners()
    log_file(story).write_text(LOG_LINES)
    story.hook("sub-1", HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["a.py"], "diff": None}))
    story.run_listeners()
    story.expect_rows(log_file(story).exists())


def test_the_hook_wait_a_person_sets_reaches_the_file_the_go_hook_reads(new_story):
    story = new_story(fixture=UserJoined)
    home = story.container.get(JournalHome)
    home.hook_wait_file.parent.mkdir(parents=True, exist_ok=True)
    story.expect_success("setting set journal.core.drivers.hook-wait-seconds 12 --project", actor=story.user)
    story.run_listeners()
    story.expect_rows(home.hook_wait_file.read_text().strip() == "12")
    setting = next(row for row in story.container.get(SettingRows).kept_table(Setting).values() if row.key == HOOK_WAIT_SECONDS)
    story.container.get(HookWaitFileListener).handle(Deleted(setting), None)
    story.expect_rows(not home.hook_wait_file.exists())


@pytest.fixture
def two_bypassed_hooks(new_story):
    story = new_story(fixture=BuilderStarted)
    log_file(story).write_text(LOG_LINES)
    story.hook("s-1", FINISHED)
    story.run_listeners()
    return story
