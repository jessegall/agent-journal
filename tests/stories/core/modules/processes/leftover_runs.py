from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

RESUME = HookSamples.session_start().with_raw({"source": "resume"})
COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})
CLEAR = HookSamples.session_start().with_raw({"source": "clear"})


def running_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    return story, moved_run(story, "make test")


def test_a_resumed_session_ends_a_run_left_open_as_orphaned(new_story):
    story, process = running_story(new_story)
    story.hook("s-1", RESUME)
    story.expect_text(f"process show {process.id}", "state: orphaned", actor=story.agent)


def test_a_clear_leaves_a_run_going(new_story):
    story, process = running_story(new_story)
    story.hook("s-1", CLEAR)
    story.expect_text(f"process show {process.id}", "state: background", actor=story.agent)
