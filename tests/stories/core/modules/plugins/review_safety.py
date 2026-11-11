from core.modules.chat.models.chat_mark import ChatMark
from tests.stories.core.modules.plugins.support.event_stories import REFUSAL, SECOND_JOB, TASK_CREATED, event_page, event_plugin_story, install_event_plugin, logged_events
from tests.stories.core.modules.plugins.event_manifest import replace_module
from tests.stories.core.modules.plugins.support.event_modules import FORMER_NOTE_CREATED, NOTE_CREATED, NOTES, REMOVED_NOTES_MODULE
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip

AGENT_REFUSAL = "an agent may not use journal plugin run"
RUN_LINE = "plugin run -- journal plan approve 1"
OUTWARD = "reaches past the journal"
SKIP_REASON = '--skip-reason "the plugin is wrong here"'
SECOND_REFUSAL = "[plugin second] not today"


def test_s63_an_agent_is_refused_plugin_run(new_story):
    story = event_plugin_story(new_story)
    story.expect_refusal(RUN_LINE, AGENT_REFUSAL, actor=story.agent)
    story.expect_refusal(f"plugin run --agent {story.agent.id} -- journal plan approve 1", AGENT_REFUSAL, actor=story.agent)


def test_s66_a_skip_names_one_plugin_and_the_other_still_refuses(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "refuse.sh"}, name="second")
    story.expect_refusal(SECOND_JOB, REFUSAL, actor=story.agent)
    confirmed_skip(story, "plugins.event-guard:events", story.agent)
    story.expect_refusal(f"{SECOND_JOB} --skip-guard plugins.event-guard:events {SKIP_REASON}", SECOND_REFUSAL, actor=story.agent)
    story.expect_refusal(f"{SECOND_JOB} --skip-guard plugins.event-guard {SKIP_REASON}", "has no skip", actor=story.agent)
    story.expect_success(f"{SECOND_JOB} --skip-guard plugins.event-guard:events --skip-guard plugins.event-guard:second {SKIP_REASON}", actor=story.user)
    story.expect_rows("plugins.event-guard:events" in logged_events(story, "task.create")[-1].skipped_guards)


def test_s68_a_removed_key_tells_the_chat_once(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh"}, modules=[NOTES])
    replace_module(story, NOTES, REMOVED_NOTES_MODULE)
    story.run_listeners()
    marks = story.story_rows(ChatMark)
    matching_marks = [mark for mark in marks if "events" in mark.text and NOTE_CREATED in mark.text]
    story.expect_rows(len(matching_marks) == 1, "no longer runs" in matching_marks[0].text)
    code, text = story.synced()
    story.expect_rows(code == 0, len([mark for mark in story.story_rows(ChatMark) if NOTE_CREATED in mark.text]) == 1)


def test_s68_a_key_with_a_former_key_line_gives_no_mark(new_story):
    story = event_plugin_story(new_story, {"event": FORMER_NOTE_CREATED, "commit": "see.sh"}, modules=[NOTES])
    story.expect_rows(not [mark for mark in story.story_rows(ChatMark) if FORMER_NOTE_CREATED in mark.text])
