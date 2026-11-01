from core.base.journal_home import JournalHome
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted, SubagentStarted
from tests.stories.core.support.fixtures import UserJoined

FINISHED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
LOG_LINES = "1700000000 hook claude\n1700000005 hook claude\n"


def log_file(story):
    path = story.container.get(JournalHome).bypass_log
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def test_the_next_answered_hook_names_what_went_around_once_in_the_chat_and_to_the_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    log_file(story).write_text(LOG_LINES)
    story.hook("s-1", FINISHED)
    story.run_listeners()
    assert "2 hooks went through unchecked while the journal did not answer" in marks_text(story), marks_text(story)
    story.expect_rows(not log_file(story).exists())
    story.expect_hook_allowed("s-1", FINISHED, "2 of your hooks went through unchecked")
    story.run_listeners()
    story.expect_absent_hook_line("s-1", FINISHED, "went through unchecked")
    assert marks_text(story).count("went through unchecked") == 1, marks_text(story)


def test_one_hook_is_said_in_the_singular_and_an_empty_log_says_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    log_file(story).write_text("1700000000 hook claude\n")
    story.hook("s-1", FINISHED)
    story.run_listeners()
    assert "1 hook went through unchecked" in marks_text(story), marks_text(story)
    log_file(story).write_text("")
    story.hook("s-1", FINISHED)
    story.run_listeners()
    assert marks_text(story).count("went through unchecked") == 1, marks_text(story)


def test_a_subagents_hook_leaves_the_log_for_the_main_agent(new_story):
    story = new_story(fixture=SubagentStarted)
    story.run_listeners()
    log_file(story).write_text(LOG_LINES)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Read", "category": "read", "files": ["a.py"], "diff": None}).with_fields(subagent="sub-1"))
    story.run_listeners()
    story.expect_rows(log_file(story).exists())


def test_the_hook_wait_a_person_sets_reaches_the_file_the_go_hook_reads(new_story):
    story = new_story(fixture=UserJoined)
    home = story.container.get(JournalHome)
    home.hook_wait_file.parent.mkdir(parents=True, exist_ok=True)
    story.expect_success("setting set journal.core.drivers.hook-wait-seconds 12 --project", actor=story.user)
    story.run_listeners()
    story.expect_rows(home.hook_wait_file.read_text().strip() == "12")
