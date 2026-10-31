from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.chat.support.mark_samples import FAULT_SAMPLE, marks_text
from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.fixtures import UserJoined


def test_the_chat_module_declares_the_fault_mark_under_the_journal_group(new_story):
    story = new_story(fixture=UserJoined)
    marks = [mark for mark in Registry.read(story.container.get(Database)).marks if mark.module == "journal.core.chat"]
    assert [(mark.type, mark.family, mark.group, mark.shipped) for mark in marks] == [("chat.fault", "chat.faults", "journal", True)]


def test_a_failing_command_shows_one_fault_mark_and_the_file_keeps_the_trace(new_story):
    story = new_story(FAULT_SAMPLE, fixture=UserJoined)
    story.run("chat-mark boom --environment main")
    story.run_listeners()
    assert marks_text(story).count("RuntimeError: the sample command broke") == 1, marks_text(story)
    assert "the sample command broke" in story.error_log_text() and "Traceback" in story.error_log_text()
    story.expect_text("journal-fault list", "RuntimeError")


def test_a_failing_hook_rule_shows_one_fault_mark_and_the_file_keeps_the_trace(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    assert marks_text(story).count("samples.failing-rule") == 1, marks_text(story)
    assert "the sample rule failed" in story.error_log_text()
