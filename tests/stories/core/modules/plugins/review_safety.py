from tests.stories.core.modules.plugins.support.event_stories import REFUSAL, SECOND_JOB, TASK_CREATED, event_plugin_story, install_event_plugin, logged_events
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
