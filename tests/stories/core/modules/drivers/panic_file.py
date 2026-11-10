from engine.journal.journal_home import JournalHome
from core.modules.drivers.ticks.panic_watch import PanicWatch
from engine.testing.examples.hook_samples import HookSamples
from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import expect_marks_text, marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value_with

EDIT_SAMPLE = HookSamples.shell("echo hold > .journal/panic", ShellPart("echo", CommandCategory.EDIT, ["hold"]), redirects=["> .journal/panic"])
TEXT = "who: main agent\nwhy: the journal does not answer\n"


def panic_file(story):
    home = story.container.get(JournalHome)
    home.panic_announced.parent.mkdir(parents=True, exist_ok=True)
    return home


def test_the_journal_shows_a_mark_with_the_reason_when_the_panic_file_appears_and_when_it_is_removed(new_story):
    story = new_story(fixture=BuilderStarted)
    home = panic_file(story)
    PanicWatch()(story.container)
    story.expect_rows("Panic" not in marks_text(story))
    home.panic_file.write_text(TEXT)
    PanicWatch()(story.container)
    PanicWatch()(story.container)
    expect_marks_text(story, "Panic: the main agent works around the journal. the journal does not answer")
    home.panic_count.write_text("4")
    home.panic_file.unlink()
    PanicWatch()(story.container)
    expect_marks_text(story, "The panic ended: the journal answers again. It began because: the journal does not answer")
    story.expect_rows(not home.panic_count.exists())


def test_a_panic_file_with_no_reason_shows_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    home = panic_file(story)
    home.panic_file.write_text("who: main agent\nwhy:\n")
    PanicWatch()(story.container)
    story.expect_rows("Panic" not in marks_text(story), not home.panic_announced.is_file())


def test_the_bypass_lines_are_reported_while_the_panic_file_exists(new_story):
    story = new_story(fixture=BuilderStarted)
    home = panic_file(story)
    home.panic_file.write_text(TEXT)
    PanicWatch()(story.container)
    home.bypass_log.write_text("1700000000 hook claude panic\n1700000005 hook claude panic\n")
    PanicWatch()(story.container)
    expect_marks_text(story, "2 hooks went through unchecked during the panic")
    story.expect_rows(not home.bypass_log.exists())


def test_a_main_agent_may_write_the_panic_file_only_after_the_server_failed_to_answer(new_story):
    story = new_story(fixture=BuilderStarted)
    home = panic_file(story)
    story.expect_hook_refusal("s-1", EDIT_SAMPLE, "the panic file is for a journal that does not answer")
    home.bypass_log.write_text("1700000000 hook claude\n")
    story.expect_hook_allowed("s-1", EDIT_SAMPLE)
